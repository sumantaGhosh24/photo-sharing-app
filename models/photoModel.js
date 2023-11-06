import {Schema, model, models} from "mongoose";

const photoSchema = new Schema(
  {
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    public_id: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    blurHash: {
      type: String,
    },
    tags: [],
    public: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    favorite_users: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {timestamps: true}
);

const PhotoModel = models.photos || model("photos", photoSchema);

export default PhotoModel;
