import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import Logo from "../../components/svgs/Logo";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const ForgotPasswordPage = () => {

     const [email, setEmail] = useState(""); 

    const { mutate: sendEmail, isPending: isSending, isError, error } = useMutation({
    mutationFn: async (e) => {
      try {
        e.preventDefault();
        
        const res = await fetch(`/api/users/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Password reset link has been sent to your email!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
    return (

          <div className="max-w-screen-xl mx-auto flex space-x-44 h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <Logo size={"150px"} className="fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={sendEmail}>
          <h1 className="text-4xl font-extrabold text-white mb-2">Reset your password!</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              required
              placeholder="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>

          <button className="btn rounded-full btn-primary text-white">
            {isSending ? "Loading..." : "Reset"}
          </button>
          {isError && <p className="text-red-500">
            {
              error.message
            }
          </p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">Go back to Login?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
    )
}

export default ForgotPasswordPage;