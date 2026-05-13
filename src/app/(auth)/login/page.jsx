"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";

import {
  Waves,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Globe,
} from "lucide-react";

import {authClient} from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLoginFunc = async (data) => {
    setError("");

    const {data: res, error} = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: "/dashboard",
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed");
      return;
    }

    
    if (res) {
      toast.success("Login successful");
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const {error} = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setError("Something Wrong.");
      toast.error("Google login failed");
      return;
    }
    toast.success("Logged in with Google");
  };

  const demoAccounts = [
    {email: "jubu23@gmail.com", password: "98765432", role: "Owner"},
  ];

  const fillDemoAccount = (email, password) => {
    setValue("email", email);
    setValue("password", password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 py-10">
      <div className="w-full container max-w-300 grid grid-cols-1 grid-wrap lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-2 rounded-2xl lg:rounded-3xl shadow-2xl">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-12 lg:h-20 lg:w-20 object-contain rounded-2xl"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white">
                Breakers Payoo
              </h1>
              <p className="text-lg sm:text-xl lg:text-xl xl:text-2xl text-slate-600 dark:text-slate-400 mt-2">
                Premier Payrollment IT Center
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6 max-w-md lg:max-w-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-slate-800 dark:text-slate-200">
              Payroll Management System
            </h2>
            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Streamline your business operations with our modern payroll and
              employee management solution. Efficiently manage staff, salaries,
              departments, and administrative workflows from one centralized
              platform.
            </p>

            <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-4 lg:pt-6">
              <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  28+
                </div>
                <div className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
                  Employees
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  8
                </div>
                <div className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
                  Departments
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login */}
        <div className="flex items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 lg:p-8 xl:p-10">
            <h3 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
              Welcome Back
            </h3>

            {/* Error */}
            {(error || errors.root) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-600">
                  {error || errors.root?.message}
                </p>
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleLoginFunc)}
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-5 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-slate-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 text-center text-sm text-slate-500">OR</div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-slate-700 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>

            {/* Demo Accounts */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-center text-slate-500">
                Demo Accounts
              </p>

              {demoAccounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => fillDemoAccount(acc.email, acc.password)}
                  className="w-full text-left p-3 border rounded-lg dark:text-white text-slate-900 hover:bg-slate-500"
                >
                  <div className="text-sm font-semibold">{acc.role}</div>
                  <div className="text-xs text-slate-400">{acc.email}</div>
                </button>
              ))}

              <p className="text-sm text-center mt-3 text-slate-500">
                Don’t have an account?{" "}
                <a
                  href="/registration"
                  className="font-semibold underline text-blue-500"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
