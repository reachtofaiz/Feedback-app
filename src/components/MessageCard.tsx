"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/user"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/type/ApiResponse"
import dayjs from "dayjs"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const page = ({ message, onMessageDelete }: MessageCardProps) => {

    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: response.data.message
            })
            onMessageDelete(message._id)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive'
            })
        }
    }

    return (

        <Card>
            <CardHeader>
                {/* <CardTitle>{ message.content }</CardTitle> */}
                <AlertDialog>
                    <AlertDialogTrigger asChild className="w-7 p-5 relative left-[95%] top-0">
                        <Button variant="destructive"><X className="w-5 h-5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteConfirm}>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription className="font-bold text-2xl text-black">{ message.content }</CardDescription>
            </CardHeader>
            <CardContent>
                {/* <p>Card Content</p> */}
            </CardContent>
            <CardFooter>
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </CardFooter>
        </Card>

    )
}
// width: 30px;
// padding: 18px;
// position: relative;
// left: 94 %;
// top: -25px;

export default page