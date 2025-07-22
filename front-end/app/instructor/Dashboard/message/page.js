"use client";
import ChatContainer from "@/app/components/ChatContainer/ChatContainer";
import ChatSideBar from "@/app/components/ChatSideBar/ChatSideBar";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUserId(localStorage.getItem("email"));
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }
  return (
    <div className="flex">
      <ChatSideBar
        role="instructor"
        currentUserId={currentUserId}
        onSelectChat={setCurrentChat}
      />
      {currentChat ? (
        <ChatContainer
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="bg-[#f6f6f6] w-[800px] h-[600px] rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Page;
