
import { api } from './api';

export interface AdminProfile {
    adminId: string;
    email: string;
    fullName: string;
}

export interface AdminSettings {
    notifyOnNewUser: boolean;
    notifyOnTransferRequest: boolean;
    notifyOnAgentApproval: boolean;
    autoApproveVerifiedAgents: boolean;
    sendEmailNotifications: boolean;
}

export const getAdminProfile = async (): Promise<AdminProfile> => {
    return api.get<AdminProfile>('/admin/profile/me');
};

export const updateAdminProfile = async (data: Partial<AdminProfile>): Promise<AdminProfile> => {
    return api.patch<AdminProfile>('/admin/profile/me', data);
};

export const getAdminSettings = async (): Promise<AdminSettings> => {
    return api.get<AdminSettings>('/admin/settings');
};

export const updateAdminSettings = async (data: Partial<AdminSettings>): Promise<AdminSettings> => {
    return api.patch<AdminSettings>('/admin/settings', data);
};

export const updateAdminPassword = async (data: any): Promise<void> => {
    return api.patch('/admin/profile/password', data);
};

export const exportUsers = async (format: 'csv' | 'xlsx'): Promise<Blob> => {
    return api.download(`/admin/export/users?format=${format}`);
};

export const exportTransfers = async (format: 'csv' | 'xlsx'): Promise<Blob> => {
    return api.download(`/admin/export/transfers?format=${format}`);
};

export const createAdmin = async (data: any): Promise<void> => {
    return api.post('/admin/create', data);
};


