"use client";

import {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

const NextPrev = ({
  setPIndex,
  currentIndex,
  latestIndex,
  next,
  handleLoadMore,
}) => {
  const [loading, setLoading] = useState(false);

  const handleNextPhoto = async () => {
    if (currentIndex + 1 <= latestIndex) {
      setPIndex((prev) => prev + 1);
    } else if (next !== "stop") {
      setLoading(true);
      const photos = await handleLoadMore();
      setLoading(false);
      if (currentIndex < photos?.length - 1) {
        setPIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setPIndex((prev) => Math.max(0, prev - 1))}
        style={{display: currentIndex <= 0 ? "none" : "block"}}
        className="absolute left-2 top-1/2 rounded-full bg-primary p-1 text-primary-foreground transition hover:bg-secondary hover:text-secondary-foreground"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={handleNextPhoto}
        disabled={loading}
        style={{
          display:
            currentIndex !== latestIndex && next === "stop" ? "block" : "none",
        }}
        className="absolute right-2 top-1/2 rounded-full bg-primary p-1 text-primary-foreground transition hover:bg-secondary hover:text-secondary-foreground"
      >
        <ChevronRight />
      </button>
    </>
  );
};

export default NextPrev;
