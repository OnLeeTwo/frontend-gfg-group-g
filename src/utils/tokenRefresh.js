import axios from "axios";

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      {
        refresh_token: refreshToken,
      }
    );

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
