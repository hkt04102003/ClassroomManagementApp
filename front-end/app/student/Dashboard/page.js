'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Page = () => {
    const router = useRouter();
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/student/SignIn");
        return;
      }
    });
  return (
    <div>dashboard</div>
  )
}

export default Page