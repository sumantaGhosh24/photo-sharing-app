import {Schema, model, models} from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    public_id: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {timestamps: true}
);

const UserModel = models?.users || model("users", userSchema);

export default UserModel;
