// === SignUp Page ===
// Handles user registration with Supabase auth
// - email/password signup
// - email confirmation required (redirect to login page)
// - basic error handling (domain restriction expected)

"use client";

import { useRouter } from 'next/navigation';
import { Loader2, Send } from "lucide-react";
import { useState } from "react"
import { getClient } from '@/lib/uqac-lib';
import { Button, InputBox, UqacBox, Wrapper } from '@/components/uqac-utils';

export default function SignUp() {
    const client = getClient()
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    // states for typed data
    const [m, setM] = useState("");
    const [p, setP] = useState("");
    const [cp, setCp] = useState("");

    const [err, setErr] = useState("");

    const signUp = async () => {
        setIsLoading(true);
        setErr("");

        // check matching
        if (cp != p) {
            setErr("passwords do not match !")
            setIsLoading(false)
            return
        }

        // signup with email confirmation redirect
        const { data, error } = await client.auth.signUp({
            email: m,
            password: p,
            options: {
                emailRedirectTo: "https://miel-uqac.github.io/basket/login"
            }
        })

        if (error) {
            setIsLoading(false);
            // custom message for domain restriction
            let errorMessage = "Only @uqac.ca or @etu.uqac.ca emails are allowed"
            if (error.toString() !== "AuthApiError: Unexpected status code returned from hook: 422") {
                errorMessage = error.toString()
            }
            setErr(errorMessage);
        } else {
            alert("Your account was created ! You will receive an email with an email to activate your account and that will also log you in. You will be redirected to the login page in case it doesn't automatically log you in.");
            router.push("/login")
        }
    }

    return <>
        <Wrapper>
            <UqacBox title={"Sign Up"} className="min-w-[70%] min-h-[70%] flex flex-col items-center justify-center">
                <InputBox placeholder={"email"} onChange={(e:any)=>setM(e.target.value)} type={"email"} />
                
                <InputBox placeholder={"password"} onChange={(e:any)=>setP(e.target.value)} type={"password"} className="mt-2 mb-2" />

                <InputBox placeholder={"confirm password"} onChange={(e:any)=>setCp(e.target.value)} type={"password"} />
                
                <Button disabled={isLoading} onClick={(e: any) => {signUp()}} className={`m-2 flex items-center justify-center border-2 border-white/40`}>
                    {isLoading ? (
                        <Loader2 className="transition animate-spin mr-1" size={20} />
                    ) : (
                        <Send className="mr-1" size={20} />
                    )}
                    Confirm
                </Button>
                
                {/* error message */}
                <span className="text-red-500 h-[10px]">{err}</span>
                
                {/* back to login */}
                <Button className="bg-transparent hover:!bg-transparent absolute hover:underline bottom-0 text-uqac-green" onClick={(e: any) => {router.push("/login")}}>Login</Button>
            </UqacBox>
        </Wrapper>
    </>
}