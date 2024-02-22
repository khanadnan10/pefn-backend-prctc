import vine from "@vinejs/vine";
import { JSONAPIErrorReporter } from "../core/customErrorReporter.js";

//* Error reporter for schema
vine.errorReporter = () => new JSONAPIErrorReporter();

export const registerSchema = vine.object({
  name: vine.string(),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(32),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});
