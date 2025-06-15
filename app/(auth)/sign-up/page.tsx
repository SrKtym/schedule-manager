import SignUpForm from "@/components/login/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'サインアップ'
}

export default function SignUpPage() {
    return <SignUpForm/>;
}