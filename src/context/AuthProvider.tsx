"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

// Define the shape of the user object in the context
interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    verifyCode?: number;
    verifyCodeExpiry?: Date;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    messages?: Array<string>;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    // token:string;
    // setToken: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Create a provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    // const [token, setToken] = useState('')
    useEffect( () => {
        const newtoken =  localStorage.getItem('token');
        // console.log("authprovider token ", newtoken)
        if (newtoken != null) {
            try {
                
                const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
                // console.log("authprovider jwtsecret ", jwtSecret)
                const decodedUser = jwt.verify(newtoken, jwtSecret) ;

                // console.log("authprovider decoded user ", decodedUser)
                setUser(decodedUser.data); // Set the decoded user information

            } catch (error) {
                console.error("Failed to verify token:", error);
                setUser(null); // Clear user if token verification fails
            }
        }
    }, []);
    // console.log("authprovider user ", user)

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
