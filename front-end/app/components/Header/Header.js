'use client'
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegBell } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    router.push("/instructor/SignIn");
  };
  return (
    <div className="flex justify-between items-center py-4 px-10 text-black">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <FaRegBell className="text-2xl cursor-pointer" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className={"cursor-pointer"}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
