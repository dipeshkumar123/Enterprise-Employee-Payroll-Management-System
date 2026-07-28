/**
 * JWT Utility for token decoding, expiry checking, and validation
 */

/**
 * Decode a JWT token payload without verifying signature (client-side only)
 * @param {string} token - The JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} True if token is expired or invalid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  // Consider token expired 30 seconds before actual expiry for safety margin
  return currentTime >= (expiryTime - 30000);
};

/**
 * Check if a refresh token is expired
 * @param {string} token - The refresh token
 * @returns {boolean} True if refresh token is expired or invalid
 */
export const isRefreshTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const expiryTime = decoded.exp * 1000;
  return Date.now() >= expiryTime;
};

/**
 * Get token expiry timestamp
 * @param {string} token - The JWT token
 * @returns {number|null} Expiry timestamp in milliseconds or null
 */
export const getTokenExpiryTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000;
};

/**
 * Get remaining time before token expiry in seconds
 * @param {string} token - The JWT token
 * @returns {number} Remaining seconds (0 if expired)
 */
export const getTokenRemainingTime = (token) => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return 0;
  const remaining = Math.floor((expiryTime - Date.now()) / 1000);
  return Math.max(0, remaining);
};

/**
 * Extract user information from JWT token
 * @param {string} token - The JWT token
 * @returns {object|null} User info from token or null
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return {
    id: decoded.sub || decoded.id || decoded.userId,
    username: decoded.preferred_username || decoded.username || decoded.sub,
    email: decoded.email,
    roles: decoded.roles || decoded.authorities || [],
    scope: decoded.scope,
    ...decoded,
  };
};

