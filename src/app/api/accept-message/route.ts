// import { useAuth } from "@/components/AuthProvider";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const jwt = require('jsonwebtoken');
export async function POST(request: Request) {
    await dbConnect();

    // const {user} = useAuth()
    // console.log(user)
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId')

    // if (!user) {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Not authenticated",
    //         },
    //         {
    //             status: 401,
    //         }
    //     );
    // }

    // const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "fail to update user status to accept messages",
                },
                {
                    status: 401,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "message acceptance status updated successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("fail to update user status to accept messages");

        return Response.json(
            {
                success: false,
                message: "fail to update user status to accept messages",
            },
            {
                status: 500,
            }
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    await dbConnect();

    const {searchParams} = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log("accept message get message ",userId)
    // if (!token || !user) {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Not authenticated",
    //         },
    //         {
    //             status: 401,
    //         }
    //     );
    // }
    // const userId = user._id;

    try {
        const founduser = await UserModel.findById(userId);

        if (!founduser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                isScceptingMessages: founduser.isAcceptingMessage,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("error in finding user", error);
        return Response.json(
            {
                success: false,
                message: "error in finding user",
            },
            {
                status: 500,
            }
        );
    }
}
