"use client";

import {useState} from "react";
import Image from "next/image";
import {redirect} from "next/navigation";
import {signOut} from "next-auth/react";
import {Heart, LogOut, Settings} from "lucide-react";

import Modal from "./modal";
import ProfileEdit from "./profile-edit";
import UserList from "./users-list";
import {Button} from "./ui/button";
import {useToast} from "./ui/use-toast";
import {formatNumber} from "@/lib/utils";
import {followUser} from "@/actions/userActions";

const ProfileInfo = ({user, id, res1, res2, getUsers}) => {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing);
  const [totalFollowers, setTotalFollowers] = useState(user?.total_followers);

  const page1 = "following";
  const page2 = "follower";
  const sort = "updatedAt";

  const {toast} = useToast();

  const handleFollow = async () => {
    if (!user?.myUserId) return redirect("/login");
    setIsFollowing((prev) => !prev);
    setTotalFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
    const res = await followUser({...user, isFollowing});
    if (res?.resMessage)
      toast({title: "Follow failed", description: res?.resMessage});
    if (res?.message)
      toast({title: "Follow success", description: res?.message});
  };

  return (
    <div className="my-5">
      <div className="mb-5 flex items-center">
        <div>
          <Image
            src={user?.avatar}
            alt={user?.name}
            width={100}
            height={100}
            sizes="50vw"
            priority
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
        <div className="ml-5">
          <h1 className="mb-2 font-bold capitalize">{user?.name}</h1>
          <h2 className="mb-2">{user?.email}</h2>
          <div>
            {user?.myUser ? (
              <>
                <Modal
                  title="Update Profile"
                  description="update your profile."
                  trigger={
                    <Button variant="primary">
                      <Settings />
                      <span className="ml-2">Update Profile</span>
                    </Button>
                  }
                >
                  <ProfileEdit user={user} />
                </Modal>
                <Button
                  variant="destructive"
                  onClick={signOut}
                  className="ml-3"
                >
                  <LogOut />
                  <span className="ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" onClick={handleFollow}>
                  <Heart
                    className={`${
                      isFollowing
                        ? "text-red-500"
                        : "text-white dark:text-black"
                    }`}
                  />
                  <span className="ml-2">
                    {isFollowing ? "Unfollow" : "Follow"}
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mb-5 flex">
        <Modal
          title={`Following ${formatNumber(user?.total_followings)}`}
          description="total followings."
          trigger={
            <div className="mr-2 cursor-pointer">
              <strong>{formatNumber(user?.total_followings)}</strong>
              <strong>Following</strong>
            </div>
          }
        >
          {res1?.data?.length === 0 ? (
            <p>You don&apos;t have any following yet.</p>
          ) : (
            <UserList
              data={res1?.data}
              next_cursor={res1?.next_cursor}
              fetchingData={getUsers}
              query={{id, page: page1, sort}}
            />
          )}
        </Modal>
        <Modal
          title={`Followers ${formatNumber(totalFollowers)}`}
          description="total followers."
          trigger={
            <div className="cursor-pointer">
              <strong>{formatNumber(totalFollowers)}</strong>
              <strong>Followers</strong>
            </div>
          }
        >
          {res2?.data?.length === 0 ? (
            <p>You don&apos;t have any follower yet.</p>
          ) : (
            <UserList
              data={res2?.data}
              next_cursor={res2?.next_cursor}
              fetchingData={getUsers}
              query={{id, page: page2, sort}}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProfileInfo;
