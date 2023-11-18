"use client";

import React, {useState} from "react";
import Image from "next/image";
import {Lock, X} from "lucide-react";

import {Card, CardContent} from "./ui/card";
import {useToast} from "./ui/use-toast";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Badge} from "./ui/badge";
import {updatePhoto} from "@/actions/photoAction";

// eslint-disable-next-line react/display-name
const UploadCard = React.memo(({id, file, setFiles, setIsEdit}) => {
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const validate = ({title, tags}) => {
    const errors = {};
    if (title.length > 50) {
      errors.title = "Title is too large.";
    } else {
      errors.title = "";
    }
    if (tags.length > 50) {
      errors.tags = "Tags is too large.";
    } else {
      errors.tags = "";
    }
    return errors?.title || errors?.tags ? "error" : "success";
  };

  const handleTitle = (e) => {
    const newFile = {
      ...file,
      title: e.target.value,
      status: validate({title: e.target.value, tags: file?.tags}),
    };
    setFiles((files) => files.map((item, i) => (i === id ? newFile : item)));
  };

  const handleTags = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      const tag = e.target.value
        .trim()
        .replaceAll(/\s+/g, " ")
        .replaceAll(",", "");
      if (tag.length > 1 && !file?.tags?.includes(tag)) {
        const newFile = {
          ...file,
          tags: [...file.tags, tag],
          status: validate({title: file?.title, tags: [...file.tags, tag]}),
        };
        setFiles((files) =>
          files.map((item, i) => (i === id ? newFile : item))
        );
      }
      e.target.value = "";
    }
  };

  const handleRemoveTag = (tag) => {
    if (setIsEdit) return setIsEdit(false);
    const newTags = file.tags.filter((item) => item !== tag);
    const newFile = {
      ...file,
      tags: newTags,
      status: validate({title: file?.title, tags: newTags}),
    };
    setFiles((files) => files.map((item, i) => (i === id ? newFile : item)));
  };

  const handlePublic = () => {
    setFiles((files) =>
      files.map((item, i) =>
        i === id ? {...file, public: !file.public} : item
      )
    );
  };

  const handleRemovedFile = () => {
    setFiles((files) => files.filter((_, i) => i !== id));
  };

  const handleUpdate = async () => {
    if (loading || file?.status === "error") return;
    setLoading(true);
    const res = await updatePhoto(file);
    setLoading(false);
    if (res?.resMessage)
      toast({
        title: "Something went wrong.",
        description: res?.resMessage,
        variant: "destructive",
      });
    if (res?.message)
      toast({
        title: "Update success.",
        description: res?.message,
      });
    setIsEdit(false);
  };

  return (
    <Card
      className={`relative mx-auto mb-5 !max-h-fit ${
        file?.status === "error" && "bg-destructive text-destructive-foreground"
      }`}
    >
      <CardContent className="p-0">
        <Image
          src={file?.imgUrl}
          alt={file?.title}
          width={200}
          height={200}
          title={file?.title}
          className="min-h-[200px] w-[250px] rounded object-cover"
        />
        {file?.message ? (
          <div className="mx-auto mb-4 w-[220px]">
            <h4 className="my-3 text-xl font-bold capitalize">
              {file?.status}
            </h4>
            <span className="text-sm">{file?.message}</span>
          </div>
        ) : (
          <div className="mx-auto w-[220px]">
            <div title={`${file?.title?.length} / 50`}>
              <Input
                type="text"
                placeholder="Add image title"
                defaultValue={file?.title}
                className="my-2 bg-gray-200 text-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                onChange={handleTitle}
              />
            </div>
            <div
              className="flex min-h-[30px] max-w-[250px] flex-wrap items-center gap-1 border border-solid border-gray-300 bg-white p-2 text-xs font-light"
              title={`${file?.tags?.length} / 5`}
            >
              {file?.tags?.map((tag) => (
                <Badge key={tag}>
                  <span>{tag}</span>
                  <X
                    className="ml-2 grid h-4 w-4 cursor-pointer place-items-center rounded-full bg-gray-200 text-gray-700 transition-all hover:bg-gray-700 hover:text-gray-200"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
              <Input
                type="text"
                className="flex-[1] bg-gray-200 text-black focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                onKeyUp={handleTags}
              />
            </div>
            <label className="mx-auto my-2.5 flex cursor-pointer items-center gap-1">
              <input
                type="checkbox"
                checked={file?.public}
                className="mr-2 mt-1 h-4 w-4 cursor-pointer"
                onChange={handlePublic}
              />
              <span>Make photo public</span>
              <Lock className="ml-2 mt-1 text-gray-700" size={16} />
            </label>
          </div>
        )}
        <X
          className="absolute right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-gray-200 p-1 text-red-700 transition-all hover:bg-red-700 hover:text-gray-200"
          onClick={handleRemovedFile}
        />
        {setIsEdit ? (
          <Button
            variant="primary"
            disabled={loading || file?.status === "error"}
            onClick={handleUpdate}
            className="mb-2 ml-2"
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
});

export default UploadCard;
