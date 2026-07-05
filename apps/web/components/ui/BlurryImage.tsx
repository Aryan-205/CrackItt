"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function BlurryImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={cn(
        "transition-all duration-700 ease-out",
        !loaded ? "blur-md scale-[1.02] opacity-60" : "blur-0 scale-100 opacity-100",
        props.className
      )}
      onLoad={(e) => {
        setLoaded(true);
        if (props.onLoad) {
          props.onLoad(e);
        }
      }}
    />
  );
}
