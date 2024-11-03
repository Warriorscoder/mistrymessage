import { Message } from "@/model/User";

export interface ApiResponce {
    success:boolean;
    token:string;
    message:string;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>,
}