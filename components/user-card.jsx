"use client";

import React, {useState} from "react";
import Link from "next/link";
import {redirect} from "next/navigation";
import {signOut} from "next-auth/react";
import {Heart, LogOut} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Button} from "./ui/button";
import {useToast} from "./ui/use-toast";
import {followUser} from "@/actions/userActions";

// eslint-disable-next-line react/display-name
const UserCard = React.memo(({user}) => {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing);

  const {toast} = useToast();

  const handleFollow = async () => {
    if (!user?.myUserId) return redirect("/login");
    setIsFollowing((prev) => !prev);
    const res = await followUser({...user, isFollowing});
    if (res?.resMessage)
      toast({
        title: "Follow failed",
        description: res?.resMessage,
        variant: "destructive",
      });
    if (res?.message)
      toast({title: "Follow success", description: res?.message});
  };

  return (
    <div className="overflow-hidden rounded bg-secondary p-2">
      <div className="relative my-2 flex items-center ">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{(user?.name).substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="mx-3">
          <Link href={`/profile/${user?._id}`}>{user?.name}</Link>
          <h4>{user?.email}</h4>
        </div>
      </div>
      {user?._id === user?.myUserId ? (
        <Button variant="destructive" onClick={signOut} className="ml-3">
          <LogOut />
          <span className="ml-2">Logout</span>
        </Button>
      ) : (
        <Button variant="primary" onClick={handleFollow}>
          <Heart
            className={`${
              isFollowing ? "text-red-500" : "text-white dark:text-black"
            }`}
          />
          <span className="ml-2">{isFollowing ? "Unfollow" : "Follow"}</span>
        </Button>
      )}
    </div>
  );
});

export default UserCard;
