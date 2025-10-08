import type { Metadata } from "next";
import { Overall } from "@/components/home/course-list/overall";

export const metadata: Metadata = {
    title: '登録済みの講義'
}

export default function CourseListPage() {
    return <Overall />
}