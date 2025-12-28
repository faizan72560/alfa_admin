
import { api } from './api';

interface AuthResponse {
    accessToken: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', { email, password, userType: 'admin' });
};

export const logout = async (): Promise<void> => {
    return api.post('/auth/logout', {});
};

export const getWebAuthnDevices = async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/auth/webauthn/devices');
    return response.data;
};

export const deleteWebAuthnDevice = async (credentialId: string): Promise<void> => {
    await api.delete(`/auth/webauthn/devices/${credentialId}`);
};
