import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi.js";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 5) {
      toast.error("Please enter a valid 5 digit code");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyEmail({
        email,
        code,
      });

      toast.success(response.data.message);

      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Invalid verification code"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {

    setResendLoading(true);

    try {

      const response =
        await authApi.resendVerification({
          email,
        });

      toast.success(response.data.message);

    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed to resend code"
      );

    } finally {
      setResendLoading(false);
    }
  };


  return (
    <div className="
      min-h-screen 
      bg-[#f8f7fc]
      flex
      items-center
      justify-center
      px-6
    ">

      <div className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-xl
        p-8
      ">

        {/* Icon */}

        <div className="
          w-16
          h-16
          mx-auto
          rounded-2xl
          bg-gradient-to-br
          from-violet-600
          to-pink-500
          flex
          items-center
          justify-center
          text-white
          text-3xl
        ">
          ✉️
        </div>


        <h1 className="
          text-3xl
          font-bold
          text-center
          text-gray-900
          mt-6
        ">
          Verify Your Email
        </h1>


        <p className="
          text-center
          text-gray-500
          mt-3
          leading-6
        ">
          We sent a 5 digit verification code to
        </p>


        <p className="
          text-center
          font-semibold
          text-violet-600
          mt-1
        ">
          {email}
        </p>



        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-6"
        >

          <input
            value={code}
            onChange={(e)=> {
              const value =
                e.target.value.replace(/\D/g,"");

              if(value.length <=5){
                setCode(value);
              }
            }}
            maxLength={5}
            placeholder="00000"
            className="
              w-full
              text-center
              tracking-[15px]
              text-3xl
              font-bold
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              py-4
              outline-none
              focus:border-violet-600
              focus:ring-4
              focus:ring-violet-100
            "
          />


          <button
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-violet-600
              hover:bg-violet-700
              text-white
              font-semibold
              transition
              disabled:opacity-50
            "
          >
            {
              loading
              ?
              "Verifying..."
              :
              "Verify Email"
            }

          </button>

        </form>



        <div className="
          mt-6
          bg-violet-50
          border
          border-violet-100
          rounded-xl
          p-4
        ">

          <p className="
            text-sm
            text-gray-600
            text-center
          ">
            Didn't receive the code?
          </p>


          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="
              mt-3
              w-full
              py-3
              rounded-xl
              border
              border-pink-500
              text-pink-600
              font-semibold
              hover:bg-pink-50
              transition
              disabled:opacity-50
            "
          >

            {
              resendLoading
              ?
              "Sending..."
              :
              "Resend Code"
            }

          </button>

        </div>



        <p className="
          text-center
          text-sm
          text-gray-400
          mt-6
        ">
          The code expires in 10 minutes.
        </p>


      </div>

    </div>
  );
}