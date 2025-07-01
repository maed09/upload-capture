import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { fileService } from "./service";

// @ts-ignore
export const fileInspect = async (req: Request, res: Response, next: NextFunction)  => {
  try {
    if (!req.file) return res.status(StatusCodes.BAD_REQUEST).json({ error: "No PDF file uploaded" });

    const text = await fileService.parsePDF(req.file.buffer);
    const result= await fileService.inspect(text);

    return res.json({
      data: result
    });

  } catch (error) {
    next(error)
  }
};