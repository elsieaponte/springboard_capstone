import { POST } from "@/app/api/users/visited/route";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest } from "next/server";

jest.mock("@/models/User");
jest.mock("@/helpers/getDataFromToken");

describe("POST /api/users/visited", () => {
  const mockRequest = (body: any): NextRequest =>
    ({
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest);

  afterEach(() => jest.clearAllMocks());

  it("returns 404 if user not found", async () => {
    (getDataFromToken as jest.Mock).mockResolvedValue("userid123");
    (User.findById as jest.Mock).mockResolvedValue(null);

    const request = mockRequest({ parkId: "abc", parkName: "Test Park", imageUrl: "url" });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("User not found");
  });

  it("returns message if park already visited", async () => {
    (getDataFromToken as jest.Mock).mockResolvedValue("userid123");

    (User.findById as jest.Mock).mockResolvedValue({
      visitedParks: [{ parkId: "abc" }],
      save: jest.fn(),
    });

    const request = mockRequest({ parkId: "abc", parkName: "Test Park", imageUrl: "url" });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Already marked as visited");
  });

  it("adds park to visited list", async () => {
    (getDataFromToken as jest.Mock).mockResolvedValue("userid123");

    const saveMock = jest.fn();
    const mockUser = {
      visitedParks: [],
      save: saveMock,
    };

    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const request = mockRequest({ parkId: "new", parkName: "New Park", imageUrl: "image" });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Marked as visited");
    expect(body.success).toBe(true);
    expect(saveMock).toHaveBeenCalled();
    expect(mockUser.visitedParks).toHaveLength(1);
  });
});
