/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import *as z  from "zod"
import Link from "next/link"
import {  useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponce } from "@/types/ApiResponce"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


function page() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const debounced2 = useDebounceCallback(setEmail, 300)
    const { toast } = useToast()
    const router = useRouter()
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
    // zod implementation
    // z.infer<typeof signUpSchema is optional, we are using typed script so added the type of the form

    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
    })
    
    useEffect(()=>{
      const checkUsernameUnique = async ()=>{
        if(username)
        {
          setIsCheckingUsername(true)
          setUsernameMessage('')

          try {
            const response = await axios.get(`/api/check-username-unique?username=${username}`)
            
            // eslint-disable-next-line prefer-const
            let message = response.data.message
            setUsernameMessage(message)

          } catch (error) {
            const axiosError = error as AxiosError<ApiResponce>

            setUsernameMessage(
              axiosError.response?.data.message ?? 'Error in checking username'
            )
          }
          finally{
            setIsCheckingUsername(false)
          }
        }
      }

      checkUsernameUnique()
    },[username])

    useEffect(()=>{
      const checkEmailUnique = async ()=>{
        if(email)
        {
          setIsCheckingEmail(true)
          setEmailMessage('')

          try {
            const response = await axios.get(`/api/check-email-unique?email=${email}`)
            
            // eslint-disable-next-line prefer-const
            let message = response.data.message
            setEmailMessage(message)

          } catch (error) {
            const axiosError = error as AxiosError<ApiResponce>

            setEmailMessage(
              axiosError.response?.data.message ?? 'Error in checking email'
            )
          }
          finally{
            setIsCheckingEmail(false)
          }
        }
      }

      checkEmailUnique()
    },[email])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (data:z.infer<typeof signUpSchema>)=>{
      setIsSubmitting(true)

      try {
        const response = await axios.post<ApiResponce>('/api/sign-up',data)

        toast({
          title:'success',
          description:response.data.message
        })
        

        // email request
        const data2 = {email,username,verifyCode}
        // console.log(email, username, verifyCode)
        const emailResponse = await axios.post('/api/send-email',data2)

        if(!emailResponse.data.success)
        {
            toast({
              title:"fail",
              description:"error in sending email",
              variant:"destructive"
            })
        }
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)

      } catch (error) {
          console.log("error in signing-up user", error)
          
          const axiosError = error as AxiosError<ApiResponce>
          
          const errorMessage = axiosError.response?.data.message
          
          toast({
            title:'Sign-up failed',
            description:errorMessage,
            variant:"destructive"
        })
        
        setIsSubmitting(false)
    }
}
  
      
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1  className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Join Mystery Message
            </h1>

            <p className="mb-4">Sign up to start your anonymous adventure
            </p>

          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} 
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                    />
                  </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    <p className={`txt-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage />
              </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} 
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced2(e.target.value)
                    }}
                    />
                  </FormControl>
                    {isCheckingEmail && <Loader2 className="animate-spin"/>}
                    <p className={`txt-sm ${emailMessage === "Email is unique" ? 'text-green-500' : 'text-red-500'}`}>{emailMessage}</p>
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
              {
                  isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"
                    /> 
                    Please wait
                    </>
                  ):
                  ('Signup')
              }
            </Button>
            </form>
          </Form>
          <div className="text-center">
            <p>
              Already a member?{' '}
              <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
export default page