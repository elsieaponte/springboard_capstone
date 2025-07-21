import { render, screen, waitFor } from '@testing-library/react';
import ParkPage from '@/app/park/[code]/page';
import fetchMock from 'jest-fetch-mock';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

jest.mock('@/app/components/ImageCarousel', () => ({
  __esModule: true,
  default: ({ images }: { images: any[] }) => <div data-testid="carousel">{images.length} images</div>
}));

describe('ParkPage', () => {
  const mockParams = Promise.resolve({ code: 'abcd' });

  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { total: "1", data: [{}] } })
    );
    render(<ParkPage params={mockParams} />);
    expect(await screen.findByText("...Loading Park Information")).toBeInTheDocument();
  });

  it('displays park data if found', async () => {
    const mockPark = {
      fullName: "Yosemite National Park",
      images: [{ url: "img1" }],
      activities: [{ name: "Hiking" }],
      operatingHours: [
        {
          name: "Operating Hours",
          description: "Open daily",
          standardHours: { monday: "9-5", tuesday: "9-5" }
        }
      ],
      entranceFees: [
        { title: "General", cost: "30", description: "Per vehicle" }
      ],
      weatherInfo: "Sunny",
      addresses: [
        {
          type: "Mailing",
          line1: "123 Park Lane",
          line2: "",
          city: "Yosemite",
          stateCode: "CA",
          postalCode: "95389"
        }
      ],
      directionsInfo: "Take Route 140."
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { total: "1", data: [mockPark] } })
    );

    render(<ParkPage params={mockParams} />);
    expect(await screen.findByText(mockPark.fullName)).toBeInTheDocument();
    expect(screen.getByText("Hiking")).toBeInTheDocument();
    expect(screen.getByText("Operating Hours:")).toBeInTheDocument();
    expect(screen.getByText("Park Address:")).toBeInTheDocument();
  });

  it('shows toast if park not found', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { total: "0", data: [] } })
    );
    render(<ParkPage params={mockParams} />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Park not found.");
    });
  });

  it('shows error toast if fetch fails', async () => {
    fetchMock.mockRejectOnce(() => Promise.reject("API down"));
    render(<ParkPage params={mockParams} />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load park data.");
    });
  });
});
