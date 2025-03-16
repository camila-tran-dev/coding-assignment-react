import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Tickets from "./tickets";
import { ticketsAPI, usersAPI } from "client/src/apis";

jest.mock("client/src/apis", () => ({
  ticketsAPI: {
    getTickets: jest.fn(),
  },
  usersAPI: {
    getUsers: jest.fn(),
  },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("Tickets Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    jest.clearAllMocks();
  });

  test("renders error message when API fails", async () => {
    (ticketsAPI.getTickets as jest.Mock).mockRejectedValue(new Error("API error"));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Tickets />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Error loading tickets.")).toBeInTheDocument();
    });
  });

  test("renders list of tickets", async () => {
    (ticketsAPI.getTickets as jest.Mock).mockResolvedValueOnce([
      { id: 1, description: "Test Ticket 1", completed: false, assigneeId: null },
      { id: 2, description: "Test Ticket 2", completed: true, assigneeId: null },
    ]);

    (usersAPI.getUsers as jest.Mock).mockResolvedValueOnce([]);

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Tickets />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("[ID: #1] - Test Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("[ID: #2] - Test Ticket 2")).toBeInTheDocument();
    });

    expect(screen.queryByText("Error loading tickets.")).not.toBeInTheDocument();
  });
});
