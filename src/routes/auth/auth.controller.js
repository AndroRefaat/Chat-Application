import { Router } from "express";
import * as authService from './auth.service.js'
import * as authValidation from './auth.validation.js'
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utils/errorHandeling/asyncHandler.js"

const router = Router();

router.post('/signup', validation(authValidation.signupSchema), asyncHandler(authService.signup))

router.post('/login', validation(authValidation.loginSchema), asyncHandler(authService.login))

router.post('/verify-otp', validation(authValidation.confirmOTP), asyncHandler(authService.verifyOTP))

router.post('/resend-otp', validation(authValidation.resendOTPSchema), asyncHandler(authService.resendOTP))

router.post('/forgot-password', validation(authValidation.forgotPasswordSchema), asyncHandler(authService.forgotPassword));

router.post('/reset-password', validation(authValidation.resetPasswordSchema), asyncHandler(authService.verifyResetOTP));
export default router;