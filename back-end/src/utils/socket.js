import { saveMessageToFirebase } from '../controllers/messageController.js';

let ioInstance;
const onlineUsers = {}; // ng online

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // ng kết nối
    socket.on('join', ({ userId }) => {
      if (!userId) {
        console.warn('thiếu userid');
        return;
      }
      
      onlineUsers[userId] = socket.id;
      //kiểm thử
      console.log(`${userId} is online`);

      //ds ng online
      io.emit('onlineUsers', Object.keys(onlineUsers));
    });

    // send tn
    socket.on('privateMessage', async (data, callback) => {
  try {
    const { sender, receiver, content } = data
    const message = {
      sender,
      receiver,
      content,
      timestamp: new Date().toISOString(),
    }

    await saveMessageToFirebase(message)

    socket.emit('privateMessage', message)

    const receiverSocket = onlineUsers[receiver]
    if (receiverSocket) {
      io.to(receiverSocket).emit('privateMessage', message)
    }

    if (callback) callback({ status: 'success' })

  } catch (error) {
    console.error(error)
    if (callback) callback({ status: 'error', message: 'lỗi khi gửi tin nhắn' })
  }
})


    // đóng kết nối
    socket.on('disconnect', () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          //kiểm thử
          console.log(`${userId} disconnected`);
          delete onlineUsers[userId];

          io.emit('onlineUsers', Object.keys(onlineUsers));
          break;
        }
      }
    });
  });
};