import { GET } from '@/app/api/parkcode/route';
import { NextRequest } from 'next/server';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/parkcode', () => {
  it('returns 400 if parkCode is missing', async () => {
    const url = 'http://localhost/api/parkcode'; // no parkCode param
    const req = new NextRequest(url);
    
    const res = await GET(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Missing required query param: parkCode');
  });

  it('returns park data if parkCode is provided', async () => {
    const url = 'http://localhost/api/parkcode?parkCode=abcd';
    const req = new NextRequest(url);

    const fakeData = { fullName: 'Fake Park' };
    mockedAxios.get.mockResolvedValueOnce({ data: fakeData });

    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual(fakeData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('parkCode=abcd'),
      expect.any(Object)
    );
  });

  it('returns 500 on axios error', async () => {
    const url = 'http://localhost/api/parkcode?parkCode=abcd';
    const req = new NextRequest(url);

    mockedAxios.get.mockRejectedValueOnce(new Error('Axios failed'));

    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Axios failed');
  });
});
