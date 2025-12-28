import { api } from './api';

export interface SendNotificationData {
    audience?: 'All' | 'Active' | 'Pending';
    recipientIds?: string[];
    subject: string;
    message: string;
    data?: any;
    channels?: ('in-app' | 'email' | 'push')[];
}

export const sendNotification = async (data: SendNotificationData) => {
    return api.post<any>('/notifications/send', data);
};

export const broadcastNotification = async (data: { title: string; message: string; type?: string }) => {
    return api.post<any>('/notifications/send', {
        audience: 'All',
        subject: data.title,
        message: data.message,
        channels: ['in-app']
    });
};

export const getNotifications = async (): Promise<any[]> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/notifications');
    return response.data;
};

