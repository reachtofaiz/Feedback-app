import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import z from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";



const usernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {

    await dbConnect()
    try {


        // here it gives the username from the url 

        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = usernameQuerySchema.safeParse(queryParam)

        // just to check
        console.log(result);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameter',
            }, { status: 400 })
        }

        const { username } = result.data

        const existingVerifiedUsername = await UserModel.findOne({ username, isVerfied: true })

        if (existingVerifiedUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: 'Username is unique'
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking", error)
        return Response.json(
            {
                success: false,
                message: "Error checking in username"
            },
            { status: 400 }
        )
    }
}