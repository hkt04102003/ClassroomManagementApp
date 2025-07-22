"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";


const Page = () => {
  const [lessons, setLessons] = React.useState([]);
  const [studentEmail, setStudentEmail] = React.useState("");
  const [filterText, setFilterText] = React.useState("");
  const [makeDone, setMakeDone] = React.useState(false);
   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/student/SignIn");
      return;
    }
    const email = localStorage.getItem("email") || "";
    setStudentEmail(email);
    fetchLessons(email);
  }, []);
  const fetchLessons = async (email) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/student/myLessons?email=${email}`
      );
      setLessons(res.data);
      console.log("Fetched lessons:", res.data);
      
    } catch (error) {
      console.error("Lỗi lấy danh sách bài học:", error);
    }
  };
  const filteredLessons = lessons.filter((lesson) =>
    lesson?.title?.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleUpdateLessonStatus = async (lessonId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BE}/api/student/markLessonDone`, {
        email: studentEmail,
        lessonId,
      });
      setMakeDone(true);
      fetchLessons(studentEmail);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái bài học:", error);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Lesson</h1>

      <div className="bg-white rounded-md border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{filteredLessons.length} Lessons</h2>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Filter"
              className="w-40"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLessons.map((lesson, index) => (
              <TableRow key={index}>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                    {lesson.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      disabled={lesson.status === "Done"}
                      className="hover:bg-[#0053d6] bg-[#006afe] text-white cursor-pointer"
                      onClick={() => handleUpdateLessonStatus(lesson.id)}
                    >
                      {makeDone ? "Done" : "Mark as Done"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
