import { checkSchema } from "express-validator";

export default checkSchema({
  password: {
    errorMessage: "password is required",
    notEmpty: true,
    trim: true,
  },
  email: {
    errorMessage: "Email is Required",
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "email is invalid",
    },
  },
});

// export default [body("email").isEmail().withMessage("email is required")];
