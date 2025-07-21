import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitedPark {
  parkId: string;
  parkName: string;
  imageUrl: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  visitedParks: IVisitedPark[];
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  visitedParks: [
    {
      parkId: { type: String },
      parkName: { type: String },
      imageUrl: { type: String },
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;




// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, "Please provide a username"],
//         unique: true,
//     },
//     email: {
//         type: String,
//         required: [true, "Please provide an email"],
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: [true, "Please provide a password"],
//     },
//     visitedParks: [
//         {
//             parkId: String,
//             parkName: String,
//             imageUrl: String,
//         }
//     ],
//     isVerified: {
//         type: Boolean,
//         default: false,
//     },
// });

// const User = mongoose.models.users || mongoose.model("users", userSchema);

// export default User;