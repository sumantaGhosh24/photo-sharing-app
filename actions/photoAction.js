/* eslint-disable camelcase */
"use server";

import {revalidatePath} from "next/cache";
import mongoose from "mongoose";

import {destroyFromCloudinary, uploadToCloudinary} from "@/lib/cloudinary";
import {dynamicBlurDataUrl, slugify} from "@/lib/utils";
import PhotoModel from "@/models/photoModel";
import getServerUser from "./getServerUser";

export async function uploadPhotos(formData, filesUpload) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");
    const files = formData.getAll("files");
    const photos = await uploadToCloudinary(files, user?._id);
    const blurDataPromise = photos.map((photo) =>
      dynamicBlurDataUrl(photo.secure_url)
    );
    const blurData = await Promise.all(blurDataPromise);
    const newPhotos = photos.map((photo, i) => ({
      user: user?._id,
      public_id: photo.public_id,
      imgUrl: photo.secure_url,
      title: filesUpload[i].title,
      tags: filesUpload[i].tags,
      slug: slugify(filesUpload[i].title),
      imgName: `${slugify(filesUpload[i].title)}.${photo.format}`,
      public: filesUpload[i].public,
      blurHash: blurData[i],
    }));
    await PhotoModel.insertMany(newPhotos);
    revalidatePath("/");
    return {message: "Upload success."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function generatePhotosMatch(query) {
  const page = query?.page;
  const next = query?.next;
  const id = query?.id;

  const paginated_id = {
    _id: next ? {$lt: new mongoose.Types.ObjectId(next)} : {$exists: true},
  };
  const paginated_updatedAt = {
    updatedAt: next ? {$lt: new Date(next)} : {$exists: true},
  };

  if (page === "public")
    return {
      public: true,
      user: new mongoose.Types.ObjectId(id),
      ...paginated_id,
    };

  if (page === "private")
    return {
      public: false,
      user: new mongoose.Types.ObjectId(id),
      ...paginated_id,
    };

  if (page === "favorite")
    return {
      favorite_users: new mongoose.Types.ObjectId(id),
      ...paginated_updatedAt,
    };

  if (page === "home" || page === "photos")
    return {public: true, ...paginated_id};
}

export async function generatePhotosPipeline({sort, limit, match, search}) {
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
      $lookup: {
        from: "users",
        let: {user_id: "$user"},
        pipeline: [
          {$match: {$expr: {$eq: ["$_id", "$$user_id"]}}},
          {$project: {name: 1, avatar: 1}},
        ],
        as: "user",
      },
    },
    {$unwind: "$user"},
    {
      $addFields: {
        isFavorite: {
          $cond: [{$in: [userId, "$favorite_users"]}, true, false],
        },
        total_favorite: {$size: "$favorite_users"},
        myUserId: userId,
      },
    },
    {
      $project: {
        favorite_users: 0,
      },
    },
  ];
  const search_pipeline = [
    {
      $search: {
        index: "searchPhotos",
        text: {
          query: search,
          path: ["title", "tags"],
        },
      },
    },
  ];
  if (search) return [...search_pipeline, ...base_pipeline];
  return base_pipeline;
}

export async function generatePhotosCountPipeline({match, search}) {
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
        index: "searchPhotos",
        text: {
          query: search,
          path: ["title", "tags"],
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

export async function getAllPhotos(query) {
  try {
    const limit = query?.limit * 1 || 5;
    const sort = query?.sort || "_id";
    const search = query?.search;
    const match = await generatePhotosMatch(query);
    const pipeline = await generatePhotosPipeline({sort, limit, match, search});
    const photos = JSON.parse(
      JSON.stringify(await PhotoModel.aggregate(pipeline))
    );
    const next_cursor = await generateNextCursor({sort, limit, data: photos});
    return {data: photos, next_cursor};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function getPhotosCount(query) {
  try {
    const search = query?.search;
    const match = await generatePhotosMatch(query);
    const pipeline = await generatePhotosCountPipeline({match, search});
    const [result] = JSON.parse(
      JSON.stringify(await PhotoModel.aggregate(pipeline))
    );
    return result?.total || 0;
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function favoritePhoto({myUserId, _id, isFavorite}) {
  try {
    if (isFavorite) {
      await PhotoModel.findByIdAndUpdate(_id, {
        $pull: {favorite_users: myUserId},
      });
    } else {
      await PhotoModel.findByIdAndUpdate(_id, {
        $push: {favorite_users: myUserId},
      });
    }
    revalidatePath("/");
    return {message: "Favorite photo updated."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function updatePhoto(photo) {
  try {
    await PhotoModel.findByIdAndUpdate(photo?._id, {
      title: photo?.title,
      tags: photo?.tags,
      public: photo?.public,
    });
    revalidatePath("/");
    return {message: "Photo updated."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function deletePhoto({_id, public_id}) {
  try {
    await Promise.all([
      PhotoModel.findByIdAndDelete(_id),
      destroyFromCloudinary(public_id),
    ]);
    revalidatePath("/");
    return {message: "Photo deleted."};
  } catch (error) {
    return {resMessage: error.message};
  }
}

export async function getPhotoById(id) {
  try {
    const [myUser, photo] = await Promise.all([
      getServerUser(),
      PhotoModel.findById(id).populate("user", "name avatar"),
    ]);
    if (!photo) throw new Error("Photo not found.");
    const newPhoto = {
      ...photo._doc,
      isFavorite: photo.favorite_users.includes(myUser?._id),
      total_favorite: photo.favorite_users.length,
      favorite_users: [],
      myUserId: myUser?._id,
    };
    return {data: JSON.parse(JSON.stringify(newPhoto))};
  } catch (error) {
    return {resMessage: error.message};
  }
}
