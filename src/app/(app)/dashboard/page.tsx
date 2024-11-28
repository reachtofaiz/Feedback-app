'use client'

import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/user"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/type/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"


const page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    //optimistic UI --> gather information about this

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: Session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async() => {
    setIsSwitchLoading(true)
    try {
        await axios.get<ApiResponse>('/api/accept-messages')
        setValue('acceptMessages', Response.data.isAcceptingMessage)
        
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
            title: "Error",
            description: axiosError.response?.data.message || "Failed to fetch message setting",
            variant: "destructive"
        })
    } finally{
        setIsSwitchLoading(false)
    }
},[setValue])


return (
    <div>Dashboard</div>
)
}



export default page