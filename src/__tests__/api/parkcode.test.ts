import { GET } from '@/app/api/parkcode/route';
import { NextRequest } from 'next/server';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/parkcode', () => {
  it('returns park data with valid parkCode', async () => {
    const mockData = { data: { fullName: 'Test Park' } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const req = new Request('http://localhost/api/parkcode?parkCode=abc');
    const res = await GET(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual(mockData);
  });

  it('returns 400 if parkCode is missing', async () => {
    const req = new Request('http://localhost/api/parkcode');
    const res = await GET(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Missing required query param: parkCode');
  });
});


