"use client";
import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [instructorEmail, setInstructorEmail] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [idLesson, setIdLesson] = useState("");
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    assignedStudents: [],
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/students?instructorEmail=${instructorEmail}`
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách học sinh:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/instructor/SignIn");
      return;
    }
    const email = localStorage.getItem("email") || "";
    setInstructorEmail(email);
    fetchStudents();
    fetchLessons(email);
  }, []);
  const fetchLessons = async (email) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/lessons?instructorEmail=${email}`
      );
      setLessons(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách bài học:", error);
    }
  };

  const handleCreateLesson = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/assignLesson`,
        {
          ...newLesson,
          instructorEmail,
          status: "assigned",
        }
      );
      setLessons((prev) => [...prev, response.data.data]);
      setNewLesson({
        title: "",
        description: "",
        assignedStudents: [],
      });
    } catch (error) {
      console.error("Lỗi tạo bài học:", error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/lesson?lessonId=${lessonId}`
      );
      alert("Xóa bài học thành công");
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
    } catch (error) {
      console.error("Lỗi xóa bài học:", error);
    }
  };

  const handleStudentSelect = (studentEmail, isChecked) => {
    setNewLesson((prev) => {
      if (isChecked) {
        return {
          ...prev,
          assignedStudents: [...prev.assignedStudents, studentEmail],
        };
      } else {
        return {
          ...prev,
          assignedStudents: prev.assignedStudents.filter(
            (email) => email !== studentEmail
          ),
        };
      }
    });
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson?.title?.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/editLesson`,
        {
          ...newLesson,
          id : idLesson,
        }
      );
      alert("Cập nhật bài học thành công");
      fetchLessons(instructorEmail);
      setNewLesson({
        title: "",
        description: "",
        assignedStudents: [],
      });
    } catch (error) {
      console.error("Lỗi cập nhật bài học:", error);
    }
  }
  const handleEdit = (lesson) => {
    setIdLesson(lesson.id);
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      assignedStudents: lesson.assignedTo || [],
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Lesson</h1>

      <div className="bg-white rounded-md border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{lessons.length} Lessons</h2>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setNewLesson({
                      title: "",
                      description: "",
                      assignedStudents: [],
                    });
                  }}
                  variant="outline"
                  className="flex gap-1 border border-[#006afe] bg-[#e8f1ff] hover:bg-[#d0e4ff] hover:text-[#006afe] text-[#006afe] cursor-pointer"
                >
                  <span>+ Add Lesson</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Lesson</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title-1">Title</Label>
                    <Input
                      id="title-1"
                      name="title"
                      value={newLesson.title}
                      onChange={(e) =>
                        setNewLesson({ ...newLesson, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description-1">Description</Label>
                    <Input
                      id="description-1"
                      name="description"
                      value={newLesson.description}
                      onChange={(e) =>
                        setNewLesson({
                          ...newLesson,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label>Assign To</Label>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center gap-2 p-2"
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={newLesson.assignedStudents.includes(
                              student.email
                            )}
                            onCheckedChange={(checked) =>
                              handleStudentSelect(student.email, checked)
                            }
                          />
                          <Label htmlFor={`student-${student.id}`}>
                            {student.name} ({student.email})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleCreateLesson}>
                      Submit
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <TableHead>Assigned Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.description}</TableCell>
                <TableCell>
                  {lesson.assignedTo?.length > 0
                    ? lesson.assignedTo.join(", ")
                    : "None"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      lesson.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEdit(lesson)}
                          variant="outline"
                          className="hover:bg-[#0053d6] bg-[#006afe] text-white cursor-pointer"
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Create Lesson</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="title-1">Title</Label>
                            <Input
                              id="title-1"
                              name="title"
                              value={newLesson.title}
                              onChange={(e) =>
                                setNewLesson({
                                  ...newLesson,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="description-1">Description</Label>
                            <Input
                              id="description-1"
                              name="description"
                              value={newLesson.description}
                              onChange={(e) =>
                                setNewLesson({
                                  ...newLesson,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label>Assign To</Label>
                            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                              {students.map((student) => (
                                <div
                                  key={student.id}
                                  className="flex items-center gap-2 p-2"
                                >
                                  <Checkbox
                                    id={`student-${student.id}`}
                                    checked={newLesson.assignedStudents.includes(
                                      student.email
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleStudentSelect(
                                        student.email,
                                        checked
                                      )
                                    }
                                  />
                                  <Label htmlFor={`student-${student.id}`}>
                                    {student.name} ({student.email})
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="button" onClick={handleUpdate}>
                              Submit
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="bg-red-400 text-white hover:bg-red-500 cursor-pointer"
                    >
                      Delete
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
