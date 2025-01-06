import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessage } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptMessage: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: ""
            })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.log("Failed to update user status to accept message", error);
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        }, { status: 500 })
    }


}


export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "User founded",
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (error) {
        console.log("Failed to update user status to accept message",error);
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }

}