/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
// import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { messageSchema } from '@/schemas/messageSchema';
// import { useParams } from 'next/navigation';
import {
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { useToast } from '@/hooks/use-toast';

function Page() {

  const {toast} = useToast()
  const [pathname, setPathname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only sets pathname when window is available in client-side rendering
    setPathname(window.location.pathname);
  }, []);

  const username = pathname ? pathname.split("/")[2] : '';

  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const tempmessage = ["What's your favorite movie?", "Do you have any pets?", "What's your dream job?"]
  const [arraymessage, setArraymessage] = useState<string[]>(tempmessage)

  const specialChar = '||';



  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const messageContent = form.watch('content')


  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)

    try {

      const message = data.content
      if (message.length <= 2) {

        toast({
          title: 'Error',
          description: "Message should be more than 2 characters",
          variant: 'destructive'

        })


        return
      }
      const response = await axios.post('/api/send-message', {
        ...data,
        username
      })

      if (response.data.success) {
        toast({
          title: 'Success',
          description: "Messages sent successfully",
        })

      }

      else {
        toast({
          title: 'Error',
          description: response.data.message,
          variant: 'destructive'

        })

      }

    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: "Internal server error",
        variant: 'destructive'

      })

    }
    finally {
      setIsLoading(false)
    }
  }

  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
  };

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const fetchSuggestedMessages = async () => {

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey!);
    // console.log(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    async function run() {
      const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
      });
      setIsSuggestLoading(true)

      try {
        const result = await chatSession.sendMessage("Create a list of three open-ended and engaging questions formatted as a single string . Each question should be separated by '||'.These questions are for an anonymius social messaging platform , like Qooh.me,and should be suitable for a diverse audience. Avoid personal or sensitive topics, fousing instead on universal themes that encourage friendly interaction . For eg., your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical fugure, who would it be?||what's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming converstional environment.");
        // console.log(result.response.text());

        const arraymess = parseStringMessages(result.response.text())

        setArraymessage(arraymess)

      } catch (error) {
        console.log("an error occured", error)
      }
      finally {
        setIsSuggestLoading(false)
      }
    }

    run();
  };


  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-8">
          <div className="space-y-2">
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4"
              disabled={isSuggestLoading}
            >
              Suggest Messages
            </Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">

              {arraymessage.map((item) => <Button
                key={item}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(item)}
              >
                {item}
              </Button>)}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Page