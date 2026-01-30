import api from './axios';

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Request password reset code
 * Sends a 6-digit OTP to the user's email
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>('/auth/forgot-password', data);
  return response.data;
}

/**
 * Verify the reset code provided by the user
 */
export async function verifyResetCode(data: VerifyResetCodeRequest): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>('/auth/verify-reset-code', data);
  return response.data;
}

/**
 * Reset password with new password
 * Requires valid reset code
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
  return response.data;
}
