import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log(email, password);

    try {
      // Mock login success for exploration
      setUser({
        _id: "mock-user-123",
        name: "Explorer User",
        email: email,
        password: password,
        role: "admin", // Assuming admin role to see all features
      });
      const token = "mock-token-123";
      localStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <div className="bg-gray-50 h-screen w-screen p-8 flex justify-center">
      <div>
        <div className="mb-8">
          <div className="bg-black p-4 w-12 h-12 rounded-full mx-auto mb-6"></div>
          <h3 className="text-4xl font-bold text-center mb-2">LMS</h3>
          <p className="text-center font-light">
            A Digital Library Management System
          </p>
        </div>
        <form className="bg-white w-[400px] rounded-xl p-4 space-y-4 shadow">
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-center mb-2">
              Welcome Back
            </h4>
            <p className="text-center font-light text-sm">
              Sign in to access your library account
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              id="email"
              placeholder="Enter your email."
              className="border w-full p-2 rounded-lg"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              id="password"
              placeholder="Enter your password."
              className="border w-full p-2 rounded-lg"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              type="password"
            />
          </div>
          <button
            className="w-full bg-black text-white border p-2 rounded-lg
          hover:bg-gray-800 cursor-pointer"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <p className="text-center">
            Don't Have an Account?{" "}
            <Link to={"/register"} className="underline">
              Register Now
            </Link>
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Demo: any email / any password
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
