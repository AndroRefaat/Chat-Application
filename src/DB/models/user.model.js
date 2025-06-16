import mongoose, { model, Schema } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const rounds = Number(process.env.ROUNDS) || 10;
        this.password = await hash({ plainText: this.password, round: rounds });
        next();
    } catch (error) {
        next(error);
    }
});

const User = model('User', userSchema);

export default User;