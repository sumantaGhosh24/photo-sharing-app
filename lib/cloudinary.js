import path from "path";
import fs from "fs/promises";
import os from "os";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* eslint-disable camelcase */
export async function savePhotosToLocal(files) {
  const multipleBuffersPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = crypto.randomUUID();
      const ext = file.type.split("/")[1];
      const tempDir = os.tmpdir();
      const uploadDir = path.join(tempDir, `/${name}.${ext}`);
      fs.writeFile(uploadDir, buffer);
      return {filepath: uploadDir};
    })
  );
  return await Promise.all(multipleBuffersPromise);
}

export async function uploadToCloudinary(files, userId) {
  const newFiles = await savePhotosToLocal(files);
  const multiplePhotosPromise = newFiles.map((file) =>
    cloudinary.v2.uploader.upload(file.filepath, {
      folder: "photo_sharing_app",
    })
  );
  const results = await Promise.all(multiplePhotosPromise);
  newFiles.map((file) => fs.unlink(file.filepath));
  return results;
}

export async function destroyFromCloudinary(public_id) {
  if (public_id) return await cloudinary.v2.uploader.destroy(public_id);
}
