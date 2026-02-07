import { Spinner } from '@/components/ui/spinner'
import { useGetSingleCourseHook } from '@/hooks/course.hook'
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from '@/hooks/payment.hook'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const SingleCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useGetSingleCourseHook(id)
  const { mutateAsync: createOrder, isPending } = useCreateRazorpayOrder()
  const { mutate: verifyPayment } = useVerifyRazorpayPayment()

  const purchaseHandler = async (course) => {
    try {
    
      const orderData = await createOrder({
        products: {
          _id: course._id,
          name: course.title,
          price: course.amount,
          image: course.thumbnail,
        },
      })


      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: course.title,
        description: course.description || "Course Purchase",
        image: course.thumbnail,

        order_id: orderData.orderId, 

        handler: function (response) {
       
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })


          navigate(
            `/payment-success?razorpay_order_id=${response.razorpay_order_id}&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
          )
        },

        prefill: {
          name: "User",
          email: "user@example.com",
        },

        theme: {
          color: "#10b981",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error("Payment failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-8">

        {/* Course Image */}
        <div className="flex items-center justify-center">
          <img
            src={data?.thumbnail}
            alt={data?.title}
            className="w-full max-h-[320px] object-contain rounded-xl"
          />
        </div>

        {/* Course Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {data?.title}
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {data?.description || "Upgrade your skills with this professional course."}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-emerald-600">
                ₹{data?.amount}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{Number(data?.amount) + 999}
              </span>
            </div>
          </div>


          <button
            disabled={isPending}
            onClick={() => purchaseHandler(data)}
            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-semibold text-lg
            hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPending ? <Spinner /> : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleCourse
