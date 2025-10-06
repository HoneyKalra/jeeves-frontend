// import { useForm } from "react-hook-form";
// import { useApp } from "../context/Appcontext";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export default function OptInForm() {
//   const navigate = useNavigate();
//   const baseUrl = import.meta.env.VITE_API_URL;

//   const {
//     optedIn,
//     setOptedIn,
//     setChatHistory,
//     fetchCallerData,
//     isLogin,
//     setIsLogin,
//     setName,
//     setPhone,
//     setEmail,
//   } = useApp();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({ mode: "all" });

//   // Opt-In
//   const handleOptIn = async (data) => {
//     try {
//       const res = await fetch(`${baseUrl}/api/opt-in`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();

//       if (!res.ok || result.message === "Already opted-in") {
//         toast.error(result.error);
//         navigate("/login");
//         return;
//       }

//       if (result.caller) {
//         localStorage.setItem("phone", data.phone);
//         localStorage.setItem("name", data.name || "");
//         localStorage.setItem("optedIn", "true");
//         setOptedIn(true);
//         navigate("/");
//         setName(data.name || "");
//         setPhone(data.phone);
//         setEmail(data.email);
//         setChatHistory(result.caller.chatSessions || []);
//         toast.success(result.message || "Opt-in successful!");
//         reset();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save your info.");
//     }
//   };

//   // Login
//   const handleLogin = async (data) => {
//     try {
//       const res = await fetch(`${baseUrl}/api/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone: data.phone, email: data.email }),
//       });
//       const result = await res.json();
//       if (result.success) {
//         localStorage.setItem("phone", result.caller.phone);
//         localStorage.setItem("name", result.caller.name);
//         localStorage.setItem("optedIn", "true");
//         setOptedIn(true);
//         navigate("/");
//         setName(result.caller.name);
//         setPhone(result.caller.phone);
//         setEmail(result.caller.email);
//         fetchCallerData(result.caller.phone);
//         toast.success("Logged-in successfully!");
//         reset();
//       } else {
//         toast.error(result.error || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">
//       {/* Navbar with Logo */}
//       <header className="w-full bg-gray-800  px-6 flex items-center shadow-md z-20 relative">
//         <img src="/ask_jeeves.png" alt="logo image" className="w-40 " />
//       </header>

//       {/* Decorative Background Blobs */}
//       <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//       <div className="absolute bottom-20 right-10 w-72 h-72"></div>

//       {/* Form Section */}
//       <div className="flex flex-1 justify-center items-center relative z-10 px-4">
//         <div className="p-8 rounded-2xl shadow-xl w-3/4 max-w-xl bg-white flex flex-col gap-4">
//           <h2 className="text-2xl font-semibold text-center text-gray-800">
//             Log in or sign up
//           </h2>
//           <div className="flex justify-center items-center">
//             <p className="w-full text-center text-gray-600 text-sm">
//               You’ll get smarter responses and more.
//             </p>
//           </div>

//           <form
//             onSubmit={handleSubmit(isLogin ? handleLogin : handleOptIn)}
//             className="flex flex-col gap-4"
//           >
//             {!isLogin && (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Your Name"
//                   {...register("name", {
//                     required: "Name is required",
//                     minLength: {
//                       value: 2,
//                       message: "Name must be at least 2 characters",
//                     },
//                     maxLength: {
//                       value: 30,
//                       message: "Name cannot exceed 50 characters",
//                     },
//                     pattern: {
//                       value: /^[A-Za-z\s]+$/,
//                       message: "Name can only contain letters and spaces",
//                     },
//                   })}
//                   className="border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm">{errors.name.message}</p>
//                 )}
//               </>
//             )}

//             {!isLogin && (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Your Phone"
//                   {...register("phone", {
//                     required: "Phone is required",
//                     pattern: {
//                       value: /^[0-9]{10}$/,
//                       message: "Enter a valid 10-digit phone number",
//                     },
//                   })}
//                   className="border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm">{errors.phone.message}</p>
//                 )}
//               </>
//             )}

//             <input
//               type="email"
//               placeholder="Your Email"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: "Enter a valid email address",
//                 },
//               })}
//               className="border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
//             >
//               {isLogin ? "Login" : "Submit"}
//             </button>
//           </form>

