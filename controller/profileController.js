import prisma from "../core/db.config.js";
import fs from "fs";
import { generateUuid, imageValidator } from "../utils/helper.js";
import { errors } from "@vinejs/vine";

class ProfileController {
  static async getUser(req, res) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          password: true,
        },
      });
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.json({
          status: 500,
          message: error.message,
        });
      }
    }
  }
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          message: "Profile image is required.",
        });
      }
      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile?.mimetype);
      if (message !== null) {
        return res.status(400).json({
          message: message,
        });
      }
      // ? If folder doesn't exist then make a new [directory]
      if (!fs.existsSync("./public/image")) {
        fs.mkdirSync("./public/image", { recursive: true });
      }
      const imageExtension = profile?.name.split(".");
      const defineImageName = `${generateUuid()}.${imageExtension[1]}`;
      const uploadPath = process.cwd() + "/public/image/" + defineImageName;

      profile?.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      //! upload to database
      await prisma.user.update({
        data: {
          profile: defineImageName,
        },
        where: {
          id: Number(id),
        },
      });

      res.json({ message: "Profile updated successfully." });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.json({
          status: 500,
          message: error.message,
        });
      }
    }
  }
  // TODO static async getAllUser(req, res) {}

  // TODO static async deleteUser(req, res) {}
}

export default ProfileController;
