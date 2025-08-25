import SignInForm from "@/components/auth/login/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'サインイン'
}

export default function SignInPage() {
    return <SignInForm/>;
}