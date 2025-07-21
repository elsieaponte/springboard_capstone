import {GET} from "@/app/api/parks/route";
import { NextRequest } from 'next/server';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/parks', () => {
  const baseUrl = 'https://mocked-nps.gov/api/parks';
  const mockApiKey = 'fake-api-key';

  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env.PARKS_URI = baseUrl;
    process.env.PARKS_API_AUTH = mockApiKey;
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = { ...envBackup };
  });

  it('aggregates paginated park data and returns it', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          total: '80',
          data: Array(50).fill({ id: '1', name: 'Park A' }),
        },
      })
      .mockResolvedValueOnce({
        data: {
          total: '80',
          data: Array(30).fill({ id: '2', name: 'Park B' }),
        },
      });

    const req = {} as NextRequest; // Not using request data

    const res = await GET(req);
    const json = await res.json();

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(json.data).toHaveLength(80);
    expect(res.status).toBe(200);
  });

  it('returns 500 if axios throws error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API failed'));

    const req = {} as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('API failed');
  });
});
