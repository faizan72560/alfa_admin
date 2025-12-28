
import { api } from './api';

export interface Transfer {
    id: number;
    playerId: string;
    agentId: string;
    status: string;
    message: string;
    createdAt: string;
    updatedAt: string;

    player?: {
        firstName: string;
        lastName: string;
        currentClub: string;
    };
    agent?: {
        firstName: string;
        lastName: string;
    };
}

export const getTransfers = async (limit = 10, offset = 0, status?: string): Promise<Transfer[]> => {
    let url = `/transfers?limit=${limit}&offset=${offset}`;
    if (status && status !== 'all') {
        url += `&status=${status}`;
    }
    return api.get<Transfer[]>(url);
};

export const updateTransferStatus = async (id: number, status: string): Promise<Transfer> => {
    return api.patch<Transfer>(`/transfers/${id}`, { status });
};

export const getTransferById = async (id: string | number): Promise<Transfer> => {
    return api.get<Transfer>(`/transfers/${id}`);
};
