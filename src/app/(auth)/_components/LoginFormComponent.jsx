"use client";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { loginAction } from "@/action/auth.action";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must at least 6 characters.")
})


export default function LoginFormComponent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await loginAction(data)

    if (result?.error) {
      setError("root", {
        type: "manual",
        message: "Wrong email or password. Please try again."
      });
      return;
    }

    if (result) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {errors.root && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {errors.root.message}
        </div>
      )}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        variant="solid"
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}