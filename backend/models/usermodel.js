const mongoose = require("mongoose"); //import mongoose
const bcrypt = require("bcrypt");


 //user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

//before saving to database it will run first
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.signin = async function (email,password) {
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
};

module.exports = mongoose.model("Users", userSchema);