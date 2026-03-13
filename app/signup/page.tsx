"use client";
import { useRouter } from 'next/navigation';
import { createClient } from "@supabase/supabase-js";
import { Armchair, Loader2, Send } from "lucide-react";
import { useState } from "react"
import { getClient } from '@/lib/uqac-lib';
import { Button, InputBox, UqacBox, Wrapper } from '@/components/uqac-utils';

export default function SignUp() {
    const client = getClient()
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [m, setM] = useState("");
    const [p, setP] = useState("");
    const [err, setErr] = useState("");

    const login = async () => {
        setIsLoading(true);
        setErr("");

        const { data, error } = await client.auth.signUp({
            email: m,
            password: p,
            options: {
                emailRedirectTo: "/login"
            }
        })

        if (error) {
            setIsLoading(false);
            setErr(error.toString());
        } else {
            router.push("/login")
        }
    }

    return <>
        <Wrapper>
            <UqacBox title={"Sign Up"} className="w-[50%] h-[50%] flex flex-col items-center justify-center">

                <InputBox placeholder={"email"} onChange={(e:any)=>setM(e.target.value)} type={"email"} className="mb-2" />
                
                <InputBox placeholder={"password"} onChange={(e:any)=>setP(e.target.value)} type={"password"} />
                                    
                
                <Button disabled={isLoading} onClick={(e: any) => {SignUp()}} className={`m-2 flex items-center justify-center border-2 border-white/40`}>
                    {isLoading ? (
                        <Loader2 className="transition animate-spin mr-1" size={20} />
                    ) : (
                        <Send className="mr-1" size={20} />
                    )}
                    Confirm
                </Button>

                <span className="text-red-500 h-[10px]">{err}</span>
            </UqacBox>
        </Wrapper>
    </>
}