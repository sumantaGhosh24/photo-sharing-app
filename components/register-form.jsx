"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import {useRouter} from "next/navigation";

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
import {isBase64Image} from "@/lib/utils";
import {registerUser} from "@/actions/userActions";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: "minimum 3 characters long."})
    .max(20, {message: "maximum 20 characters long."}),
  email: z.string().email().min(1),
  password: z.string().min(6, {message: "Name must be at lease 6 characters."}),
  avatar: z.string().url().min(1),
});

const RegisterForm = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {toast} = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: "https://placehold.co/400x400.png",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      // const blob = values.avatar;
      // const hasImageChanged = isBase64Image(blob);
      // if (hasImageChanged) {
      // TODO -> upload image and set value
      // const imgRes = await startUpload(files);
      // if (imgRes && imgRes[0].fileUrl) {
      //   values.avatar = imgRes[0].fileUrl;
      // }
      // }
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar,
      });
      setLoading(false);
      toast({
        title: "Register successful!",
        description: `user @${values.name} registered.`,
      });
      router.push("/login");
      // signIn(undefined, {callbackUrl: "/"});
    } catch (error) {
      setLoading(false);
      toast({
        title: "Register failed!",
        description: error.message,
      });
    }
  };

  const handleImage = (e, fieldChange) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
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
          name="avatar"
          render={({field}) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="flex items-center justify-center rounded-full bg-black">
                {field.value && (
                  <Image
                    src={field.value}
                    alt="image"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base font-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add animation image"
                  className="cursor-pointer border-none bg-transparent outline-none file:text-blue-500"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base font-semibold">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  placeholder="Enter animation name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          {loading ? "Processing..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
