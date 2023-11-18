"use client";

import {useState, useEffect} from "react";

import PhotoCard from "./photo-card";
import {Button} from "./ui/button";
import useInView from "@/hooks/useInView";

/* eslint-disable camelcase */
const Gallery = ({data, next_cursor, fetchingData, query}) => {
  const [files, setFiles] = useState(data);
  const [next, setNext] = useState(next_cursor);
  const [pIndex, setPIndex] = useState(false);
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
    return newData;
  };

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="container mx-auto">
      <div className="my-5 flex flex-wrap items-start">
        {files.map((file, i) => (
          <PhotoCard
            key={file._id}
            photo={file}
            setPhotos={setFiles}
            i={i}
            setPIndex={setPIndex}
            files={files}
            pIndex={pIndex}
            next={next}
            handleLoadMore={handleLoadMore}
          />
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

export default Gallery;
