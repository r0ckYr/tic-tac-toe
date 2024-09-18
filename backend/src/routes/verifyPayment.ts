import * as dotenv from 'dotenv';
const express = require('express');
const router = express.Router();
dotenv.config();

import { verifyPayment } from "../utils/verifyPayments";
import { addPlayerToGame } from '../database/databaseFunctions';

const GAME_WALLET_PUBLIC_KEY = process.env.GAME_WALLET_PUBLIC_KEY;

router.post("/verifyPayment", async (req: any, res: any) => {
    const paymentDetails = req.body;
    console.log(paymentDetails);
    if(!paymentDetails || !paymentDetails.signature || !paymentDetails.expectedAmount || !paymentDetails.code || !paymentDetails.player || !paymentDetails.walletAddress || !paymentDetails.type) {
        res.status(400).json({
            message: "Failed to verify payment!!"
        });
        return;
    }

    if(GAME_WALLET_PUBLIC_KEY == undefined) {
        res.status(500).json({
            message: "Server error"
        });
        return;
    }

    const paymentVerified = await verifyPayment(paymentDetails.signature, paymentDetails.expectedAmount, GAME_WALLET_PUBLIC_KEY);

    if(paymentVerified) {
        const success = addPlayerToGame(paymentDetails.code+paymentDetails.type, paymentDetails.player, paymentDetails.walletAddress);
        if(!success) {
            res.status(200).json({
                message: "Unable to add details!!"
            });
        }

        res.status(200).json({
            message: "Payment verified!!"
        });
    } else {
        res.status(400).json({
            message: "Failed to verify payment!!"
        });
    }
});

module.exports = router;
