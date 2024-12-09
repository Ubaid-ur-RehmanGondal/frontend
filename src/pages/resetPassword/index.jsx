import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MdPassword } from "react-icons/md";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [values, setValues] = useState({
    newpassword: "",
    confirmpassword: "",
  });

  const [searchParams] = useSearchParams();

  const {
    mutate: resetPassword,
    isPending: isResetting,
    isError,
    error,
  } = useMutation({
    mutationFn: async (event) => {
      event.preventDefault();
      try {

        const userId = searchParams.get("id");
        const token = searchParams.get("token");
        const newpassword = values.newpassword;
       
          const res = await fetch(`/api/users/reset-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: newpassword, confirmpassword: values.confirmpassword, token, userId }),
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
        toast.success("Your password has been reset. You can login with new credentials!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="max-w-screen-xl mx-auto flex space-x-44 h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={resetPassword}>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Type the new password here
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              required
              placeholder="New Password"
              onChange={(e) => setValues({...values, newpassword: e.target.value})}
              value={values.newpassword}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              required
              placeholder="Confirm Password"
              onChange={(e) => setValues({...values, confirmpassword: e.target.value})}
              value={values.confirmpassword}
            />
          </label>

          <button className="btn rounded-full btn-primary text-white">
            {isResetting ? "Loading..." : "Done"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
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
  );
};

export default ResetPasswordPage;
