import { checkSchema } from "express-validator";

export default checkSchema({
  firstName: { errorMessage: "name is required", notEmpty: true },
  lastName: { errorMessage: "name is required", notEmpty: true },
  password: {
    errorMessage: "password is required",
    notEmpty: true,
    trim: true,
    isLength: { options: { min: 8 } },
  },
  email: {
    errorMessage: "email is required",
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
});

// export default [body("email").isEmail().withMessage("email is required")];
