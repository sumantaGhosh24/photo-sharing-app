import Error from "@/components/error";
import PhotoDetail from "@/components/photo-detail";
import {getPhotoById} from "@/actions/photoAction";

export async function generateMetadata({params: {id}, searchParams: {s}}) {
  return {
    title: `${s}`,
    description: `${s} | Photo Sharing App`,
    alternates: {
      canonical: `/photo/${id}?s=${s}`,
      languages: {
        "en-US": `/en-US/photo/${id}?s=${s}`,
      },
    },
  };
}

export default async function PhotoPage({params: {id}}) {
  const res = await getPhotoById(id);

  return (
    <>
      {res?.resMessage ? (
        <Error resMessage={res.resMessage} />
      ) : (
        <PhotoDetail photo={res?.data} />
      )}
    </>
  );
}
