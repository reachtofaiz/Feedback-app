'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/type/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const page = () => {

    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)


    const { toast } = useToast()
    const router = useRouter()

    // from here the implementation of zod start

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false)

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get<ApiResponse>(`/api/unique-username?username=${username}`);
                    let message = response.data.message
                    // console.log(message);
                    setUsernameMessage(message);
                    setIsUsernameValid(true)
                } catch (error) {
                    const AxiosError = error as AxiosError<ApiResponse>;
                    setIsUsernameValid(false)
                    setUsernameMessage(
                        AxiosError.response?.data.message ?? "Error in checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()  //run every time to check username
        console.log(usernameMessage === 'username is unique' ? 'text-green-600' : 'text-red-600');
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.log("Error in sign-up of user", error);
            const AxiosError = error as AxiosError<ApiResponse>;
            let errorMessage = AxiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })

            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Feedback App
                    </h1>
                    <p className="mb-4">Sign-up to start your anonymous adventure</p>
                </div>
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 flex flex-col justify-center items-center">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        {
                                            isCheckingUsername && <Loader2 className="animate-spin" />
                                        }

                                        <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-600' : 'text-red-600'}`}>
                                            {username} {usernameMessage}
                                        </p>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="password" type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-fit items-center">
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-center">Please wait</Loader2>
                                    </>
                                ) : ('Sign-up')
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    <p className="text-center">
                        Already a member ? {' '}
                        <Link href="/sign-up" className="text-blue-500 hover:text-blue-700">
                            Sign-up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}


export default page