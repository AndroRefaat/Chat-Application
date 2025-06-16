import joi from "joi";

export const signupSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required(),
}).required()


export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).required()


export const confirmOTP = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
}).required();

export const resendOTPSchema = joi.object({
    email: joi.string().email().required(),
}).required();

export const forgotPasswordSchema = joi.object({
    email: joi.string().email().required(),
}).required();

export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
}).required();

