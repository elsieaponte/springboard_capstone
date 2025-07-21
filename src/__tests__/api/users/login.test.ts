import { POST } from '@/app/api/users/login/route';
import { NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

jest.mock('@/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('POST /api/users/login', () => {
  const mockUser = {
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  it('returns 400 if user does not exist', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'pass' }),
    } as unknown as NextRequest;

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('User does not exist');
  });

  it('returns 400 if password invalid', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(false);

    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'wrongpass' }),
    } as unknown as NextRequest;

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid password');
  });

  it('returns token and success on valid login', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValue('faketoken');

    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'pass' }),
    } as unknown as NextRequest;

    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.message).toBe('Login Successful');
    // Optionally test cookie set - depends on your testing environment
  });
});
