import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import fetchMock from 'jest-fetch-mock';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: null }));
    render(<ProfilePage />);
    expect(await screen.findByText("...Loading User Information")).toBeInTheDocument();
  });

  it("renders user data and visited parks", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      visitedParks: [
        { parkName: "Yellowstone", imageUrl: "https://example.com/img.jpg" },
        { parkName: "Yosemite", imageUrl: null },
      ]
    };

    fetchMock.mockResponseOnce(JSON.stringify({ data: mockUser }));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Username: testuser")).toBeInTheDocument();
      expect(screen.getByText("Email: test@example.com")).toBeInTheDocument();
      expect(screen.getByText("Yellowstone")).toBeInTheDocument();
      expect(screen.getByText("Yosemite")).toBeInTheDocument();
      expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", "https://example.com/img.jpg");
    });
  });

  it("renders message when no visited parks", async () => {
    const mockUser = {
      username: "testuser",
      email: "test@example.com",
      visitedParks: []
    };

    fetchMock.mockResponseOnce(JSON.stringify({ data: mockUser }));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("No parks visited yet.")).toBeInTheDocument();
    });
  });

  it("calls toast.error on fetch failure", async () => {
    fetchMock.mockRejectOnce(new Error("Unauthorized"));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid or expired token");
    });
  });
});
