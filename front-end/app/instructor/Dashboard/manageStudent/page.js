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
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [instructorEmail, setInstructorEmail] = React.useState("");
  const [students, setStudents] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [editingStudent, setEditingStudent] = React.useState(null);
  const router = useRouter();
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/students?instructorEmail=${instructorEmail}`
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/instructor/SignIn");
      return;
    }
    setInstructorEmail(localStorage.getItem("email") || "");
    fetchStudents();
  }, []);
  const handleCreateStudent = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/addStudent`,
        {
          name,
          phone,
          email,
          address,
          instructorEmail,
        }
      );
      if (res.status === 200) {
        alert("Student created successfully");
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setInstructorEmail("");
      }
      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };
  const handleDeleteStudent = async (email) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/student`,
        {
          data: { email },
        }
      );
      alert("Student deleted");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  const handleUpdateStudent = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/editStudent`,
        {
          id: idUser,
          name,
          email,
          phone,
          address,
        }
      );
      alert("Student updated");
      fetchStudents();
      setEditingStudent(null);
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };
  const [idUser, setIdUser] = React.useState("");
  const handleEdit = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setPhone(student.phone);
    setEmail(student.email);
    setAddress(student.address);
    setIdUser(student.id);
  };
  const filterStudents = students.filter((student) =>
    student.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Students</h1>

      <div className="bg-white rounded-md border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {filterStudents.length} Students
          </h2>

          <div className="flex items-center gap-2">
            <Dialog>
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setName("");
                      setPhone("");
                      setEmail("");
                      setAddress("");
                      setEditingStudent(null);
                      setIdUser("");
                    }}
                    variant="outline"
                    className="flex gap-1 border border-[#006afe] bg-[#e8f1ff] hover:bg-[#d0e4ff] hover:text-[#006afe] text-[#006afe] cursor-pointer"
                  >
                    <span>+ Add Student</span>
                  </Button>
                </DialogTrigger>
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  type="text"
                  placeholder="Filter"
                  className="w-40"
                />
              </div>
              <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-center text-3xl">
                    Create Student
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      id="name-1"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="phone-1">Phone number</Label>
                    <Input
                      id="phone-1"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email-1">Email</Label>
                    <Input
                      id="email-1"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="address-1">Address</Label>
                    <Input
                      id="address-1"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="cursor-pointer" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleCreateStudent}
                    className="bg-[#006afe] hover:bg-[#0053d6] cursor-pointer text-white"
                    type="submit"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterStudents.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                    {student.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEdit(student)}
                          className="hover:bg-[#0053d6] bg-[#006afe] text-white cursor-pointer"
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] w-full">
                        <DialogHeader>
                          <DialogTitle className="text-center text-3xl">
                            Edit Student
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input
                              id="name-1"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="phone-1">Phone number</Label>
                            <Input
                              id="phone-1"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="email-1">Email</Label>
                            <Input id="email-1" value={email} disabled />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="address-1">Address</Label>
                            <Input
                              id="address-1"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={handleUpdateStudent}
                            className="bg-[#006afe] text-white cursor-pointer"
                          >
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => handleDeleteStudent(student.email)}
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