//           <button
//             onClick={() => {
//               setIsLogin(!isLogin);
//               reset();
//             }}
//             className="text-blue-600 hover:underline mt-2 text-sm"
//           >
//             {isLogin ? "New user? Opt-In" : "Already a member? Login"}
//           </button>
//         </div>
//       </div>
//       <div className="bg-gray-800 text-center py-5 mt-8">
//         <p className="text-white text-sm sm:text-base ">
//           © 2025 Ask Jeeves.All Rights Reserved
//         </p>
//       </div>
//     </div>
//   );
// }
import { useForm, Controller } from "react-hook-form";
import { useApp } from "../context/Appcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function OptInForm() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const {
    setOptedIn,
    setChatHistory,
    fetchCallerData,
    isLogin,
    setIsLogin,
    setName,
    setPhone,
    setEmail,
  } = useApp();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "all" });

  // Opt-In
  const handleOptIn = async (data) => {
    try {
      const res = await fetch(`${baseUrl}/api/opt-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok || result.message === "Already opted-in") {
        toast.error(result.error);
        navigate("/login");
        return;
      }

      if (result.caller) {
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("name", data.name || "");
        localStorage.setItem("countryCode", data.countryCode || "");
        localStorage.setItem("countryIso", data.countryIso || "");
        localStorage.setItem("optedIn", "true");
        setOptedIn(true);
        navigate("/");
        setName(data.name || "");
        setPhone(data.phone);
        setEmail(data.email);
        setChatHistory(result.caller.chatSessions || []);
        toast.success(result.message || "Opt-in successful!");
        reset();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save your info.");
    }
  };

  // Login
  const handleLogin = async (data) => {
    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone, email: data.email }),
      });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem("phone", result.caller.phone);
        localStorage.setItem("name", result.caller.name);
        localStorage.setItem("optedIn", "true");
        setOptedIn(true);
        navigate("/");
        setName(result.caller.name);
        setPhone(result.caller.phone);
        setEmail(result.caller.email);
        fetchCallerData(result.caller.phone);
        toast.success("Logged-in successfully!");
        reset();
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">
      {/* Navbar */}
      <header className="w-full bg-gray-800 px-6 flex items-center shadow-md z-20 relative">
        <img src="/ask_jeeves.png" alt="logo image" className="w-40" />
      </header>

      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72"></div>

      {/* Form */}
      <div className="flex flex-1 justify-center items-center relative z-10 px-4">
        <div className="p-8 rounded-2xl shadow-xl w-3/4 max-w-xl bg-white flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Log in or sign up
          </h2>
          <p className="w-full text-center text-gray-600 text-sm">
            You’ll get smarter responses and more.
          </p>

          <form
            onSubmit={handleSubmit(isLogin ? handleLogin : handleOptIn)}
            className="flex flex-col gap-4"
          >
            {!isLogin && (
              <>
                {/* Name */}
                <input
                  type="text"
                  placeholder="Your Name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Name cannot exceed 50 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  })}
                  className="border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </>
            )}

            {!isLogin && (
              <>
                {/* Phone with Country Code */}
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone is required",
                    validate: (value) => {
                      const digitsOnly = value.replace(/\D/g, "");
                      return (
                        /^\+?[1-9]\d{7,14}$/.test("+" + digitsOnly) ||
                        "Enter a valid phone number"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      country="us"
                      inputClass="!w-full !h-12 !rounded !border !focus:ring-2 !focus:ring-blue-400 !outline-none"
                      onChange={(value, country) => {
                        field.onChange("+" + value);
                        setValue("countryCode", country.dialCode);
                        setValue(
                          "countryIso",
                          country.countryCode?.toUpperCase() || ""
                        );
                      }}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}

                {/* Hidden fields */}
                <Controller
                  name="countryCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <Controller
                  name="countryIso"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="border p-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isLogin ? "Login" : "Submit"}
            </button>
          </form>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
            }}
            className="text-blue-600 hover:underline mt-2 text-sm"
          >
            {isLogin ? "New user? Opt-In" : "Already a member? Login"}
          </button>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-5 mt-8">
        <p className="text-white text-sm sm:text-base">
          © 2025 Ask Jeeves. All Rights Reserved
        </p>
      </div>
    </div>
  );
}
