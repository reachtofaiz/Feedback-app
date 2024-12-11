import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export  async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        console.log(user);
        

        if (user && user.length >= 1) {
            return Response.json({
                success: true,
                messages: user[0].messages
            }, { status: 200 })
        } else{
            return Response.json({
                success: false,
                messages: "No user found"
            }, {status: 404})
        }
    } catch (error) {

        console.log("An unexpected error occured: ", error);

        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 500 })
    }
}
