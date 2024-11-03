import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
import { cookies } from "next/headers";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        // const decodedUsername = decodeURIComponent(username)  // optional to pass through this function so that the username is in correct format of string 

        const user = await UserModel.findOne({
            username
        })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()

            const token = await jwt.sign({
                data: user
            }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '1h' })

            ;(await cookies()).set({
                name: 'token',
                value: token,
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24,  // 1 day in seconds
                path: '/',
            });
            
            return Response.json(
                {
                    success: true,
                    token:token,
                    message: "Account verified"
                },
                {
                    status: 200
                }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is expired, Please signup again to get a new code"
                },
                {
                    status: 400
                }
            )
        }
        else {

            return Response.json(
                {
                    success: false,
                    message: "Verification code is not correct"
                },
                {
                    status: 500
                }
            )
        }
    } catch (error) {
        console.error("Error verifying username", error)
        return Response.json(
            {
                success: false,
                message: "Error verifying username"
            },
            {
                status: 500
            }
        )
    }
}