import dbConnect from "@/lib/dbConnect";   
import UserModel from "@/model/User";

export async function GET(request:Request)
{
    // Not needed in latest version of Nextjs
    
    // if(request.method !== 'GET')
    // {
    //     return Response.json({
    //         success:false,
    //         message:'accepting GET request only ',
    //     },{
    //         status:405
    //     })
    // }
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const email = searchParams.get('email')


        const existingVerifiedEmail = await UserModel.findOne({
            email,
            isVerified:true
        })

        if(existingVerifiedEmail)
        {
            return Response.json({
                success:false,
                message:'Email is already taken',
            },{
                status:400
            })
        }


        return Response.json({
            success:true,
            message:'Email is unique',
        },{
            status:201 
        })

    } catch (error) {
        console.error("Error checking Email", error)
        return Response.json(
            {
                success:false,
                message:"Error checking Email"
            },
            {
                status:500
            }
        )
    }
}