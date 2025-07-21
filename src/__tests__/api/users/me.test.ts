import { GET } from '@/app/api/users/me/route';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Types } from 'mongoose';

jest.mock('@/models/User');
jest.mock('@/helpers/getDataFromToken', () => ({
    getDataFromToken: jest.fn(),
}));

const objectId = new Types.ObjectId();

describe('GET /api/users/me', () => {
    it('returns user data when valid token is present', async () => {

        (getDataFromToken as jest.Mock).mockResolvedValue(objectId);
        (User.findOne as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue({
                _id: objectId,
                username: 'elsie',
                email: 'elsie@email.com',
                toObject: () => ({
                    _id: objectId,
                    username: 'elsie',
                    email: 'elsie@email.com',
                }),
            }),
        });

        const req = new Request('http://localhost/api/users/me', {
            headers: {
                cookie: 'token=valid.jwt.token',
            },
        });

        const res = await GET(req as unknown as NextRequest);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body.data.email).toBe('elsie@email.com');
    });
});
