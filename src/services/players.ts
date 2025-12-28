
import { api } from './api';

export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    mainPosition?: string;
    currentClub?: string;
    nationality?: string; // citizenship?
    age?: number; // derived from dateOfBirth?
    marketValue?: string; // expectedTransferFee?
    status?: string; // transferStatus?
}

export const getPlayers = async (): Promise<Player[]> => {
    return api.get<Player[]>('/players');
};

export const verifyPlayer = async (id: string): Promise<Player> => {
    return api.patch<Player>(`/players/${id}/verify`, {});
};

export const deletePlayer = async (id: string): Promise<void> => {
    return api.delete(`/players/${id}`);
};

export const getRankedPlayers = async (): Promise<any[]> => {
    return api.get<any[]>('/players/ranked');
};


