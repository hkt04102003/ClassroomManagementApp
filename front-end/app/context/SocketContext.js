'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

useEffect(() => {
  const userId = localStorage.getItem('email');

  const newSocket = io(process.env.NEXT_PUBLIC_URL_BE);

  newSocket.on('connect', () => {
    if (userId) {
      newSocket.emit('join', { userId });
    }
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, []);

  useEffect(() => {
    if (!socket) return

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users)
    }

    socket.on('onlineUsers', handleOnlineUsers)

    return () => {
      socket.off('onlineUsers', handleOnlineUsers)
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  return useContext(SocketContext)
}