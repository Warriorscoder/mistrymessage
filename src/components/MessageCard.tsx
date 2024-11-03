'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    // CardTitle,
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
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponce } from "@/types/ApiResponce"
import { useAuth } from "@/context/AuthProvider"

type MessageCardProp = {
    message:Message;
    onMessageDelete: (messageId: string)=>void
}



function MessageCard({message, onMessageDelete} :MessageCardProp) {
    
    const {toast} = useToast()
    const {user} = useAuth()
    const handleDeleteComfirm = async ()=>{
        const response = await axios.get<ApiResponce>(`/api/delete-message?messageId=${message._id}&userId=${user?._id}`)
        toast({
            title:response.data.message
        })

        onMessageDelete(message._id)
    }

    return (
        <Card>
            <CardHeader>
                {/* <CardTitle>{message.content}</CardTitle> */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className=" w-1/4 h-5" /></Button>
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
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteComfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>{message.content}</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>

            </CardFooter>
        </Card>

    )
}

export default MessageCard