
  import express from "express";
  import mongoose from "mongoose";
  import blogRouter from "./routes/blog-routes";
  import router from "./routes/user-routes";
  import cors from "cors";
  import multer from "multer";
  import * as blogController from "./controllers/blog-controller";
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();

  // Multer configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Set your desired upload directory
    },
    filename: function (req, file, cb) {
      // Append a timestamp to make the filename unique (optional)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${file.originalname}-${uniqueSuffix}`);
    },
  });

  const upload = multer({ storage: storage });

  // Serve static files from the 'uploads' directory
  app.use("/uploads", express.static("uploads"));

  app.use(cors());
  app.use(express.json());
  app.use("/api/user", router);
  app.use("/api/blog", blogRouter);
  app.get("/api/blog/user/:id", blogController.getByUserId);
  app.post("/api/blog/add", upload.array("files", 10), blogController.addBlog); // 10 is an example limit



  mongoose.set('strictQuery', false);

  mongoose

    .connect("mongodb+srv://trip:trip123@cluster0.bpp5pxa.mongodb.net/?retryWrites=true&w=majority")
    
    .then(() => {
      app.listen(5000, () => {
        console.log("Server is running on port 5000");
        console.log("Connecté à la base de données");
      });
    })
    .catch((err) => {
      console.error("Erreur de connexion à la base de données:", err);
      process.exit(1);
    });
