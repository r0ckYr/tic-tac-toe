import * as dotenv from 'dotenv';
const { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
dotenv.config();

const NETWORK = "https://api.devnet.solana.com";
const connection = new Connection(NETWORK);

const GAME_WALLET_PRIVATE_KEY = process.env.GAME_WALLET_PRIVATE_KEY;
const gameWalletKeypair = Keypair.fromSecretKey(bs58.decode(GAME_WALLET_PRIVATE_KEY));

async function Trasnfer(walletAddress: string, amount: number): Promise<boolean> {
    try {
        if (!walletAddress || !amount) {
            return false;
        }

        const lamports = amount * 1000000000;

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: gameWalletKeypair.publicKey,
                toPubkey: new PublicKey(walletAddress),
                lamports: lamports
            })
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [gameWalletKeypair]
        );

        return true;
    } catch (error) {
        console.error('Withdrawal error:', error);
        return false;
    }
}