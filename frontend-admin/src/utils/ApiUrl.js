// export const API_URL = 'http://localhost:4000/api';
// export const API_URL = "http://192.168.0.148:4000/api";
// export const API_URL = 'https://ec19f0a2a1000bcc066e0def301792c6.serveo.net/api';
// export const Image_URL = "http://192.168.0.159:4000";
// export const Image_URL = 'http://localhost:4000';
const isLocal = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1" || 
  window.location.hostname.startsWith("192.168.");

// Local admin testing should use the deployed API and its production data.
// Override this at build time with REACT_APP_DEPLOYED_API_ORIGIN when testing
// against a different environment (for example, QA).
const deployedApiOrigin = process.env.REACT_APP_DEPLOYED_API_ORIGIN || "https://kheloindore.in";

const apiOrigin = isLocal
  ? deployedApiOrigin
  : `${window.location.protocol}//${window.location.hostname}`;

export const API_URL = `${apiOrigin}/api`;
export const Image_URL = apiOrigin;
