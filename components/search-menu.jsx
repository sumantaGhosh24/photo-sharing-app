import SearchGallery from "./search-gallery";
import SearchUser from "./search-user";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {formatNumber} from "@/lib/utils";
import {getPhotosCount} from "@/actions/photoAction";
import {getUsersCount} from "@/actions/userActions";

/* eslint-disable camelcase */
const SearchMenu = async ({search, id}) => {
  const [photos_count, users_count, pri_count] = await Promise.all([
    getPhotosCount({page: "photos", search}),
    getUsersCount({page: "users", search}),
    id ? getPhotosCount({page: "private", search, id}) : 0,
  ]);

  return (
    <div>
      <Tabs defaultValue="photos" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="photos">
            Photos {formatNumber(photos_count)}
          </TabsTrigger>
          <TabsTrigger value="users">
            Users {formatNumber(users_count)}
          </TabsTrigger>
          <TabsTrigger value="private">
            Private {formatNumber(pri_count)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos">
          <SearchGallery id={id} page="photos" search={search} />
        </TabsContent>
        <TabsContent value="users">
          <SearchUser page="users" search={search} />
        </TabsContent>
        <TabsContent value="private">
          <SearchGallery id={id} page="private" search={search} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchMenu;
