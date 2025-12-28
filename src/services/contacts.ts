import { api } from "./api";

export interface Contact {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    region?: string;
    message: string;
    createdAt: string;
}

export const getContacts = async (): Promise<Contact[]> => {
    const response = await api.get<{ success: boolean; data: Contact[] }>("/contact/list");
    return response.data;
};

export const deleteContact = async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
};

export const deleteAllContacts = async (): Promise<void> => {
    await api.delete("/contact/all");
};
