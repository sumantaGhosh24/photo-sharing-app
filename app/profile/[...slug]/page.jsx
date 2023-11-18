import Profile from "@/components/profile";
import ProfileMenu from "@/components/profile-menu";
import getServerUser from "@/actions/getServerUser";
import {getUsers} from "@/actions/userActions";

export default async function ProfilePage({params: {slug}}) {
  const id = slug[0];
  const page1 = "following";
  const page2 = "follower";
  const sort = "updatedAt";

  const myUser = await getServerUser();
  const res1 = await getUsers({id, page: page1, sort});
  const res2 = await getUsers({id, page: page2, sort});

  return (
    <div className="container mx-auto">
      <Profile
        myUser={myUser}
        id={id}
        res1={res1}
        res2={res2}
        getUsers={getUsers}
      />
      <ProfileMenu id={id} myUserId={myUser?._id} />
    </div>
  );
}
