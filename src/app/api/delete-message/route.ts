import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET(request: Request) {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    const userId = searchParams.get('userId')

    try {
        
        const user = await UserModel.findOneAndUpdate(
            { '_id': userId },
            { $pull: { messages: { _id: messageId } } },
            { new: true }
        );
    
        if (!user) {
            return Response.json({
                success:false,
                message:"message not found"
            },{status:404})
        }
    
        return Response.json({
            success:true,
            message:"message deleted successfully"
        },{status:200})
    } catch (error) {
        console.log("internal server error",error)
        return Response.json({
            success:false,
            message:"internal server error"
        },{status:500})
    }
}