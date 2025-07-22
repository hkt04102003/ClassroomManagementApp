import db from "../utils/firebase.js";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

// tạo id chat
function generateChatId(userA, userB) {
  return [userA, userB].sort().join("_");
}

// lưu db chat
export const saveMessageToFirebase = async ({
  sender,
  receiver,
  content,
  timestamp,
}) => {
  const chatId = generateChatId(sender, receiver);
  const conversationRef = doc(db, "conversations", chatId);

  try {

    await setDoc(
      conversationRef,
      {
        lastMessage: content,
        updatedAt: serverTimestamp(),
        participants: [sender, receiver],
        [`unread_${receiver}`]: true,
      },
      { merge: true } 
    );

    const messagesCollection = collection(db, "conversations", chatId, "messages");
    const docRef = await addDoc(messagesCollection, {
      sender,
      receiver,
      content,
      timestamp: timestamp || serverTimestamp(),
      status: "delivered",
    });

    return {
      id: docRef.id,
      sender,
      receiver,
      content,
      timestamp: timestamp || new Date().toISOString(),
      status: "delivered",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getMessages = async (req, res) => {
  try {
    const { userA, userB, lastMessageId } = req.query;

    if (!userA || !userB) {
      return res.status(400).json({ error: "thiếu user" });
    }

    const chatId = generateChatId(userA, userB);
    let messagesQuery = query(
      collection(db, "conversations", chatId, "messages"),
      orderBy("timestamp", "desc"),
    );

    if (lastMessageId) {
      const lastDoc = await getDoc(
        doc(db, "conversations", chatId, "messages", lastMessageId)
      );
      messagesQuery = query(messagesQuery, startAfter(lastDoc));
    }

    const snapshot = await getDocs(messagesQuery);
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      
      let timestamp;
      if (data.timestamp?.toDate) { 
        timestamp = data.timestamp.toDate().toISOString();
      } else if (data.timestamp) { 
        timestamp = data.timestamp;
      } else { 
        timestamp = new Date().toISOString();
      }

      return {
        id: doc.id,
        ...data,
        timestamp: timestamp
      };
    });

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "lỗi lấy tin nhắn" });
  }
};


export const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);
    const conversations = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const lastMessageQuery = query(
          collection(db, "conversations", doc.id, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.docs[0]?.data();

        return {
          id: doc.id,
          ...data,
          updatedAt: data.updatedAt?.toDate().toISOString(),
          lastMessage,
        };
      })
    );

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "lỗi lấy cuộc trò chuyện" });
  }
};

export const getOppositeRoleUsers = async (req, res) => {
  const { role } = req.query;
  if (!role) {
    return res.status(400).json({ message: "Thiếu tham số role" });
  }

  const oppositeRole = role === "student" ? "instructor" : "student";

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", oppositeRole));
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
