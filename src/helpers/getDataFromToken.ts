import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string => {
    try {
        const token = request.cookies.get("token")?.value || '';
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as string | JwtPayload;

        if(typeof decodedToken === 'string'){
            throw new Error('Invalid token payload: expected object but got string')
        }

        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}