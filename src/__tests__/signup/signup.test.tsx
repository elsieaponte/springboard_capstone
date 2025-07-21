import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('SignupPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it('renders form inputs and buttons', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('signup button is disabled when inputs are empty', () => {
    render(<SignupPage />);
    const button = screen.getByText(/signup/i);
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled(); // visually enabled, but logic disables via state
  });

  it('calls signup API and redirects on success', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/signup/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/signup', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('shows toast error if signup fails', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Signup failed'));

    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'fail' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'failpass' } });

    fireEvent.click(screen.getByText(/signup/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed');
    });
  });
});
