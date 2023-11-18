import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Eye, FileDown, Heart, Pen, Trash2} from "lucide-react";

import UploadCard from "./upload-card";
import Modal from "./modal";
import PhotoDetail from "./photo-detail";
import NextPrev from "./next-prev";
import {Card, CardContent} from "./ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {useToast} from "./ui/use-toast";
import {handleDownloadImage} from "@/lib/utils";
import {deletePhoto, favoritePhoto} from "@/actions/photoAction";

const PhotoCard = ({
  photo,
  setPhotos,
  i,
  setPIndex,
  files,
  pIndex,
  next,
  handleLoadMore,
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const {toast} = useToast();

  if (isEdit) {
    return (
      <UploadCard
        file={photo}
        setFiles={setPhotos}
        id={i}
        setIsEdit={setIsEdit}
      />
    );
  }

  const handleFavoritePhoto = async () => {
    const newPhoto = {...photo, isFavorite: !photo?.isFavorite};
    setPhotos((photos) =>
      photos.map((item) => (item._id === newPhoto?._id ? newPhoto : item))
    );
    const res = await favoritePhoto(photo);
    if (res?.resMessage)
      toast({
        title: "Favorite photo failed!",
        description: res?.resMessage,
        variant: "destructive",
      });
    if (res?.message)
      toast({
        title: "Favorite photo success!",
        description: res?.message,
      });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you really want to delete this photo?")) {
      setPhotos((photo) => photo.filter((_i, id) => id !== i));
    }
    const res = await deletePhoto(photo);
    if (res?.resMessage)
      toast({
        title: "Something went wrong!",
        description: res?.resMessage,
        variant: "destructive",
      });
    if (res?.message)
      toast({
        title: "Delete success!",
        description: res?.message,
      });
  };

  return (
    <Card className="relative mx-auto mb-5 !max-h-fit overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={photo?.imgUrl}
          alt={photo?.title}
          width={250}
          height={250}
          sized="60vw"
          placeholder="blur"
          blurDataURL={photo?.blurHash}
          className="h-48 rounded transition-all hover:scale-110"
          priority
        />
        <div className="absolute right-0 top-0 p-2">
          {photo?.myUserId === photo?.user?._id ? (
            <>
              <button
                className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-destructive p-1.5 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={handleDelete}
              >
                <Trash2 />
              </button>
              <button
                className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-700 p-1.5 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-green-700/90 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => setIsEdit(true)}
              >
                <Pen />
              </button>
            </>
          ) : null}
          <button
            className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={handleFavoritePhoto}
          >
            <Heart
              className={`${
                photo?.isFavorite
                  ? "text-red-500"
                  : "text-white dark:text-black"
              }`}
            />
          </button>

          <Modal
            title="Photo"
            trigger={
              <button
                className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => setPIndex(i)}
              >
                <Eye className="text-primary-foreground" />
              </button>
            }
          >
            <PhotoDetail
              photo={files[pIndex]}
              setPhotos={setPhotos}
              type="modal_active"
            />
            <NextPrev
              setPIndex={setPIndex}
              currentIndex={pIndex}
              latestIndex={files.length - 1}
              next={next}
              handleLoadMore={handleLoadMore}
            />
          </Modal>
        </div>
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-between bg-secondary p-2 text-secondary-foreground">
          <Link
            href={`/profile/${photo?.user?._id}`}
            title={photo?.user?.name}
            className="flex items-center"
          >
            <Avatar className="mr-2">
              <AvatarImage src={photo?.user?.avatar} />
              <AvatarFallback>
                {(photo?.user?.name).substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold capitalize">{photo?.user?.name}</span>
          </Link>
          <button
            onClick={() => handleDownloadImage(photo)}
            className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary p-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <FileDown />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
