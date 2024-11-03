'use client'

import React from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthProvider';

function Navbar() {
    const { user, setUser } = useAuth();

    const {toast} = useToast()

    const signOut = () => {

        setUser("")
        localStorage.removeItem('token');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        toast({
            title: "Logged out",
            message: "You have logged out successfully",
        });

        // console.log("env variable ",process.env.NEXT_PUBLIC_HOST);
        window.location.href = process.env.NEXT_PUBLIC_HOST;
    };

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0' href="#">Mystry Message</a>
                {user ? (
                    <>
                        <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                        <button className='w-full md:w-auto' onClick={signOut}>Logout</button>
                    </>
                ) : (
                    <Link href={'/sign-in'}>
                        <button className='w-full md:w-auto'>Login</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
