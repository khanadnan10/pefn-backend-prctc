import { v4 as uuid } from "uuid";
import { supportedMimes } from "../config/fileType.js";

//! Validate image comes under the condition or not

export const imageValidator = (size, mimetype) => {
  if (bytesToMb(size) > 2) {
    return "Image size must be less than 2 MB.";
  } else if (!supportedMimes.includes(mimetype)) {
    return "Image must of the format png/jpg/jpeg/webp/svg only.";
  }
  return null;
};

//! bytes to mb conver
export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

// ! generate Random UUID

export const generateUuid = () => {
  return uuid();
};
