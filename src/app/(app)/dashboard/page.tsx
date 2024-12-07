'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/user"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/type/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { Session, User } from "next-auth"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"



const page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    //optimistic UI --> gather information about this

    const { data: session , status } = useSession()
    


    if(status == "unauthenticated"){
        // router.replace('/sign-in')
        redirect('/sign-in')
    }

    console.log(session);
    
    const { username } = session?.user as User

    
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }


    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessage)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message setting",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-message')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "Refreshed messages",
                    description: "Showing latest messages",
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message setting",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    //handle switch change 

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message setting",
                variant: "destructive"
            })
        }
    }

    

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URl copied",
            description: "Profile URL is been copied to clipboard"
        })
    }

    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    return (
        <div>
            <h1>User Dashboard</h1>
            <div>
                <h2>Copy your unique link</h2>{``}
                <div>
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div>
                <Switch
                    {...register('acceptMessage')}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span>
                    Accept message: {acceptMessages ? 'On' : 'Of'}
                </span>
            </div>
            <Separator />

            <Button
                className=""
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 />
                ) : (
                    <RefreshCcw />
                )}
            </Button>
            <div>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                        key = {message._id}
                        message = {message}
                        onMessageDelete = {handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No message to display</p>
                )}
            </div>


        </div>
    )
}



export default page