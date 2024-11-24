import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";


export async function POST(request: Request) {
    await dbConnect()

    try {

        const {username, code} = await request.json()

        const decodedUsername  = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username : decodedUsername
        })

        if(!user){

            return Response.json({
                success: false,
                message: "User not found"
            },{status : 500})
        }

        const isCodeValid = user.verifyCode === code
        const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid  && iscodeNotExpired){
            user.isVerfied = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            },{status: 200})
        }

        // if code is expired
        else if(!iscodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code is expired"
            },{status : 400})
        }

        // if code is incorrct
        else{
            return Response.json({
                success: false,
                message: "Code is incorrect"
            },{status: 500})
        }


    } catch (error) {
        console.error("Error in veryfying code",error)

        return Response.json({
            success: false,
            message: "Error in veryfying code"
        },{status : 500})
    }

}