import { uploadToR2 } from "../../utils/upload.util.js";
// const image_api_url = process.env.IMAGE_GEN_API_URL;
// const promptchan_api_key = process.env.PROMPTCHAN_API_KEY;
const image_api_url = process.env.NOVITA_AI_URL;
const novita_ai_api_key = process.env.NOVITA_AI_API_KEY;
export const getImageApiUrl = async (user_id, details) => {
    if (!image_api_url) {
        throw new Error("NOVITA_AI_URL is not defined in environment variables");
    }
    // Generate image using Novita AI
    const res = await fetch(image_api_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${novita_ai_api_key}`
        },
        body: JSON.stringify({
            ...details,
            "watermark": false
        })
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch image API URL: ${res.statusText}`);
    }
    const data = await res.json();
    const temporaryImageUrl = data.image_urls[0];
    // Download the image from the temporary URL
    const imageResponse = await fetch(temporaryImageUrl);
    if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image: ${imageResponse.statusText}`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const timestamp = Date.now();
    const fileName = `generated_${timestamp}.png`;
    // Upload to Cloudflare R2 for permanent storage
    const permanentUrl = await uploadToR2(user_id, imageBuffer, fileName, 'image/png', 'kisschat-pfp');
    if (!permanentUrl) {
        throw new Error('Failed to upload image to permanent storage');
    }
    return permanentUrl;
};
