import React from "react";
import RTILogo from "@/components/RTILogo";
import { Poppins, Anton } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginPage() {
  return (
    <main className={`${poppins.className} min-h-screen bg-[#ebe8e2] p-5`}>
      <div className="flex min-h-[calc(100vh-40px)] gap-5">
        {/* Left Section */}
        <section className="relative hidden w-1/2 overflow-hidden rounded-3xl bg-[#ff5a2b] p-6 md:block">
          {/* RTI Logo */}
          <Link href="/" className="inline-block">
            <RTILogo
              size={15}
              iconColor="#000000"
              rightToColor="#000000"
              informationColor="#ffffff"
            />
          </Link>
          {/* Bottom Content */}
          <div className="absolute bottom-6 left-6">
            <h1 className={`${anton.className} text-7xl tracking-wide text-black md:text-8xl`}>
              Login
            </h1>

            <p className="mt-1 max-w-sm text-lg font-normal leading-tight text-black">
              You have to login to file an RTI, since this is the demo version,
              signup is not available
            </p>
          </div>
        </section>

        {/* Right Section */}
        <section className="relative flex flex-1 items-center justify-center">
          <div className="w-full max-w-[380px]">
            <h1 className={`${anton.className} mb-8 text-center text-7xl tracking-wide text-[#090b0c]`}>
              Login
            </h1>

            <form className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-[26px] font-medium text-[#25282b]"
                >
                  Your Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  className="h-14 w-full rounded-xl border-2 border-[#242424] bg-transparent px-4 text-xl text-[#25282b] outline-none placeholder:text-[#85898c] focus:border-black"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-[26px] font-medium text-[#25282b]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="****************"
                  className="h-14 w-full rounded-xl border-2 border-[#242424] bg-transparent px-4 text-xl text-[#25282b] outline-none placeholder:text-[#85898c] focus:border-black"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className=" cursor-pointer mt-3 h-14 w-full rounded-xl bg-[#ff5a2b] text-2xl font-semibold text-white transition hover:bg-[#e94d20] active:scale-[0.99]"
              >
                Get Started
              </button>
            </form>
              <p className="absolute bottom-3 right-7 text-xl text-[#65696d]">
                sign up is not available
              </p>
          </div>

        </section>
      </div>
    </main>
  );
}
