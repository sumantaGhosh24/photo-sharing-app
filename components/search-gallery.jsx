import Error from "./error";
import Gallery from "./gallery";
import {getAllPhotos} from "@/actions/photoAction";

const SearchGallery = async ({page, search, id}) => {
  if (page !== "photos" && page !== "private") return null;

  const res = await getAllPhotos({page, search, id});

  return (
    <>
      {res?.resMessage ? (
        <Error resMessage={res.resMessage} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getAllPhotos}
          query={{page, search, id}}
        />
      )}
    </>
  );
};

export default SearchGallery;
