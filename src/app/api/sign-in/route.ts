import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
// import { NextApiResponse } from "next";
// import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export async function POST(request: Request) {
    await dbConnect()

    const data = await request.json()

    const email = data.identifier
    const password = data.password
    // console.log(data)
    try {
        const result = await UserModel.findOne({
            email: email
        })
        console.log(result)
        if (!result) {
            return Response.json({
                success: false,
                token: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        const oripassword = bcrypt.compare(password, result.password!)

        if (!oripassword) {
            return Response.json({
                success: false,
                token: false,
                message: "Password is incorrect"
            }, {
                status: 401
            })
        }

        const token = await jwt.sign({
            data: result
        }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '1h' })

        ;(await cookies()).set({
            name: 'token',
            value: token,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,  // 1 day in seconds
            path: '/',
        });

        return Response.json({
            success: true,
            token: token,
            user: result,
            message: "User found"
        })
    } catch (error) {
        console.log("internal server error", error)
        return Response.json({
            success: false,
            token: false,
            message: "internal server error"
        }, {
            status: 500
        })
    }
}