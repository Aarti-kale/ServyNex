import "dotenv/config";
import Razorpay from "razorpay";

// Create one Razorpay client using server-side credentials.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
