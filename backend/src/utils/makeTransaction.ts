import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { transfer } from "./transaction";

export const makeTransaction = async (publicKey: string[], amount: number) => {
    const privateKeyString = process.env.PRIVATE_KEY;
    if (!privateKeyString) {
        throw new Error("Private key not found in environment variables");
    }

    let amountPerRecipient;
    if(publicKey.length==2) {
        amountPerRecipient = amount / 2;
    } else {
        amountPerRecipient = amount;
    }

    publicKey.forEach((key) => {
        transfer(key, amountPerRecipient, "apisecret");
    });

    console.log("Transaction successful");
}