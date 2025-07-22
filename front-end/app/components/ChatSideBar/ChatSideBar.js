"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "../../context/SocketContext";
import { getOppositeRoleUsers } from "../../services/chatService";

const ChatSideBar = ({ currentUserId, onSelectChat, role }) => {
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!role) return;
      const data = await getOppositeRoleUsers(role);
      setUsers(data);
    };

    fetchUsers();
  }, [currentUserId]);

  return (
    <div className="px-6 w-[350px] ">
      <div className="bg-[#f6f6f6] text-black mb-6 rounded-lg">
        <h2 className="text-center text-lg font-semibold py-6">
          {users[0]?.role === "student" ? "Students" : "Instructors"}
        </h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {users.map((user, index) => {
          const isOnline = onlineUsers.includes(user.email);

          return (
            <div
              key={index}
              className="bg-[#f6f6f6] text-black p-4 pr-20 hover:bg-gray-200 cursor-pointer rounded-lg mb-6"
              onClick={() =>
                onSelectChat({
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  avatar: `https://github.com/leerob.png`,
                  role: user.role,
                })
              }
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={`https://github.com/leerob.png`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{user.name}</h3>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSideBar;
