import { GET } from '@/app/api/users/logout/route';
import { NextRequest } from 'next/server';

describe('GET /api/users/logout', () => {
  it('should return a successful logout response and clear the token cookie', async () => {
    const req = new NextRequest('http://localhost/api/users/logout');
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      message: "Logout Successful",
      success: true,
    });

    const setCookies = response.cookies.getAll();
    const tokenCookie = setCookies.find(cookie => cookie.name === 'token');

    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.value).toBe('');
    expect(new Date(tokenCookie?.expires || '').getTime()).toBe(0);
  });
});
