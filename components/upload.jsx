"use client";

import {useMemo, useState} from "react";

import {Button} from "./ui/button";
import {useToast} from "./ui/use-toast";
import UploadForm from "./upload-form";
import UploadCard from "./upload-card";
import {uploadPhotos} from "@/actions/photoAction";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const count = useMemo(() => {
    return files.filter((file) => file?.status === "success").length;
  }, [files]);

  const handleUpload = async () => {
    const filesUpload = files.filter((file) => file?.status === "success");
    const formData = new FormData();
    filesUpload.forEach((file) => {
      formData.append("files", file.fileUpload);
      if (!file.title) {
        file.title = file.name.replace(/.(jpeg|jpg|png)$/gi, "");
      }
    });
    const newFiles = filesUpload.map((file) => ({
      ...file,
      fileUpload: "",
      imgUrl: "",
    }));
    setLoading(true);
    const res = await uploadPhotos(formData, newFiles);
    setLoading(false);
    if (res.resMessage) {
      toast({
        title: "Photo upload failed!",
        description: res.resMessage,
        variant: "destructive",
      });
    }
    files.map((file) => URL.revokeObjectURL(file.imgUrl));
    setFiles([]);
    if (res.message) {
      toast({
        title: "Photo upload success!",
        description: res.message,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <UploadForm setFiles={setFiles} />
      <div className="mb-5 flex flex-wrap items-start">
        {files.map((file, i) => (
          <UploadCard key={i} id={i} file={file} setFiles={setFiles} />
        ))}
      </div>
      <Button
        variant="primary"
        disabled={count <= 0 || count > 5 || loading}
        onClick={handleUpload}
        className="mb-5"
      >
        {loading ? "Loading..." : count ? `Upload ${count} photo` : "Upload"}
      </Button>
    </div>
  );
};

export default Upload;
