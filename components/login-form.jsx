"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {useToast} from "./ui/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {toast} = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      toast({
        title: "Login successful!",
        description: `user @${email} login.`,
      });
      if (!res?.error) {
        router.push("/");
      } else {
        toast({
          title: "Login failed!",
          description: "invalid login credentials.",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login failed!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col gap-3">
          <Label className="text-base font-semibold">Email</Label>
          <div>
            <Input
              type="email"
              className="bg-gray-200 text-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label className="text-base font-semibold">Password</Label>
          <div>
            <Input
              type="password"
              className="bg-gray-200 text-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
