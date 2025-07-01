import { Router, Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { fileInspect } from "./handler";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  }
});

const router = Router();

// @ts-ignore
router.post("/inspect", upload.single("file"), fileInspect);

export default router;