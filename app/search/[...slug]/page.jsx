import SearchMenu from "@/components/search-menu";
import getServerUser from "@/actions/getServerUser";

export default async function SearchPage({params: {slug}}) {
  const search = decodeURI(slug[0]);

  const myUser = await getServerUser();

  return (
    <div className="container mx-auto my-5">
      <h1 className="mb-5 text-center text-xl font-bold">
        Result for <span className="text-blue-700">{search}</span>
      </h1>
      <SearchMenu search={search} id={myUser?._id} />
    </div>
  );
}
