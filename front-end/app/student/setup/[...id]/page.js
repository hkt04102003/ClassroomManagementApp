"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Page = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBack = () => {
    if (step === 0) {
      router.push("/");
    } else {
      setStep(0);
      setError("");
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu của bạn");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/student/setupEmail`,
        { email, password }
      );
      setStep(1);
      setError("");
      router.push("/student/SignIn");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Lỗi gửi email xác thực");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-start min-h-screen">
        <div className="mt-36 border border-gray-200 rounded-sm p-6 max-w-md w-full">
          <div className="flex justify-start items-center gap-2">
            <FaArrowLeft onClick={handleBack} className="cursor-pointer" />
            <span
              onClick={handleBack}
              className="cursor-pointer font-semibold text-md"
            >
              Back
            </span>
          </div>

          <h1 className="text-3xl my-2 font-semibold text-center">Set up</h1>
          <h2 className="mb-12 text-gray-400 text-center">
            Please enter your email to set up your account
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 text-center rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <form onSubmit={handleSubmitEmail}>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 p-3 mb-8 rounded-sm placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Your Password"
                className="w-full border border-gray-300 p-3 mb-8 rounded-sm placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="p-6 w-full bg-[#006afe] hover:bg-[#0053d6] cursor-pointer disabled:opacity-70"
              >
                {loading ? "Sending..." : "Next"}
              </Button>
            </form>
          </div>

          <span className="text-gray-500  text-center block">
            Passwordless authentication methods
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
