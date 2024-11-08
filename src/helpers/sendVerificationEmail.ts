// import { Resend } from 'resend';
// import VerificationEmail from '../../emails/VerificationEmail'


// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendverificationEmail(
//     email:string,
//     username: string,
//     verifyCode: string
// ){
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'Mystery message | Verification code',
//             react: VerificationEmail({username, otp:verifyCode}),
//         })
//         return {success:true, message:'email sent successfully'}
//     } catch (emailError) {
//         console.log("Error in sending the verification email", emailError)
//         return {success:false, message:'Failed to send verificaion email'}
//     }
// }

// import type { NextApiRequest, NextApiResponse } from 'next';
import VerificationEmail from '../../emails/VerificationEmail'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendverificationEmail
    (   
        email: string,
        username: string,
        verifyCode: string) {

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: "Message send successfully"
        };
    } catch (error) {

        return {
            success: false,
            message: "Fail to send email"
        };

    }

};
