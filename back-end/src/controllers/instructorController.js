import db from "../utils/firebase.js";
import { sendEmail } from "../utils/sendEmail.js";
import { v4 as uuidv4 } from "uuid";

import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import jwt from "jsonwebtoken";

export const sendLoginEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const codeRef = doc(db, "emailAccessCodes", email);
    await setDoc(codeRef, { code }, { merge: true });

    await sendEmail(email, "Your login code", `Your code is: ${code}`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send login email" });
  }
};


export const validateEmailCode = async (req, res) => {
  try {
    const { email, accessCode } = req.body;

    // Kiểm tra mã truy cập
    const codeRef = doc(db, "emailAccessCodes", email);
    const codeDoc = await getDoc(codeRef);

    if (!codeDoc.exists() || codeDoc.data().code !== accessCode) {
      return res.status(400).json({ error: "Invalid code" });
    }

    await deleteDoc(codeRef);
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(usersQuery);

    let instructorId;

    if (querySnapshot.empty) {
      instructorId = uuidv4();
      const userRef = doc(db, "users", instructorId);
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await setDoc(userRef, {
        email,
        role: "instructor",
        address: "",
        createdBy: email,
        name: "instructor" + code,
        phone: "",
        status: "",
        password: "",
        createdAt: new Date().toISOString(),
      });
    } else {
      instructorId = querySnapshot.docs[0].id;
    }

    const token = jwt.sign(
      { email, role: "instructor" },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code validation failed" });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { name, phone, email, address, instructorEmail } = req.body;
    const studentId = uuidv4();

    const studentRef = doc(db, "users", studentId);
    const accessLink = `${process.env.NEXT_PUBLIC_URL}/student/setup/${studentId}`;

    await setDoc(studentRef, {
      name,
      phone,
      email,
      address,
      createdBy: instructorEmail,
      password: "",
      status: "active",
      role: "student",
      createdAt: new Date(),
    });

    const htmlContent = `
      <h2>Xin chào ${name},</h2>
      <p>Bạn được mời vào lớp học</p>
      <p>Vui lòng nhấp vào liên kết bên dưới để thiết lập tài khoản học sinh của bạn:</p>
      <a href="${accessLink}">${accessLink}</a>
      <p>Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này.</p>
    `;

    await sendEmail(email, "Thiết lập tài khoản học sinh của bạn", htmlContent);

    res
      .status(200)
      .json({ success: true, message: "Đã thêm hs thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi thêm học sinh" });
  }
};


export const assignLesson = async (req, res) => {
  const { title, description, assignedStudents, instructorEmail, status } =
    req.body;

  const lessonId = uuidv4();

  try {
    const lessonRef = doc(db, "lessons", lessonId);

    const lessonData = {
      id: lessonId, 
      title,
      description,
      createdBy: instructorEmail,
      assignedTo: assignedStudents,
      status,
      createdAt: new Date(),
    };

    await setDoc(lessonRef, lessonData);
    for (const studentEmail of assignedStudents) {
      const studentLessonRef = doc(
        db,
        "studentLessons",
        studentEmail,
        "lessons",
        lessonId
      );
      const studentLessonData = {
        id: lessonId,
        title,
        description,
        assignedBy: instructorEmail,
        status: "pending", 
        assignedAt: new Date(),
      };
      await setDoc(studentLessonRef, studentLessonData);
    }
    
    res.status(200).json({
      success: true,
      data: lessonData, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi tạo bài học" });
  }
};

export const getLessons = async (req, res) => {
  try {
    const { instructorEmail } = req.query;
    console.log("instructorEmail là", instructorEmail);

    const q = query(
      collection(db, "lessons"),
      where("createdBy", "==", instructorEmail)
    );
    const lessonsSnap = await getDocs(q);
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

export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.query;

    if (!lessonId) {
      return res.status(400).json({ error: "thiếu lesson id" });
    }

    const lessonRef = doc(db, "lessons", lessonId);
    await deleteDoc(lessonRef);

    res
      .status(200)
      .json({ success: true, message: "xóa bài học thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi xóa bài học" });
  }
};

export const editLesson = async (req, res) => {
  try {
    const { id, title, description, assignedStudents } = req.body;

    if (!id || !title || !description) {
      return res.status(400).json({ error: "thiếu trường edit" });
    }

    const lessonRef = doc(db, "lessons", id);
    const docSnap = await getDoc(lessonRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Bài học không tồn tại" });
    }

    await updateDoc(lessonRef, {
      title,
      description,
      assignedTo: assignedStudents,
      status: "assigned",
      updatedAt: new Date(),
    });

    return res
      .status(200)
      .json({ success: true, message: "Cập nhật bài học thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi cập nhật bài học" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { instructorEmail } = req.query;
    let q = query(collection(db, "users"), where("role", "==", "student"));

    if (instructorEmail) {
      q = query(
        collection(db, "users"),
        where("role", "==", "student"),
        where("instructorEmail", "==", instructorEmail)
      );
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi get học sinh" });
  }
};


export const editStudent = async (req, res) => {
  try {
    const { id, name, email, phone, address } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({ error: "thiếu trường edit" });
    }

    const studentRef = doc(db, "users", id);
    const docSnap = await getDoc(studentRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Học sinh không tồn tại" });
    }

    await updateDoc(studentRef, {
      name,
      email,
      phone,
      address,
    });

    return res
      .status(200)
      .json({ success: true, message: "Cập nhật học sinh thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi cập nhật học sinh" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: "cần email để xóa học sinh" });
    }

    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ error: "Học sinh không tồn tại" });
    }

    const studentDoc = snapshot.docs[0];
    await deleteDoc(doc(db, "users", studentDoc.id));

    return res.status(200).json({ success: true, message: "Xóa học sinh thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "lỗi xóa học sinh" });
  }
};

