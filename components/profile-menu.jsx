import ProfileGallery from "./profile-gallery";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {formatNumber} from "@/lib/utils";
import {getPhotosCount} from "@/actions/photoAction";

/* eslint-disable camelcase */
const ProfileMenu = async ({id, myUserId}) => {
  const [pub_count, pri_count, fav_count] = await Promise.all([
    getPhotosCount({id, page: "public"}),
    getPhotosCount({id, page: "private"}),
    getPhotosCount({id, page: "favorite"}),
  ]);

  return (
    <div>
      <Tabs defaultValue="public" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="public">
            Public {formatNumber(pub_count)}
          </TabsTrigger>
          {id === myUserId && (
            <>
              <TabsTrigger value="private">
                Private {formatNumber(pri_count)}
              </TabsTrigger>
              <TabsTrigger value="favorite">
                Favorite {formatNumber(fav_count)}
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="public">
          <ProfileGallery id={id} page="public" />
        </TabsContent>
        {id === myUserId && (
          <>
            <TabsContent value="private">
              <ProfileGallery id={id} page="private" />
            </TabsContent>
            <TabsContent value="favorite">
              <ProfileGallery id={id} page="favorite" />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ProfileMenu;
