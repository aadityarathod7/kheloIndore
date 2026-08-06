// Lightweight security middleware (no external deps):
//  - securityHeaders: hardened HTTP response headers
//  - rateLimit: simple in-memory sliding-window limiter for auth endpoints
//  - corsOptions: restrictive CORS allow-list

// ---------------------------------------------------------------------------
// Security headers (helmet-lite)
// ---------------------------------------------------------------------------
const securityHeaders = (req, res, next) => {
  // Block MIME-sniffing of uploaded/attacker-controlled content
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Refuse to render the page inside frames (clickjacking)
  res.setHeader("X-Frame-Options", "DENY");
  // Minimal referrer leakage
  res.setHeader("Referrer-Policy", "no-referrer");
  // Keep browser features sandboxed.
  // NOTE: geolocation is deliberately NOT blocked — the homepage "use my
  // location" search feature calls navigator.geolocation.getCurrentPosition().
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), payment=(), interest-cohort=()"
  );
  // Stop IE from executing downloaded content in the site's context
  res.setHeader("X-Download-Options", "noopen");
  // HSTS only over HTTPS
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  next();
};

// ---------------------------------------------------------------------------
// In-memory rate limiter (per IP + route). Used on auth endpoints to slow
// down OTP/credential brute-force. Sliding window, no external store.
// ---------------------------------------------------------------------------
const rateLimit = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 min
  const max = options.max || 100;

  // Map key -> { count, resetAt }
  const hits = new Map();

  // Periodically purge expired buckets so memory stays bounded
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of hits) {
      if (bucket.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  // Don't keep the Node process alive just for the sweeper
  if (sweep.unref) sweep.unref();

  return (req, res, next) => {
    // Trust X-Forwarded-For only when the direct peer is the local proxy
    // (prevents attackers spoofing the header to reset their bucket).
    const peer = (req.socket?.remoteAddress || "").toLowerCase();
    const isLocalProxy =
      peer === "127.0.0.1" || peer === "::1" || peer === "::ffff:127.0.0.1";
    const ip = isLocalProxy
      ? req.headers["x-forwarded-for"]?.split(",")[0].trim() || peer
      : peer || req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
    const key = `${ip}|${req.originalUrl || req.url}`;
    const now = Date.now();

    let bucket = hits.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      hits.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }
    next();
  };
};

// ---------------------------------------------------------------------------
// CORS — allow the known app origins only (the API is also served same-origin
// for the built frontend, so browsers calling the same host are always fine).
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://kheloindore.in",
  "https://www.kheloindore.in",
  "https://qa.kheloindore.in",
]);

// Allow extending the origin list via env without a code deploy
// (comma-separated, e.g. CORS_ORIGINS=https://admin.kheloindore.in,https://staging.kheloindore.in)
if (process.env.CORS_ORIGINS) {
  process.env.CORS_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean)
    .forEach((o) => ALLOWED_ORIGINS.add(o));
}

const corsOptions = (req, callback) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.has(origin)) {
    callback(null, { origin: origin ? true : false, credentials: true });
  } else {
    // Disallow unknown origins (no CORS headers returned -> browser blocks)
    callback(null, { origin: false, credentials: true });
  }
};

module.exports = { securityHeaders, rateLimit, corsOptions };
