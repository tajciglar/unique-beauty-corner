'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);
      if (data.success) {
        sessionStorage.setItem("accessGranted", data.role);
        router.push(data.role === "admin" ? "/admin" : "/");
      } else {
        setError(data.message || "Invalid code");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log("ERROR:",err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--cream-white)]">
      <h1 className="text-2xl font-bold mb-4">Prijavi se</h1>
      <input
        type="password"
        placeholder="Enter access code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError(""); // Clear error on input change
        }}
        className="px-4 py-2 border rounded-md mb-2"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-md hover:opacity-90 transition-opacity"
      >
        Potrdi
      </button>
    </div>
  );
}