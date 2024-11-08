/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import *as z from "zod"
import Link from "next/link"
// import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import axios from "axios"
import { useAuth } from "@/context/AuthProvider"
// import { useAuth } from "@/components/AuthProvider"


function page() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const {setUser, user} = useAuth()
  const { toast } = useToast()
  const router = useRouter()


  // zod implementation
  // z.infer<typeof signUpSchema is optional, we are using typed script so added the type of the form

  useEffect(() => {
    if (user && !user.isVerified) {
      toast({
        title: "Verify",
        description: "Please verify your account. Check your email for the code.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {

    const result = await axios.post('/api/sign-in',data)

    if (!result?.data.success) {
      toast({
        title: 'Login Failed',
        description: "Incorrect username or password",
        variant: "destructive"
      })
    }

    if (result?.data.success) {
      localStorage.setItem('token', result.data.token)
      // setToken(result.data.token)
      setUser(result.data.user)
      router.replace('/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Join Mystery Message
          </h1>

          <p className="mb-4">Sign in to start your anonymous adventure
          </p>

        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} >
              Sign in
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p>
            Do not have an account ?{' '}
            <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
        { user && !user?.isVerified && <div className="text-center">
          <p>
            Want to verify your account ?{' '}
            <Link href={`/verify/${user?.username}`} className="text-blue-600 hover:text-blue-800">
              Verify account
            </Link>
          </p>
        </div>}
      </div>
    </div>
  )
}
export default page