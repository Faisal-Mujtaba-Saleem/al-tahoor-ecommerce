import React from "react";
import Title from "../Title";
import FramerWrapper from "../FramerWrapper";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <FramerWrapper y={0} scale={0.95} className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-teal-800 text-white p-10 md:p-20 flex flex-col items-center justify-center gap-6 shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      <Title className="uppercase text-3xl md:text-5xl lg:text-6xl font-extrabold text-center tracking-wide z-10 drop-shadow-md">
        Premium Healthcare Products
      </Title>
      <p className="text-base md:text-lg text-center text-zinc-100 font-medium max-w-[600px] z-10 drop-shadow-sm">
        Find everything you need for your health and wellness, and shop the latest
        medical and personal care products at unbeatable prices.
      </p>
      <Link
        href="/shop"
        className="z-10 bg-white text-primary hover:bg-zinc-100 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
      >
        Shop Now
      </Link>
    </FramerWrapper>
  );
};

export default HomeBanner;
