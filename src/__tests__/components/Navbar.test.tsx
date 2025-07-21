import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("Navbar", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  function mockFetch(data: any, ok = true) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      } as any)
    );
  }

  it("shows login/signup when user not logged in", async () => {
    mockFetch({}, false); // fetch /api/users/me fails or returns not logged in

    render(<Navbar />);

    // Wait for useEffect to finish
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText(/signup/i)).toBeInTheDocument();
    });
  });

  it("shows username and profile links when logged in", async () => {
    mockFetch({
      data: { username: "testuser" },
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText(/welcome, TESTUSER/i)).toBeInTheDocument();
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });
  });

  it("handles logout success", async () => {
    mockFetch({
      data: { username: "testuser" },
    });

    // First fetch for /api/users/me
    render(<Navbar />);
    await waitFor(() => screen.getByText(/welcome, TESTUSER/i));

    // Mock logout fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as any)
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Logged out");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handles logout failure", async () => {
    mockFetch({
      data: { username: "testuser" },
    });

    render(<Navbar />);
    await waitFor(() => screen.getByText(/welcome, TESTUSER/i));

    // Mock logout failure response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Logout failed" }),
      } as any)
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Logout failed");
    });
  });
});
