import { resend } from "@/lib/resend"
import verificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/type/ApiResponse"
import { error } from "console";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'reachtoali06@gmail.com',
            to: email,
            subject: "Message App Verification code ",
            react: verificationEmail({username, otp: verifyCode}),
        });


        return { success: true, message: "Successfully send verification code" }
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification code" }
    }
}