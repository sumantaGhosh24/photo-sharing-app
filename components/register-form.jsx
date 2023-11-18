"use client";

import {useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {useToast} from "./ui/use-toast";
import {registerUser} from "@/actions/userActions";
import {validFiles} from "@/lib/utils";

/* eslint-disable array-callback-return */
const RegisterForm = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
  const router = useRouter();
  const {toast} = useToast();

  const handleImageChange = (files) => {
    if (!files.length) return;
    [...files].map((file) => {
      const result = validFiles(file);
      if (result?.message) return toast({});
      setFile(result);
    });
    formRef.current.reset();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleImageChange(data.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("files", file.fileUpload);
        URL.revokeObjectURL(file.imgUrl);
      }
      await registerUser({
        formData,
        name,
        email,
        password,
      });
      setLoading(false);
      toast({
        title: "Register successful!",
        description: `user @${name} registered.`,
      });
      router.push("/login");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Register failed!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form
        className="flex flex-col justify-start gap-10"
        ref={formRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-full bg-black">
            <Image
              src={file?.imgUrl || "https://placehold.co/600x400.png"}
              alt="image"
              width={96}
              height={96}
              priority
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 text-base font-semibold text-gray-200">
            <Input
              type="file"
              accept=".png, .jpg, .jpeg"
              placeholder="Add your image"
              className="cursor-pointer border-none bg-transparent outline-none file:text-blue-500"
              onChange={(e) => handleImageChange(e.target.files)}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label className="text-base font-semibold">Name</Label>
          <div>
            <Input
              type="text"
              className="bg-gray-200 text-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
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
          {loading ? "Processing..." : "Register"}
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
