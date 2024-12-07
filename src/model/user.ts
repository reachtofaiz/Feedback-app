import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date
}

const MesssgeSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerfied: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please entre valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: false,
    },
    messages: [MesssgeSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;