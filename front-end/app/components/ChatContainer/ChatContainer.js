"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiSend } from "react-icons/fi";
import { useSocket } from "../../context/SocketContext";
import { getMessages } from "../../services/chatService";

const ChatContainer = ({ currentChat, currentUserId, setCurrentChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentChat?.email) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(currentUserId, currentChat.email);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [currentChat, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (message) => {
      if (
        (message.sender === currentUserId &&
          message.receiver === currentChat?.email) ||
        (message.sender === currentChat?.email &&
          message.receiver === currentUserId)
      ) {
        setMessages((prev) => [...prev, message]);

        scrollToBottom();
      }
    };

    const handleTyping = ({ sender, isTyping }) => {
      if (sender === currentChat?.email) {
        setTypingStatus(isTyping ? `${currentChat.email} is typing...` : "");
      }
    };

    socket.on("privateMessage", handlePrivateMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket, currentChat, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat?.email || !socket) return;

    const message = {
      sender: currentUserId,
      receiver: currentChat.email,
      content: newMessage,
    };

    socket.emit("privateMessage", message, (response) => {
      if (response.status === "success") {
        setNewMessage("");
        scrollToBottom();
      } else {
        console.error("Failed to send message:", response.message);
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!socket || !currentChat?.email) return;

    if (newMessage && !isTyping) {
      socket.emit("typing", {
        sender: currentUserId,
        receiver: currentChat.email,
        isTyping: true,
      });
      setIsTyping(true);
    } else if (!newMessage && isTyping) {
      socket.emit("typing", {
        sender: currentUserId,
        receiver: currentChat.email,
        isTyping: false,
      });
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#f6f6f6] w-[800px] h-[600px] rounded-lg flex flex-col justify-between">
      <div className="p-6 border-b border-b-[#d9d9d9] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar>
              <AvatarImage src={"https://github.com/evilrabbit.png"} />
              <AvatarFallback>
                {currentChat?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-sm font-medium">
              Chat with {currentChat?.name || "User"}
            </h3>
            <p className="text-xs text-gray-500">
              {typingStatus || (socket?.connected ? "Online" : "Offline")}
            </p>
          </div>
        </div>
        <div onClick={() => setCurrentChat(null)} className="cursor-pointer">
          x
        </div>
      </div>

      <div className="h-full flex flex-col overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.sender === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow ${
                  message.sender === currentUserId
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-t-[#d9d9d9] items-end relative">
        <textarea
          placeholder="Type a message..."
          className="w-full p-2 pr-10 border border-[#d9d9d9] rounded-lg resize-none"
          rows={1}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyPress}
        />
        <FiSend
          className="absolute right-10 bottom-[42px] text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

ChatContainer.defaultProps = {
  currentChat: null,
  currentUserId: "",
};

export default ChatContainer;
