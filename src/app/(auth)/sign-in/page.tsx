'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/type/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";


const page = () => {

    const { toast } = useToast()
    const router = useRouter()

    // from here the implementation of zod start

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            if (result.error == 'CredendialsSignin') {
                toast({
                    title: "Login failed",
                    description: "Incorrect username or password",
                    variant: "destructive" 
                })
            }else{
                toast({
                    title: "error",
                    description: result.error,
                    variant: "destructive" 
                })
            }
        }

        if(result?.error){
            toast({
                title: "Login failed",
                description: "Incorrect username or password",
                variant: "destructive" 
            })
        }

        if (result?.url) {
            router.replace('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Feedback App
                    </h1>
                    <p className="mb-4">Sign-in to start your anonymous adventure</p>
                </div>
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 flex flex-col justify-center items-center">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email/Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email/username"
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

                        <Button type="submit"className="w-fit items-center">
                            Sign in
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