// import { useAuth } from "@/components/AuthProvider";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request:Request)
{
    await dbConnect()
        const {searchParams} = new URL(request.url)
        const username = searchParams.get('username')
        
        // console.log("get message userId ",username)
        try {
            
            const user = await UserModel.findOne({username: username})
            
            // console.log("get message user  ",user)
        if(!user)
            {
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:400
            })
        }
        
        return Response.json({
            success:true,
            messages:user.messages
        },{
            status:200
        })
    } catch (error) {
        
        console.log("Error in fetching messages",error)
        return Response.json({
            success:false,
            message:"Error in fetching messages"
        },{
            status:500
        })
    }
    
}