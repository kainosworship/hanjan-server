import { useAuthStore } from '@/stores/authStore';
import { apiPost } from '@/services/apiClient';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface OtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  verified: boolean;
  token: string;
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, setTokens, setUser, logout } = useAuthStore();

  const sendOtp = async (phone: string): Promise<OtpResponse> => {
    return apiPost<OtpResponse>('/auth/send-otp', { phone });
  };

  const verifyOtp = async (phone: string, code: string): Promise<VerifyOtpResponse> => {
    return apiPost<VerifyOtpResponse>('/auth/verify-otp', { phone, code });
  };

  const register = async (data: { phone: string; nickname: string; birthDate: string; gender: string }): Promise<TokenResponse> => {
    const result = await apiPost<TokenResponse>('/auth/register', data);
    await setTokens(result.accessToken, result.refreshToken);
    return result;
  };

  const login = async (phone: string): Promise<TokenResponse> => {
    const result = await apiPost<TokenResponse>('/auth/login', { phone });
    await setTokens(result.accessToken, result.refreshToken);
    return result;
  };

  const signOut = async () => {
    try {
      await apiPost('/auth/logout');
    } catch {
      // ignore
    }
    await logout();
  };

  return { user, isAuthenticated, isLoading, sendOtp, verifyOtp, register, login, signOut };
}
