import axios from "axios";

export const transfer = async (walletAddress: string, token: string, amount: string, apiSecret: string) => {
  try {
    const response = await axios.post(
      "https://nixarcade-backend.vercel.app/transfer",
      { walletAddress, token, amount },
      {
        headers: {
          "x-api-secret": apiSecret, // Pass the API secret for verification
          "Content-Type": "application/json", // Set the content type explicitly
        },
      },
    );

    // Assuming the response contains the token in the response body
    return response.data.token;
  } catch (error: any) {
    console.error(
      "Error generating token:",
      error.response?.data || error.message,
    );
    return null; // Return null if the request fails
  }
};
