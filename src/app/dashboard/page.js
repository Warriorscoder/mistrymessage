'use client'
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import { useAuth } from '@/components/AuthProvider'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
// import { useAuth } from '@/context/AuthProvider'
import { useToast } from '@/hooks/use-toast'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import jwt from "jsonwebtoken"
import Cookies from 'js-cookie';

// interface newUser {
//     data:User
// }

function Dashboard() {

    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    // const [user, setUser] = useState()

    const { toast } = useToast()

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }


    // const {user} = useAuth()
    const token = Cookies.get('token');
    let user
    if (token) {
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET
        // console.log("this is dashboard token ",token," hi")

        user = jwt.verify(token, secret)

        // console.log("this is dashboard newuser ",newuser.data," hi")
        // setUser(newuser.data!)
    }

    // console.log("this is dashboard user ",user," hi")    

    // const user = null

    if (!user) {
        console.warn("Token is missing");
    }

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    })


    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get(`/api/accept-message?userId=${user.data._id}`)

            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error;

            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: 'destructive'
            })
        }
        finally {
            setIsSwitchLoading(false)
        }

    }, [setValue])

    const fetchMessages = useCallback(async (refresh = false) => {

        setIsLoading(true)
        setIsSwitchLoading(false)

        try {
            const response = await axios.get(`/api/get-messages?username=${user.data.username}`)

            setMessages(response.data.messages || [])
            // console.log("messages", messages)
            if (refresh) {
                toast({
                    title: 'showing messages',
                    description: "Showing latest messages",

                })
            }
        } catch (error) {
            const axiosError = error;

            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: 'destructive'
            })
        }
        finally {
            setIsSwitchLoading(false)
            setIsLoading(false)
        }
    }, [setMessages])

    useEffect(() => {

        if (!user) return

        fetchMessages()
        fetchAcceptMessage()
    }, [setValue])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponce>(`/api/accept-message?userId=${user.data._id}`, {
                acceptMessages: !acceptMessages
            })

            setValue('acceptMessages', !acceptMessages)

            toast({
                title: response.data.message,
                variant: 'default'
            })


        } catch (error) {
            const axiosError = error;

            toast({
                title: 'Error',
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: 'destructive'
            })
        }
    }
    let profileUrl
    if(user)
{
    const username = user.data.username

    const baseUrl = `${window.location.protocol}//${window.location.host}`

    profileUrl = `${baseUrl}/u/${username}`
}

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)

        toast({
            title: 'URL copied',
            description: "Profile URL has been copied"
        })
    }

    if (!user)
        return <div>Please Login</div>


    if (status === "authenticated") return (<div>Please Login</div>);

    if (status === 'loading') return <div>Loading...</div>;

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard