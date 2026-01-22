const image_api_url = process.env.IMAGE_GEN_API_URL;
const promptchan_api_key = process.env.PROMPTCHAN_API_KEY;
export const getImageApiUrl = async (details) => {
    if (!image_api_url) {
        throw new Error("IMAGE_GEN_API_URL is not defined in environment variables");
    }
    const res = await fetch(image_api_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": promptchan_api_key || '',
        },
        body: JSON.stringify({
            ...details
        })
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch image API URL: ${res.statusText}`);
    }
    const data = await res.json();
    return data.image;
};
