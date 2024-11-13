import axios from "axios";

export const transfer = async (walletAddress: string, amount: number, apiSecret: string) => {
    try {
        const token = process.env.SECRET;

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
  
      return true;
    } catch (error: any) {
      console.error(
        "Error generating token:",
        error.response?.data || error.message,
      );
      return false;
    }
  };