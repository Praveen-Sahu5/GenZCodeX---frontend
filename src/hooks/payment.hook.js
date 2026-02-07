import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from "@/Api/purchase.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";



export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: createRazorpayOrderApi,
    onSuccess: (data) => {
      toast.success("Order created. Opening payment...");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create payment order");
    },
  });
};


export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: verifyRazorpayPaymentApi,
    onSuccess: (data) => {
      toast.success(data.message || "Payment successful");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Payment verification failed");
    },
  });
};
