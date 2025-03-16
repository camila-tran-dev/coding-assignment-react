import { Ticket } from "@acme/shared-models";

const API_URL = "api/tickets";

const ticketsAPI = {
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await fetch(API_URL);
      return response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getTicketDetail: async (ticketId: number): Promise<Ticket> => {
    if (!ticketId) throw new Error("Ticket is invalid");
    const response = await fetch(`${API_URL}/${ticketId}`);
    return response.json();
  },

  createTicket: async (description: string): Promise<Ticket> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });
    return response.json();
  },

  assignTicket: async (ticketId: number, userId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${ticketId}/assign/${userId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to unassign ticket");
    }
  },

  unassignTicket: async (ticketId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${ticketId}/unassign`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to unassign ticket");
    }
  },

  markComplete: async (ticketId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${ticketId}/complete`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark complete ticket");
    }
  },

  markIncomplete: async (ticketId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${ticketId}/complete`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to mark incomplete ticket");
    }
  },
};

export { ticketsAPI };
