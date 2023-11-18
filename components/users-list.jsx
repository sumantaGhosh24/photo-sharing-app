"use client";

import {useState, useEffect} from "react";

import UserCard from "./user-card";
import {Button} from "./ui/button";
import useInView from "@/hooks/useInView";

/* eslint-disable camelcase */
const UserList = ({data, next_cursor, fetchingData, query}) => {
  const [files, setFiles] = useState(data);
  const [next, setNext] = useState(next_cursor);
  const [loading, setLoading] = useState(false);

  const {ref, inView} = useInView();

  const handleLoadMore = async () => {
    if (next === "stop" || loading) return;
    setLoading(true);
    const res = await fetchingData({next, ...query});
    setLoading(false);
    const newData = [...files, ...res?.data];
    setFiles(newData);
    setNext(res?.next_cursor);
  };

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="">
      <div className="my-5 flex flex-wrap gap-3">
        {files?.map((file) => (
          <UserCard key={file._id} user={file} />
        ))}
      </div>
      <Button
        variant="primary"
        className="mx-auto"
        disabled={loading}
        onClick={handleLoadMore}
        style={{display: next && next !== "stop" ? "block" : "none"}}
        ref={ref}
      >
        {loading ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
};

export default UserList;
