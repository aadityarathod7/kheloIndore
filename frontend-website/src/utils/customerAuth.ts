const decodePayload = (token: string) => {
  try {
    const encoded = token.split(".")[1];
    return encoded ? JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))) : null;
  } catch {
    return null;
  }
};

/** The public booking site must never treat a partner/admin token as a customer session. */
export const getCustomerToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = decodePayload(token);
  return payload?.role === "User" && payload?.exp * 1000 > Date.now() ? token : null;
};

export const hasCustomerSession = () => Boolean(getCustomerToken());
