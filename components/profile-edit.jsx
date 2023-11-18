import {useState, useRef} from "react";
import Image from "next/image";

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {useToast} from "./ui/use-toast";
import {validFiles} from "@/lib/utils";
import {updateUser} from "@/actions/userActions";

/* eslint-disable array-callback-return */
const ProfileEdit = ({user}) => {
  const [file, setFile] = useState();
  const [name, setName] = useState(user?.name);
  const [loading, setLoading] = useState(false);

  const formRef = useRef();
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
    const formData = new FormData();
    if (file) {
      formData.append("files", file.fileUpload);
      URL.revokeObjectURL(file.imgUrl);
    }
    const res = await updateUser({formData, name, user});
    setLoading(false);
    if (res?.resMessage)
      toast({title: "Something went wrong!", description: res?.resMessage});
  };

  return (
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
            src={file?.imgUrl || user?.avatar}
            alt="image"
            width={150}
            height={150}
            sizes="50vw"
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
            hidden
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
            defaultValue={user?.name}
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
            defaultValue={user?.email}
            disabled={true}
          />
        </div>
      </div>
      <Button variant="primary" disabled={loading}>
        {loading ? "Loading..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default ProfileEdit;
