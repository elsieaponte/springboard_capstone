import { POST } from "@/app/api/users/signup/route";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextRequest } from "next/server";

jest.mock("@/models/User");
jest.mock("bcryptjs");

describe("POST /api/users/signup", () => {
  const mockJson = jest.fn();
  const mockRequest = (body: any): NextRequest =>
    ({
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest);

  afterEach(() => jest.clearAllMocks());

  it("returns error if user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: "elsie@email.com" });

    const request = mockRequest({
      username: "elsie",
      email: "elsie@email.com",
      password: "password",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("User already exists");
  });

  it("creates a new user and returns success", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcryptjs.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcryptjs.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const saveMock = jest.fn().mockResolvedValue({
      username: "test",
      email: "test@example.com",
      password: "hashedPassword",
    });

    (User as any).mockImplementation(() => ({
      save: saveMock,
    }));

    const request = mockRequest({
      username: "test ts",
      email: "testts@email.com",
      password: "password",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("User created successfully.");
    expect(body.success).toBe(true);
    expect(saveMock).toHaveBeenCalled();
  });
});
