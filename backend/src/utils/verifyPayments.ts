import * as dotenv from 'dotenv';
import { addPlayerToGame } from '../database/databaseFunctions';

const { Connection, PublicKey, LAMPORTS_PER_SOL, TransactionResponse, TransactionConformationStatus } = require('@solana/web3.js');
const connectionString = process.env.SOLANA_NETWORK
const connection = new Connection(connectionString, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 seconds
});

dotenv.config();

export async function verifyPayment(signature: string, expectedAmount: number, expectedRecipient: string): Promise<boolean> {
  try {
    const transaction: typeof TransactionResponse | null = await connection.getTransaction(signature, {
      commitment: 'confirmed',
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.meta?.err) {
      throw new Error('Transaction failed');
    }

    const recipient = transaction.transaction.message.accountKeys[1].toBase58();
    if (recipient !== expectedRecipient) {
      throw new Error('Incorrect recipient');
    }

    const amount = transaction.meta!.postBalances[1] - transaction.meta!.preBalances[1];
    if (amount !== expectedAmount * LAMPORTS_PER_SOL) {
      throw new Error('Incorrect amount');
    }

    return true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
}