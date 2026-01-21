/**
 * JWT Token validation utilities
 */

export interface JWTPayload {
  sub: string;
  userType: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (for debugging)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("[Token Debug] Invalid JWT format");
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch (error) {
    console.error("[Token Debug] Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payload.exp < currentTime;

  console.log("[Token Debug] Current time:", currentTime);
  console.log("[Token Debug] Token expires at:", payload.exp);
  console.log("[Token Debug] Token issued at:", payload.iat);
  console.log("[Token Debug] Is expired:", isExpired);

  if (isExpired) {
    const expiredSince = currentTime - payload.exp;
    console.log("[Token Debug] Token expired", expiredSince, "seconds ago");
  } else {
    const expiresIn = payload.exp - currentTime;
    console.log("[Token Debug] Token expires in", expiresIn, "seconds");
  }

  return isExpired;
}

/**
 * Get token info for debugging
 */
export function getTokenInfo(token: string) {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = payload.exp < currentTime;
  const expiresIn = payload.exp - currentTime;
  const age = currentTime - payload.iat;

  return {
    userId: payload.sub,
    userType: payload.userType,
    issuedAt: new Date(payload.iat * 1000).toISOString(),
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    isExpired,
    expiresIn,
    age,
    ageInHours: Math.floor(age / 3600),
    expiresInHours: Math.floor(expiresIn / 3600),
  };
}
