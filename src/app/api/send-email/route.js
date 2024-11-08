// import { Resend } from 'resend';
// import VerificationEmail from '../../../../emails/VerificationEmail';
// import { render } from '@react-email/components';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function POST(request) {

//     const {email,username,verifyCode} = await request.json()
//     console.log(email, username, verifyCode)
//     try {
//         await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: [email],
//             subject: 'Mystery message | Verification code',
//             html: render( VerificationEmail({ username, otp: verifyCode })),
//         });

//         return response.json({
//             success: true,
//             message: "Message send successfully"
//         });
//     } catch (error) {

//         return response.json({
//             success: false,
//             message: "Fail to send email"
//         });

//     }

// };

import { Resend } from 'resend';
import VerificationEmail from '../../../../emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    const { username, verifyCode } = await request.json();
    // console.log(email, username, verifyCode);

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: "codeaniket123@gmail.com",
            subject: 'Mystery message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message sent successfully"
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to send email"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
