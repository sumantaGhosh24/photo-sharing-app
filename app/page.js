import HeroBanner from "@/components/hero-banner";
import Error from "@/components/error";
import Gallery from "@/components/gallery";
import {getAllPhotos} from "@/actions/photoAction";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  const res = await getAllPhotos({page: "home"});

  return (
    <div className="container mx-auto">
      <HeroBanner />
      {res?.resMessage ? (
        <Error resMessage={res.resMessage} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getAllPhotos}
          query={{page: "home"}}
        />
      )}
    </div>
  );
}
