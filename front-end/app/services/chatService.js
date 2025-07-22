import axios from "axios"

export const getMessages = async (userA, userB) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE}/api/messages?userA=${userA}&userB=${userB}`
    )
    if (!response.ok) throw new Error('lỗi lấy tin nhắn')
    return await response.json()
  } catch (error) {
    console.error('lỗi fetch mess:', error)
    return []
  }
}

export const getConversations = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_BE}/api/messages/conversations/${userId}`
    )
    if (!response.ok) throw new Error('Failed to fetch conversations')
    return await response.json()
  } catch (error) {
    console.error('lỗi lấy cuộc trò chuyện:', error)
    return []
  }
}

export const getOppositeRoleUsers = async (role) => {
 
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_URL_BE}/api/messages/opposite-users?role=${role}`
    );
    if (response.status !== 200) throw new Error('lấy người dùng nhắn tin thất bại');
    return await response.data;
  } catch (error) {
    console.error('lỗi lấy hộp thoại nhắn tin:', error);
    return [];
  }
};