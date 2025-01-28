'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const accessCode = "unique2025"; 

    if (code === accessCode) {
      sessionStorage.setItem("accessGranted", "true"); 
      router.push("/");
    } else if (code === "admin"){
      sessionStorage.setItem("accessGranted", "true");
      router.push("/admin");
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--cream-white)]">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="password"
        placeholder="Enter access code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="px-4 py-2 border rounded-md mb-2"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-md"
      >
        Submit
      </button>
    </div>
  );
}
