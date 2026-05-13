"use client";

import React from "react";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Animation */}
      <div className="w-full md:max-w-4xl">
        <DotLottieReact
          src="https://lottie.host/341e537f-5e5d-4a5b-a944-39c0a8154339/jNCPeDYLXR.lottie"
          loop
          autoplay
        />
      </div>

      {/* Button */}
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 bg-emerald-900 text-white md:px-5 md:py-3 p-2 rounded-md hover:bg-emerald-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
