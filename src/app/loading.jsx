"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <DotLottieReact
        src="https://lottie.host/b434f70a-62c5-4671-98ac-e7cf413d7639/XfBZhL04xb.lottie"
        loop
        autoplay
        style={{width: 180, height: 180}}
      />
    </div>
  );
};

export default Loading;