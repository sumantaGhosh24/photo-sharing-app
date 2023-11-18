import Error from "./error";
import Gallery from "./gallery";
import {getAllPhotos} from "@/actions/photoAction";

const ProfileGallery = async ({id, page}) => {
  const sort = page === "favorite" ? "updatedAt" : "_id";
  const res = await getAllPhotos({id, sort, page});

  return (
    <>
      {res?.resMessage ? (
        <Error resMessage={res?.resMessage} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getAllPhotos}
          query={{id, sort, page}}
        />
      )}
    </>
  );
};

export default ProfileGallery;
