'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { registerAction } from '@/action/auth.action';

export default function RegisterFormComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const registrationPromise = registerAction(data);

    toast.promise(registrationPromise, {
      loading: 'Creating your account...',
      success: (res) => {
        if (res.error) throw new Error(res.error);
        router.push('/login');
        return "Account created! Redirecting to login...";
      },
      error: (err) => err.message || "Registration failed.",
    });

    try {
      await registrationPromise;
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">First Name</label>
          <input name="firstName" required className="rounded-xl border p-2 text-sm" placeholder="John" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Last Name</label>
          <input name="lastName" required className="rounded-xl border p-2 text-sm" placeholder="Doe" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" required className="rounded-xl border p-2 text-sm" placeholder="john@example.com" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Birth Date</label>
        <input name="birthDate" type="date" required className="rounded-xl border p-2 text-sm" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Password</label>
        <input name="password" type="password" required className="rounded-xl border p-2 text-sm" placeholder="••••••••" />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 font-semibold text-gray-900 transition hover:bg-lime-300 disabled:bg-gray-200"
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        {isLoading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}