"use client";

import React from "react";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex items-center justify-end min-h-[200px]">
      <DotLottieReact
        src="https://lottie.host/341e537f-5e5d-4a5b-a944-39c0a8154339/jNCPeDYLXR.lottie"
        loop
        autoplay
      />
      <Link
        href="/dashboard"
        className="inline-flex gap-2 bg-emerald-900 text-white px-4 py-3 rounded-md hover:bg-emerald-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
