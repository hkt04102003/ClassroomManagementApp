'use client';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {useRouter} from 'next/navigation';
export default function Home() {
  const router = useRouter();

  const handleRole = (role) => {
    if (role === "admin") {
      router.push("/instructor/SignIn");
    } else if (role === "user") {
      router.push("/student/SignIn");
    }
  }
  return (
    <div>
      <div className="flex justify-center min-h-screen ">
         
           <div className="my-4 w-md">
             <h1 className="text-2xl my-4 font-bold text-center ">Select Role</h1>
             <div className="space-y-4">
               <Button onClick={() => handleRole("admin")} className="w-full bg-[#006afe] hover:bg-[#0053d6] cursor-pointer">Admin</Button>
               <Button onClick={() => handleRole("user")} className="w-full bg-[#006afe] hover:bg-[#0053d6] cursor-pointer">Users</Button>
             </div>
           </div>
         
       </div>

    </div>
  );
}
