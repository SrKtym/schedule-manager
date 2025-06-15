import SignInForm from "@/components/login/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'サインイン'
}

export default function SignInPage() {
    return <SignInForm/>;
}