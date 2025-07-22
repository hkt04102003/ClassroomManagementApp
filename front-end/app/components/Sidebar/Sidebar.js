'use client';
import Link from "next/link";
import React from "react";

const Sidebar = () => {
    const [role, setRole] = React.useState("instructor");

  React.useEffect(() => {
    const val = localStorage.getItem("role");
    if (val) setRole(val);
  }, []);
  return (
    <div className="flex flex-col w-64  p-4 ">
      <div className="mt-4 flex flex-col gap-2">
        {role === "instructor" ? (
          <Link
          href="/instructor/Dashboard/manageStudent"
          className="py-2 px-4 text-[#006afe] hover:bg-[#e8f1ff] cursor-pointer"
        >
          Manage Students
        </Link>
        ):(
          <></>
        )}
        <Link
          href={`/${role}/Dashboard/manageLesson`}
          className="py-2 px-4 text-[#006afe] hover:bg-[#e8f1ff] cursor-pointer"
        >
          Manage Lesson
        </Link>
        <Link
          href={`/${role}/Dashboard/message`}
          className="py-2 px-4 text-[#006afe] hover:bg-[#e8f1ff] cursor-pointer"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
