import { GET } from '@/app/api/users/me/route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

jest.mock('@/models/User');
jest.mock('jsonwebtoken');

describe('GET /api/users/me', () => {
    it('returns user data when valid token is present', async () => {
        const fakeUser = {
            _id: '123',
            username: 'test',
            email: 'test@example.com',
            toObject: () => ({
                _id: '123',
                username: 'test',
                email: 'test@example.com',
            }),
        };

        (jwt.verify as jest.Mock).mockReturnValue({ id: '123' });
        (User.findOne as jest.Mock).mockResolvedValue(fakeUser);

        const req = new Request('http://localhost/api/users/me', {
            headers: {
                cookie: 'token=valid.jwt.token',
            },
        });

        const res = await GET(req as unknown as NextRequest);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.email).toBe('test@example.com');
    });
});
