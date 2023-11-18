"use client";

import {useEffect} from "react";

import {useToast} from "./ui/use-toast";

const Error = ({resMessage}) => {
  const {toast} = useToast();

  useEffect(() => {
    if (resMessage)
      toast({
        title: "Something went wrong!",
        description: resMessage,
        variant: "destructive",
      });
  }, [resMessage, toast]);

  return (
    <h1 className="mx-0 my-8 text-center uppercase text-red-700">
      {resMessage}
    </h1>
  );
};

export default Error;
