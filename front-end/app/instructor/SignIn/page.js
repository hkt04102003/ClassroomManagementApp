"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const Page = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
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
    if (!email) {
      setError("Vui lòng nhập email của bạn");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/loginEmail`, {email});
      setStep(1);
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Lỗi gửi email xác thực");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!accessCode) {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/validateAccessCode`,
        { email, accessCode }
      );
      
      localStorage.setItem("email", email);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "instructor");
      
      console.log(res.data);
      
      router.push("/instructor/Dashboard");
    } catch (error) {
      console.error("Code verification error:", error);
      setError(error.response?.data?.message || "Mã xác thực không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BE}/api/instructor/loginEmail`, { email });
      setError("");
      alert("Mã xác thực đã được gửi lại vào email của bạn");
    } catch (error) {
      console.error(error);
      setError("Lỗi gửi email xác thực");
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
            <span onClick={handleBack} className="cursor-pointer font-semibold text-md">
              Back
            </span>
          </div>

          {step === 0 ? (
            <>
              <h1 className="text-3xl my-2 font-semibold text-center">Sign In</h1>
              <h2 className="mb-12 text-gray-400 text-center">
                Please enter your email to sign in
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-3xl my-2 font-semibold text-center">Email verification</h1>
              <h2 className="mb-12 text-gray-400 text-center">
                Please enter the code sent to your email address
              </h2>
            </>
          )}

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 text-center rounded-sm">
              {error}
            </div>
          )}

          {step === 0 ? (
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="p-6 w-full bg-[#006afe] hover:bg-[#0053d6] cursor-pointer disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Next"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <form onSubmit={handleSubmitCode}>
                <input
                  type="text"
                  placeholder="Enter Your Code"
                  className="w-full border border-gray-300 p-3 mb-8 rounded-sm placeholder:text-gray-400"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="p-6 w-full bg-[#006afe] hover:bg-[#0053d6] cursor-pointer disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Submit"}
                </Button>
              </form>
            </div>
          )}

          {step === 0 ? (
            <>
              <span className="text-gray-500 mb-20 text-center block">
                Passwordless authentication methods
              </span>
              <span className="text-gray-500 mb-2">
                Do not have an account?{" "}
                <span className="text-[#006afe] cursor-pointer">Sign up</span>
              </span>
            </>
          ) : (
            <>
              <span className="text-gray-500 mb-20 text-center block">
                Please check your email for the verification code
              </span>
              <span className="text-gray-500 mb-2">
                Code not received?{" "}
                <span className="text-[#006afe] cursor-pointer" onClick={handleResendCode}>
                  Send again
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;