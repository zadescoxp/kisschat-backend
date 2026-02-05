import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/r2.config.js";

export async function uploadToR2(
    user_id: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    bucket: string
) {
    const key = `${user_id}/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType
    });

    try {
        await r2Client.send(command);
        return `${process.env.R2_PUBLIC_URL}/${key}`;
    } catch (error) {
        console.error("R2 upload error:", error);
        return null;
    }
} 