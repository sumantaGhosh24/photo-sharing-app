import Link from "next/link";

import RegisterForm from "@/components/register-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="shadow-lg rounded-lg p-5 space-y-4 dark:shadow-gray-400">
        <RegisterForm />
        <p className="text-sm">
          Already have an account?{" "}
          <Link href={"/login"} className="text-sm text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
