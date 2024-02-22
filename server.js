import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import router from "./routes/authRoute.js";
import fileUpload from "express-fileupload";
import listEndpoints from "express-list-endpoints";
const app = express();
const PORT = process.env.PORT || 3000;

// * Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// * Server initiates - listing all request and methods
app.get("/", (req, res) => {
  res.send(listEndpoints(app._router).map((el) => el));
});

// * Authentication routes
app.use("/api", router);
app.get("*", (req, res) => {
  res.json({ error: "Tera ghar jayenga." });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
