"use client";

import {experimental_useOptimistic as useOptimistic} from "react";
import Link from "next/link";
import Image from "next/image";
import {Calendar, FileDown, Heart, Share} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Badge} from "./ui/badge";
import {useToast} from "./ui/use-toast";
import {formatNumber, handleDownloadImage} from "@/lib/utils";
import {favoritePhoto} from "@/actions/photoAction";

const PhotoDetail = ({photo, setPhotos, type}) => {
  const [isFavorite, setIsFavorite] = useOptimistic(photo?.isFavorite);

  const {toast} = useToast();

  const handleFavoritePhoto = async () => {
    if (setPhotos) {
      const newPhoto = {...photo, isFavorite: !photo?.isFavorite};
      setPhotos((photos) =>
        photos.map((item) => (item._id === newPhoto?._id ? newPhoto : item))
      );
    } else {
      setIsFavorite((prev) => !prev);
    }
    const res = await favoritePhoto(photo);
    if (res?.resMessage)
      toast({
        title: "Favorite photo failed!",
        description: res?.resMessage,
      });
    if (res?.message)
      toast({title: "Favorite photo success!", description: res?.message});
  };

  return (
    <div className="mx-auto my-5 max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <Link
          href={`/profile/${photo?.user?._id}`}
          className="flex items-center"
        >
          <Avatar>
            <AvatarImage src={photo?.user?.avatar} />
            <AvatarFallback>
              {(photo?.user?.name).substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="ml-3 font-bold capitalize">{photo?.user?.name}</span>
        </Link>
        <div className="flex items-center">
          {type ? (
            <Link
              href={`/photo/${photo?._id}?s=${photo?.slug}`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <Share />
            </Link>
          ) : null}
          <button
            onClick={handleFavoritePhoto}
            className="mx-3 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <Heart className={`${isFavorite && "text-red-500"}`} />
          </button>
          <button
            onClick={() => handleDownloadImage(photo)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <FileDown />
          </button>
        </div>
      </div>
      <div className="mb-3">
        <div>
          <Image
            src={photo?.imgUrl}
            alt={photo?.title}
            width={300}
            height={300}
            sizes="70vw"
            placeholder="blur"
            blurDataURL={photo?.blurHash}
            className="mx-auto rounded"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xl font-bold">{photo?.title}</h3>
        <div className="mb-3 flex">
          <Heart />{" "}
          <span className="ml-3 font-bold">
            {formatNumber(photo?.total_favorite)}
          </span>
        </div>
        <div className="mb-3 flex">
          <Calendar />{" "}
          <span className="ml-3 font-bold">
            {new Date(photo?.createdAt).toDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          {photo?.tags?.map((tag) => (
            <Link key={tag} href={`/search/photos/${tag}`}>
              <Badge>{tag}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
