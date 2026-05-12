"use client";

import {useState} from "react";
import {
  Waves,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  ShieldCheck,
  Globe,
  Image,
} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("owner");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        role,
        image,
      });

      if (result?.error) {
        setError(result.error.message);
        toast.error(result.error.message);
        return;
      }

      toast.success("Account created successfully");
      router.push("/login");
      
    } catch (err) {
      setError("Something went wrong.");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const {error} = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      setError("Something went wrong.");
      toast.error("Google login failed");
      return;
    }
    toast.success("Logged in with Google");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Branding */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-2xl">
              <Waves className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
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
              employee management solution. Efficiently manage staff, salaries, departments, and administrative workflows from one
              centralized platform.
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

        {/* Form */}
        <div className="flex items-center justify-center">
          <div className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create Account
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get started with your dashboard
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </label>

                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Role
                  </label>

                  <div className="relative mt-2">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Photo URL
                  </label>

                  <div className="relative mt-2">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />

                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="Enter password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-base"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
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

            <p className="text-sm text-center text-slate-500 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold underline text-blue-500"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
