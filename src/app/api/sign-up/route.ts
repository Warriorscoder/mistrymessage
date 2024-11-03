import  sendverificationEmail  from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";   
import bcrypt from 'bcrypt' 
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const jwt = require('jsonwebtoken');
export async function POST(request:Request)
{
    let token
    
    console.log("dbconnect called in sign-in")
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        console.log(username, email, password)
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        
        if(existingUserVerifiedByUsername)
            {
                return Response.json({
                    success:false,
                    token:false,
                    message:"Username is already taken"
                },
                {status:400})
            }
            
            const existingUserByemail = await UserModel.findOne({email})
            
            const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()

        if(existingUserByemail)
        {
            if(existingUserByemail.isVerified)
            {
                return Response.json({
                    success:false,
                    token:false,
                    message:"Already a user exists with this email id"
                }, {status:400})
            }
            else
            {
                const hashedpassword = await bcrypt.hash(password,10)

                existingUserByemail.password = hashedpassword;
                existingUserByemail.verifyCode = verifyCode;
                existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByemail.save()
            }
        }
        else
        {
            const hashedPassword = await bcrypt.hash(password,10)

            const expairyDate = new Date()

            expairyDate.setHours(expairyDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expairyDate,
                isVerified: false, 
                isAcceptingMessage: true,
                messages: []
            })

            // console.log(newUser)
            await newUser.save()

            // token = await jwt.sign({
            //     data: newUser
            // }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '1h' })

        }
        // send verification email

        const emailResponse = await sendverificationEmail(
            email, 
            username,
            verifyCode
        )

        if(!emailResponse.success)
        {
            return Response.json({
                success:false,
                message:emailResponse.message,
                token:false,
            }, {status:500})
        }

        return Response.json({
            success:true,
            message:"User registered successfully . Please verify your email",
            token:token
        }, {status:201}) 

    } catch (error) {
        console.error("error registering user", error)

        return Response.json(
            {
                success:false,
                token:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}