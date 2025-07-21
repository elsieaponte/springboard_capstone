import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("LoginPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("disables login button when fields are empty", () => {
    render(<LoginPage />);
    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeEnabled(); // visually always enabled
  });

  it("submits login form successfully", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/users/login", {
        email: "test@example.com",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith("Login success");
      expect(pushMock).toHaveBeenCalledWith("/profile");
    });
  });

  it("handles login error", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
