import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";

import connectDB from "@/lib/database";
import UserModel from "@/models/userModel";

connectDB();

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        const {email, password} = credentials;
        if (!email || !password) {
          return null;
        }
        const user = await UserModel.findOne({email});
        if (!user) return null;
        const match = await compare(password, user.password);
        if (!match) return null;
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({token}) {
      const user = await getUserByEmail({email: token.email});
      token.user = user;
      return token;
    },
    async session({session, token}) {
      session.user = token.user;
      return session;
    },
  },
};

async function getUserByEmail({email}) {
  const user = await UserModel.findOne({email});
  if (!user) throw new Error("Email does not exists.");
  const newUser = {
    ...user._doc,
    _id: user._id.toString(),
    total_followers: user.followers.length,
    total_followings: user.followings.length,
    followers: [],
    followings: [],
    myUser: true,
  };
  return newUser;
}
