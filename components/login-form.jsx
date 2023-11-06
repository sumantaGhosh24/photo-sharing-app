"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {useToast} from "./ui/use-toast";

const formSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6, {message: "Name must be at lease 6 characters."}),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {toast} = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      setLoading(false);
      toast({
        title: "Login successful!",
        description: `user @${values.email} login.`,
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
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  placeholder="Enter animation email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  placeholder="Enter animation password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
