import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cookies } from "next/headers"
import crypto from 'crypto'
import { ServerMessageStatus, toastToClient } from "@/components/toast-to-client"

export function AuthenticateAdminUser() {
    const handleAuth = async (formData: FormData) => {
        "use server"

        const password = formData.get("password");
        if (typeof password !== "string") {
            toastToClient({status: ServerMessageStatus.error, serverMessage: "Password is not a string!"});
        } else {
            const encryptedPassword = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');
            const oneHour = 60 * 60;
            cookies().set("admin-pass", encryptedPassword, { 
                maxAge: oneHour,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            toastToClient({status: ServerMessageStatus.success, serverMessage: "Authenticated successfully."});
        }
    }

    return (
        <form action={handleAuth}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Authenticate</CardTitle>
                    <CardDescription>Enter your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input autoComplete="off" id="password" name="password" type="password" placeholder="Enter password" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href={"/"}>Return</Link></Button>
                    <Button type="submit">Enter</Button>
                </CardFooter>
            </Card>
        </form>
    )
}
