import axios from "axios";

export const createRazorpayOrderApi = async (payload) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/payment/create-order`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return res.data; 
};

export const verifyRazorpayPaymentApi = async (paymentData) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/payment/verify-payment`,
    paymentData,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return res.data; 
};
