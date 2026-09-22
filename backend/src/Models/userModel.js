import mongoose from "mongoose";
import validator from "validator";
import crypto from "node:crypto"
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, "Please tell us your name!"],
    trim: true,
    maxlength: [40, "A user name must have less or equal than 40 characters"],
  },
  email: {  
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "A password must have at least 8 characters"],
    select: false,
},
passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
    validator: function (el) {
        return el === this.password;
    },
    message:"Password are not the same !"
}  
},
phoneNumber: {
    type: String,
    required: [true, "Please provide your phone number"],
    unique: true,
    trim: true,
},
role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
},
avatar: {
    url: {
        type: String,
        default: "user"
    },
},
passwordChangedAt:{
    type: Date,

},
passwordResetToken:{ 
    type: String ,
    select: false,
    index: true,
},
passwordResetExpires:{ 
    type: Date,
    select: false,
 },
},
{timestamps: true}

)
 userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;


  }
 })
 userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  
})
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  } 
  return false;
}
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
} 
const User = mongoose.model("User", userSchema);
export {User};