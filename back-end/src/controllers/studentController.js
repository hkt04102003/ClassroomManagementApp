import db from "../utils/firebase.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const sendLoginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "không tìm thấy email" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.password) {
      return res.status(400).json({ error: "Người dùng chưa đặt mật khẩu" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mật khẩu không hợp lệ" });
    }

    const codeRef = doc(db, "emailAccessCodes", email);
    await setDoc(codeRef, { code }, { merge: true });

    await sendEmail(email, "Mã code của bạn", `Mã code của bạn là: ${code}`);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "lỗi gửi email đăng nhập" });
  }
};

export const validateEmailCode = async (req, res) => {
  try {
    const { email, accessCode } = req.body;
    const codeRef = doc(db, "emailAccessCodes", email);
    const codeDoc = await getDoc(codeRef);

    if (!codeDoc.exists() || codeDoc.data().code !== accessCode) {
      return res.status(400).json({ error: "Mã code không hợp lệ" });
    }

    await deleteDoc(codeRef);
    const token = jwt.sign({ email, role: "student" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi xác thực mã code" });
  }
};
export const setupEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(usersQuery);
    if (querySnapshot.empty) {
      return res.status(404).json({ error: "Không tìm thấy email" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, { password: hashedPassword });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Thiết lập email thất bại" });
  }
};

export const getLessons = async (req, res) => {
  try {
    const { email } = req.query;
    const lessonsSnap = await getDocs(
      collection(db, "studentLessons", email, "lessons")
    );
    const lessons = lessonsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi lấy bài học" });
  }
};

export const markLessonDone = async (req, res) => {
  try {
    const { email, lessonId } = req.body;
    const lessonRef = doc(db, "studentLessons", email, "lessons", lessonId);

    await updateDoc(lessonRef, { status: "Done" });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi cập nhật trạng thái bài học" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    const userRef = doc(db, "users", phone);

    await updateDoc(userRef, { name, email });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi cập nhật thông tin cá nhân" });
  }
};
