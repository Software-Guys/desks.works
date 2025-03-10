// import mongoose from 'mongoose';

// export interface IUser extends mongoose.Document {
//   email: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
//   lastLogin?: Date;
//   isVerified: boolean;
//   resetPasswordToken?: string;
//   resetPasswordExpires?: Date;
// }

// const UserSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     lastLogin: {
//       type: Date,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false, // Initially false until email is verified
//     },
//     resetPasswordToken: {
//       type: String,
//     },
//     resetPasswordExpires: {
//       type: Date,
//     },
//   },
//   { timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);





import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    lastLogin: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);