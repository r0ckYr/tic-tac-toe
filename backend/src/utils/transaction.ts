import axios from "axios";

export const transfer = async (walletAddress: string, amount: number, apiSecret: string) => {
    try {
        const token = process.env.SECRET;

      const response = await axios.post(
        "https://nixarcade-backend.vercel.app/transfer",
        { walletAddress, token, amount },
        {
          headers: {
            "x-api-secret": apiSecret,
            "Content-Type": "application/json",
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