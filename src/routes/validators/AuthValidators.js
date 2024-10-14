const { body } = require("express-validator");

// import { createValidator } from "./Base";
/* ----------------------- THIS IS FOR AUTH VALIDATION ---------------------- */

module.exports = {
  SigninValidator: [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field is required"),
    body("password")
      .notEmpty()
      .withMessage("password field is required with strong password"),
  ],

  SignupValidator: [
    // body('name').notEmpty().isString().withMessage("name field is required"),
    body("first_name")
      .notEmpty()
      .isString()
      .withMessage("last name field is required"),
    body("last_name")
      .notEmpty()
      .isString()
      .withMessage("last name field is required"),
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field is required"),
    // body('phone').notEmpty().isNumeric().withMessage("phone field is required"),
    // body('account_type').notEmpty().isString().withMessage("account type field is required"),
    body("password")
      .notEmpty()
      .withMessage("password field is required")
      .isLength({ max: 12, min: 6 })
      .withMessage("Password must be up to six chars long"),
    // body('school').if(body('account_type').equals('school')).isString().notEmpty()
  ],

  VerifyAccountValidator: [
    body("otp").notEmpty().withMessage("otp is required"),
    body("email").notEmpty().withMessage("email is required"),
  ],
  RegisterExternalStudentValidator: [
    body("public_key").notEmpty().withMessage("Public_key is required"),
    body("payload").notEmpty().withMessage("Payload is required"),
  ],

  SendOTPValidator: [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field required"),
  ],

  ChangePasswordValidator: [
    body("password").notEmpty().withMessage("password field is required"),
  ],

  LegacyResetPasswordValidator: [
    body("password").notEmpty().withMessage("password field is required"),
    body("new_password").notEmpty().withMessage("password field is required"),
    body("password_confirmation").notEmpty().withMessage("password field is required"),
  ],
  EmailValidator: [
    body("password").notEmpty().withMessage("password field is required"),
  ],

  SchoolSetupValidator: [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field required"),
    body("school_types")
      .if(body("naming_types").not().equals("C"))
      .isArray()
      .withMessage("School types must be an array.")
      .custom((value) => {
        if (value.length === 0) {
          throw new Error("At least one school type must be selected.");
        }
        if (!value.every((element) => typeof element === "string")) {
          throw new Error("School type must be a string.");
        }
        return true;
      }),
    body("naming_types")
      .notEmpty()
      .notEmpty()
      .withMessage("Naming types is required.")
      .isString()
      .withMessage("Naming types must be a string."),
  ],

  ResetPasswordValidator: [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field required"),
  ],

  VerifyResetPasswordValidator: [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("email field required"),
    body("code")
      .isLength({ max: 6 })
      .notEmpty()
      .withMessage("code field with is required"),
    body("password").notEmpty().withMessage("password field is required"),
  ],
};
