import api from './api';

export interface LoginRequest { email: string; password: string; }
export interface AuthResponse {
  accessToken: string; refreshToken: string;
  email: string; role: string; nom: string; prenom: string; userId: number;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  logout: () => { localStorage.clear(); window.location.href = '/login'; },
};
