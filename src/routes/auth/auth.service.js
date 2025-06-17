import User from "../../DB/models/user.model.js";
import { generateToken } from '../../utils/token/token.js'
import { compare, hash } from "../../utils/hashing/hash.js";
import { OTPS } from "../../utils/enums/allEnums.js";
import OTP from "../../DB/models/otp.model.js";
import Randomstring from "randomstring";
import { eventEmitter } from './../../utils/emails/emailEvent.js';
import { subjects } from "../../utils/enums/allEnums.js";

export const signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const otpCode = Randomstring.generate({ length: 6, charset: "numeric" });
    const hashOTP = hash({ plainText: otpCode });
    await OTP.create({ email, otps: [{ code: hashOTP, type: OTPS.confrimEmail }] })


    const user = await User.create({ username, email, password });

    res.status(201).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
    eventEmitter.emit('sendEmail', email, otpCode, subjects.register)

}



export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });



    const passwordMatch = await compare({ plainText: password, hash: user.password });
    if (!passwordMatch) return res.status(400).json({ message: "Invalid password" });


    res.status(200).json({
        sucess: true, message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        accessToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        }),
        refreshToken: generateToken({
            payload: { id: user._id },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE
            }
        }),
    });
}




export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otps.length === 0) {
        return res.status(400).json({ message: "OTP not found" });
    }


    const currentOTP = otpRecord.otps[0];
    if (!currentOTP || !currentOTP.code) {
        return res.status(400).json({ message: "Invalid OTP record" });
    }

    const isMatch = await compare({ plainText: otp, hash: currentOTP.code });
    if (!isMatch) {
        return res.status(401).json({
            message: "Invalid OTP",
            details: "The OTP you entered is incorrect. Please try again or request a new OTP."
        });
    }

    user.isConfirmed = true;
    await user.save();

    await OTP.deleteOne({ email });

    res.status(200).json({ success: true, message: "Email confirmed successfully" });
}

export const resendOTP = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isConfirmed) {
        return res.status(400).json({ message: "Email is already confirmed" });
    }


    const otpCode = Randomstring.generate({ length: 6, charset: "numeric" });
    const hashOTP = hash({ plainText: otpCode });


    await OTP.deleteOne({ email });

    await OTP.create({
        email,
        otps: [{ code: hashOTP, type: OTPS.confrimEmail }]
    });


    eventEmitter.emit('sendEmail', email, otpCode, subjects.register);

    res.status(200).json({
        success: true,
        message: "New OTP sent to your email"
    });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpCode = Randomstring.generate({ length: 6, charset: "numeric" });
    const hashOTP = hash({ plainText: otpCode });


    await OTP.deleteOne({ email });


    await OTP.create({
        email,
        otps: [{ code: hashOTP, type: OTPS.resetPassword }]
    });

    eventEmitter.emit('sendEmail', email, otpCode, subjects.resetPassword);

    res.status(200).json({
        success: true,
        message: "OTP sent to your email"
    });
}

export const verifyResetOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord || otpRecord.otps.length === 0) {
        return res.status(400).json({ message: "OTP not found" });
    }

    const isMatch = await compare({ plainText: otp, hash: otpRecord.otps[0].code });
    if (!isMatch) return res.status(401).json({ message: "Invalid OTP" });


    user.password = newPassword;
    await user.save();


    await OTP.deleteOne({ email });

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
}





