"use client";

import React, {useRef} from "react";
import Image from "next/image";

import {validFiles} from "@/lib/utils";

/* eslint-disable array-callback-return */
// eslint-disable-next-line react/display-name
const UploadForm = React.memo(({setFiles}) => {
  const formRef = useRef();

  const handleImageChange = (files) => {
    if (!files.length) return;
    [...files].map((file) => {
      const result = validFiles(file);
      setFiles((prev) => [...prev, result]);
    });
    formRef.current.reset();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleImageChange(data.files);
  };

  return (
    <form
      className="mb-5 mt-9 flex w-full items-center justify-center rounded border-4 border-dashed border-blue-700 p-8 text-center"
      ref={formRef}
      onDrop={handleDrop}
      onDrag={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="upload"
        accept=".png, .jpg, .jpeg"
        multiple
        hidden
        onChange={(e) => handleImageChange(e.target.files)}
      />
      <label
        htmlFor="upload"
        className="flex max-w-lg cursor-pointer flex-col items-center justify-center"
      >
        <Image
          src="https://placehold.co/600x400.png"
          alt="add"
          width={250}
          height={60}
          sizes="25vw"
          style={{width: 256, height: 116}}
        />
        <h5 className="mx-0 my-2.5 text-2xl font-semibold">
          Drag & drop up to 5 images or
          <span className="mx-1.5 text-blue-700">browse</span> to choose a file
        </h5>
        <small className="text-sm text-gray-700">
          JPEG, PNG only - Max 1MB
        </small>
      </label>
    </form>
  );
});

export default UploadForm;
