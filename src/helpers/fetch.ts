import axios from "axios";

const getAccessToken = async () => {
  const clientId = process.env.CLIENT_ID || "";
  const clientSecret = process.env.CLIENT_SECRET || "";

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.QURAN_OAUTH_URL}`,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials&scope=content",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
  }
};

export const fetchQuranAPi = async (method: string, path: string) => {
  try {
    const token = await getAccessToken();

    const response = await axios({
      method,
      url: `${process.env.QURAN_API_URL}/content/api/v4${path}`,
      headers: {
        "x-auth-token": token,
        "x-client-id": process.env.CLIENT_ID,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching the api:", error);
  }
};
