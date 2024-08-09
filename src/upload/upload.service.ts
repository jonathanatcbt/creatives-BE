import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { Express } from "express";
import { SocketGateway } from "src/socket/socket.gateway";
import { SocketService } from "src/socket/socket.service";

@Injectable()
export class UploadService {
  constructor() {}
  async uploadImage(file: Express.Multer.File, req: any): Promise<any> {
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Invalid file format. Only image files are allowed.");
    }

    const imageName = file.originalname;
    const uniqueFileName = `${uuidv4()}${path.extname(imageName)}`;
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      uniqueFileName
    );

    const readStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(imagePath);

    await new Promise<void>((resolve, reject) => {
      readStream.pipe(writeStream).on("finish", resolve).on("error", reject);
    });

    // Delete the temporary file
    fs.unlinkSync(file.path);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${uniqueFileName}`;

    return {
      status: true,
      imageUrl: imageUrl,
    };
  }
}
