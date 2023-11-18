"use server";

import Error from "./error";
import ProfileInfo from "./profile-info";
import {getUserById} from "@/actions/userActions";

const Profile = async ({myUser, id, res1, res2, getUsers}) => {
  const res = await getUserById({myUser, id});

  return (
    <>
      {res?.resMessage ? (
        <Error resMessage={res.resMessage} />
      ) : (
        <ProfileInfo
          user={res?.user}
          id={id}
          res1={res1}
          res2={res2}
          getUsers={getUsers}
        />
      )}
    </>
  );
};

export default Profile;
