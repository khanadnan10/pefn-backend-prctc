import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validator/newsValidator.js";
import { generateUuid, imageValidator } from "../utils/helper.js";
import prisma from "../core/db.config.js";
import fs from "fs";

class NewsController {
  static async getNews(req, res) {
    try {
      const news = await prisma.news.findMany({});
      return res.json(news);
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.json(400).json({
          error: error.message,
        });
      } else {
        return res.status(500).json({
          error: error.message,
        });
      }
    }
  }

  static async postNews(req, res) {
    try {
      // receive body from the user
      const body = req.body;
      // Validate the schema of news
      const validate = vine.compile(newsSchema);
      const payload = await validate.validate(body);
      // Validate image and image size
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          error: "Image is required.",
        });
      }
      const image = req.files.image;
      // validate image for the size and mimetype
      const validateImage = imageValidator(image?.size, image?.mimetype);
      if (validateImage !== null) {
        return res.status(400).json({
          error: validateImage,
        });
      }
      // ! If folder doesn't exist then make a new [directory]
      if (!fs.existsSync("./public/image")) {
        fs.mkdirSync("./public/image", { recursive: true });
      }
      // provide the images with a unique name
      // 1. seperate with the extension
      const imageExtension = image?.name.split(".");
      console.log(imageExtension);
      // 2. append the uuid to the image and with the extension
      const convertedImage = `${generateUuid()}.${imageExtension[1]}`;
      // 3. save it to the [dir] and [database]
      const uploadPath = process.cwd() + "/public/image/" + convertedImage;
      image?.mv(uploadPath, (err) => {
        if (err) throw err;
      });
      const news = await prisma.news.create({
        data: {
          title: payload.title,
          content: payload.content,
          image: convertedImage,
          user_id: req.user.id,
        },
      });
      // providing the response to the user with the actual data
      return res.status(200).json({
        message: "News created successfully",
        news,
      });
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
}

export default NewsController;
