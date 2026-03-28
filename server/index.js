import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') }); 

// Initialize stripe with the secret key. If missing, it will throw when you actually try to use it against live API unless handled.
// For demonstration without an actual key, using a mock is not accepted by Stripe API, so we will expect the user to add STRIPE_SECRET_KEY to .env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey 
    ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
    : null;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
    try {
        if (!stripe) {
            console.warn("STRIPE_SECRET_KEY is missing. Sending dummy mock intent for demonstration.");
            // We simulate a response to keep frontend working in 'mock' UI mode, 
            // though Stripe Elements usually crashes if the intent isn't real.
            // Ideally the user will configure the .env key.
            return res.json({
                clientSecret: 'pi_mock_secret_test_123',
                mockWarning: true
            });
        }

        const { amount, currency = 'zar' } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Ideally, we'd take cart item IDs, fetch their current live prices from Supabase/DB,
        // sum them up to be 100% physically secure against client tampering.
        // For this phase, we accept the calculated amount from the frontend.

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Lowest denomination (e.g. cents)
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log(`Stripe Backend Server listening on port ${PORT}!`);
    if (!stripeSecretKey) {
        console.log("⚠️ WARNING: STRIPE_SECRET_KEY is not defined in .env. Payments will operate in mock visualization mode only.");
    }
});
