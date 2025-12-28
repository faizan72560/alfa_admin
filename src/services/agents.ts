
import { api } from './api';

export interface Agent {
    agentId: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    country?: string;
    companyWebsite?: string;
    profilePhotoUrl?: string;
    createdAt: string;
}

export const getAgents = async (limit = 10, offset = 0): Promise<Agent[]> => {
    return api.get<Agent[]>(`/agents/admin/list?limit=${limit}&offset=${offset}`);
};

export const getAgentById = async (agentId: string): Promise<Agent> => {
    return api.get<Agent>(`/agents/${agentId}`);
};

export const getAgentPlayers = async (agentId: string): Promise<any[]> => {
    return api.get<any[]>(`/agents/${agentId}/players`);
};

export const updateAgentStatus = async (agentId: string, status: string): Promise<void> => {
    return api.patch(`/auth/admin/agent/${agentId}/status`, { status });
};


export const approveAgent = async (agentId: string): Promise<void> => {
    return api.post(`/auth/admin/approve-agent/${agentId}`, {});
};
