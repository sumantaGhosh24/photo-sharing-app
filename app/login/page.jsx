import Link from "next/link";

import LoginForm from "@/components/login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="space-y-4 rounded-lg p-5 shadow-lg dark:shadow-gray-400">
        <LoginForm />
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href={"/register"} className="text-sm text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
