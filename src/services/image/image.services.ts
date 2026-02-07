// const image_api_url = process.env.IMAGE_GEN_API_URL;
// const promptchan_api_key = process.env.PROMPTCHAN_API_KEY;

const image_api_url = process.env.NOVITA_AI_URL;
const novita_ai_api_key = process.env.NOVITA_AI_API_KEY;

export const getImageApiUrl = async (details: object) => {
    if (!image_api_url) {
        throw new Error("NOVITA_AI_URL is not defined in environment variables");
    }

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
    return data.images[0];
}