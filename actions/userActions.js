"use server";

import {revalidatePath} from "next/cache";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import UserModel from "@/models/userModel";
import {destroyFromCloudinary, uploadToCloudinary} from "@/lib/cloudinary";
import getServerUser from "./getServerUser";

/* eslint-disable camelcase */
export async function registerUser({formData, name, email, password}) {
  try {
    const files = formData.getAll("files");
    if (!name || !email || !password || !files) {
      throw new Error("Please fill the fields.");
    }
    const user = await UserModel.findOne({email});
    if (user) {
      throw new Error("This email already registered, try another one.");
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const [res] = await uploadToCloudinary(files);
    const newUser = new UserModel({
      name: name?.toLowerCase(),
      email: email?.toLowerCase(),
      password: hashed_password,
      avatar: res?.secure_url,
      public_id: res?.public_id,
    });
    await newUser.save();
  } catch (error) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

export async function getUserById({myUser, id}) {
  try {
    if (myUser?._id === id) return {user: myUser};
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User does not exists.");
    const newUser = {
      ...user._doc,
      _id: user?._id.toString(),
      total_followers: user?.followers.length,
      total_followings: user?.followings.length,
      followers: [],
      followings: [],
      isFollowing: user?.followers.includes(myUser?._id),
      myUserId: myUser?._id,
    };
    return {user: newUser};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function updateUser({formData, name, user}) {
  try {
    const files = formData.getAll("files");
    if (!files.length) {
      await UserModel.findByIdAndUpdate(user?._id, {name});
    } else {
      const [res] = await uploadToCloudinary(files, user?._id);
      await Promise.all([
        UserModel.findByIdAndUpdate(user?._id, {
          name,
          avatar: res?.secure_url,
          public_id: res?.public_id,
        }),
        destroyFromCloudinary(user?.public_id),
      ]);
    }
    revalidatePath("/");
    return {message: "Update success."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function followUser({myUserId, _id, isFollowing}) {
  try {
    if (isFollowing) {
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, {
          $pull: {followings: _id},
        }),
        UserModel.findByIdAndUpdate(_id, {
          $pull: {followers: myUserId},
        }),
      ]);
    } else {
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, {
          $push: {followings: _id},
        }),
        UserModel.findByIdAndUpdate(_id, {
          $push: {followers: myUserId},
        }),
      ]);
    }
    return {message: "Follow success."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function generateUserMatch(query) {
  const page = query?.page;
  const next = query?.next;
  const id = query?.id;
  const paginated_id = {
    _id: next ? {$lt: new mongoose.Types.ObjectId(next)} : {$exists: true},
  };
  const paginated_updatedAt = {
    updatedAt: next ? {$lt: new Date(next)} : {$exists: true},
  };

  if (page === "following")
    return {followers: new mongoose.Types.ObjectId(id), ...paginated_updatedAt};

  if (page === "follower")
    return {
      followings: new mongoose.Types.ObjectId(id),
      ...paginated_updatedAt,
    };

  if (page === "users") return paginated_id;
}

export async function generateUsersPipeline({sort, limit, match, search}) {
  const user = await getServerUser();
  const userId = user ? new mongoose.Types.ObjectId(user?._id) : undefined;
  const base_pipeline = [
    {
      $sort: sort === "_id" ? {_id: -1} : {updatedAt: -1},
    },
    {
      $match: match,
    },
    {
      $limit: limit,
    },
    {
      $addFields: {
        isFollowing: {
          $cond: [{$in: [userId, "$followers"]}, true, false],
        },
        myUserId: userId,
      },
    },
    {
      $project: {
        followers: 0,
        followings: 0,
      },
    },
  ];
  const search_pipeline = [
    {
      $search: {
        index: "searchUser",
        text: {
          query: search,
          path: "name",
        },
      },
    },
  ];
  if (search) return [...search_pipeline, ...base_pipeline];
  return base_pipeline;
}

export async function generateUsersCountPipeline({match, search}) {
  const base_pipeline = [
    {
      $match: match,
    },
    {
      $count: "total",
    },
  ];
  const search_pipeline = [
    {
      $search: {
        index: "searchUser",
        text: {
          query: search,
          path: "name",
        },
      },
    },
  ];
  if (search) return [...search_pipeline, ...base_pipeline];
  return base_pipeline;
}

export async function generateNextCursor({sort, limit, data}) {
  if (sort === "updatedAt") {
    return new Date(data[limit - 1]?.updatedAt).getTime() || "stop";
  }
  return data[limit - 1]?._id || "stop";
}

export async function getUsers(query) {
  try {
    const limit = query?.limit * 1 || 5;
    const sort = query?.sort || "_id";
    const search = query?.search;
    const match = await generateUserMatch(query);
    const pipeline = await generateUsersPipeline({sort, limit, match, search});
    const users = JSON.parse(
      JSON.stringify(await UserModel.aggregate(pipeline))
    );
    const next_cursor = await generateNextCursor({sort, limit, data: users});
    return {data: users, next_cursor};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function getUsersCount(query) {
  try {
    const search = query?.search;
    const match = await generateUserMatch(query);
    const pipeline = await generateUsersCountPipeline({match, search});
    const [result] = JSON.parse(
      JSON.stringify(await UserModel.aggregate(pipeline))
    );
    return result?.total || 0;
  } catch (error) {
    return {resMessage: error.message};
  }
}
