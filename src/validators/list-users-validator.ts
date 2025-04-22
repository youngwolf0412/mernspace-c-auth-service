import { checkSchema } from "express-validator";

export default checkSchema(
  {
    q: {
      trim: true,
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : "";
        },
      },
    },
    role: {
      customSanitizer: {
        options: (value: unknown) => {
          return value ? value : "";
        },
      },
    },
    currentPage: {
      customSanitizer: {
        options: (value) => {
          // 2, '2', undefined, 'sdlkfkjds' -> NaN
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 1 : parsedValue;
        },
      },
    },
    perPage: {
      customSanitizer: {
        options: (value) => {
          // 2, '2', undefined, 'sdlkfkjds' -> NaN
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue) ? 2 : parsedValue;
        },
      },
    },
  },
  // ye array batata hai ki ye query ke liye hai
  ["query"],
);
