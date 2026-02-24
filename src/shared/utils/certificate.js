/**
 * Certificate ID and verification code generation.
 */

export const generateCertificateNumber = () => {
  const prefix = "CERT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateVerificationCode = () => {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
};
