import vine, { errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "./../validator/authValidator.js";
import bcrypt from "bcryptjs";
import prisma from "../core/db.config.js";
import jwt from "jsonwebtoken";
class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      // TODO checking for unique email
      const findUser = await prisma.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return res.status(401).json({ error: "User already exist" });
      }

      // ! Encrypting password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      //* Uploading it to database
      const user = await prisma.user.create({
        data: payload,
      });
      res.status(200).json({ user });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong.Please try again.",
        });
      }
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;
      const validate = vine.compile(loginSchema);
      const payload = await validate.validate(body);
      const findUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (findUser) {
        if (!bcrypt.compareSync(payload.password, findUser.password)) {
          return res.status(400).json({
            error: `Invalid credentials.`,
          });
        }

        //* Issue a token for validation/session

        const payloadData = {
          id: findUser.id,
          email: findUser.email,
          password: body.password,
        };
        const token = jwt.sign(payloadData, process.env.SECRET_KEY, {
          expiresIn: "30d",
        });

        return res.status(200).json({ access_token: `Bearer ${token}` });
      }
      return res.status(401).json({
        error: `No user found with this email ${findUser.email}. Try again.`,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: error.message,
        });
      }
    }
  }
}

export default AuthController;
