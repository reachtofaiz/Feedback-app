"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user || {};

    return (
        <nav className="p-4 md:p-4 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a className="text-xl font-bold mb-4 md:mb-0" href="#">
                    Feedback App
                </a>
                {session ? (
                    <div className="flex items-center space-x-4">
                        <span>Welcome {user.username || user.email}</span>
                        <Button className="w-full md:w-auto" onClick={() => signOut()}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href={"/sign-in"}>
                        <Button className="w-full md:w-auto">Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
