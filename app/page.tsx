"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RTILogo from "@/components/RTILogo";
import { Poppins, Anton } from "next/font/google";
import { isUserAuthenticated, logoutUser } from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isUserAuthenticated());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsAuth(false);
    toast.success("Logged out successfully.", { id: "logout-toast" });
    router.refresh();
  };

  return (
    <div className={poppins.className}>
      <header className="w-full">
        <nav className="flex justify-between p-4 px-10">
          <RTILogo size={15}/>
          <div className="nav flex gap-10 px-2 items-center ">
            <div className="pt-2 flex gap-10 items-center">

            <Link
              href="/submit-request"
              className="group relative inline-block text-lg leading-none pb-1 text-black hover:text-[#F25922] transition-colors duration-300"
            >
              <span>Submit Request</span>
              <span className="absolute bottom-0 left-0 h-1 w-6 bg-[#F25922] rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </Link>

            <Link
              href="/view-history"
              className="group relative inline-block text-lg leading-none pb-1 text-black hover:text-[#F25922] transition-colors duration-300"
            >
              <span>View History</span>
              <span className="absolute bottom-0 left-0 h-1 w-6 bg-[#F25922] rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </Link>

            <a
              href="#services"
              className="group relative inline-block text-lg leading-none pb-1 text-black hover:text-[#F25922] transition-colors duration-300"
            >
              <span>User Manual</span>
              <span className="absolute bottom-0 left-0 h-1 w-6 bg-[#F25922] rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </a>
            </div>

            {isAuth ? (
              <button
                onClick={handleLogout}
                className="cursor-pointer text-lg bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 rounded-full text-white px-6 py-1.5"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-lg bg-[#F25922] hover:bg-[#d94813] transition-colors duration-300 rounded-full text-white px-6 py-1.5"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
        <div className="w-[95%] max-w-7xl mx-auto border-b-2 border-slate-600" />
      </header>

      <section className="w-full overflow-hidden px-6 py-6 lg:px-10">
            <div className="mx-auto grid max-w-[1260px] w-full items-center gap-6 lg:gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">

              {/* Left Content */}
              <div className="w-full max-w-[640px]">
                <h1 className={`${anton.className} font-anton text-6xl tracking-wide text-black sm:text-7xl lg:text-[80px]`}>
                  ASKING QUESTIONS
                  <br />
                  IS YOUR{" "}
                  <span className="text-[#ff5a2c]">
                    RIGHT
                  </span>
                </h1>

                <p className="mt-6 max-w-[580px] text-sm leading-6 text-zinc-600 sm:text-base">
                  This is a portal to file RTI applications/first appeals online
                  along with internet banking, debit/credit cards of Master/Visa,
                  RuPay cards and UPI. Through this portal, RTI applications/first
                  appeals can be filed by Indian Citizens for all Ministries/
                  Departments and other Public Authorities of Central Government.
                  RTI applications/first appeals should not be filed for other
                  Public authorities under the State Government.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="rounded-full border border-zinc-700 bg-transparent px-5 py-2 text-lg font-medium text-zinc-700 cursor-pointer transition hover:bg-zinc-800 hover:text-white">
                    Read Manual
                  </button>

                  <Link href="/submit-request" className="rounded-full bg-[#ff5a2c] px-5 py-2 text-lg font-medium text-white shadow-sm transition cursor-pointer hover:bg-[#e94b20]">
                    Ask Today →
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative w-full max-w-[540px] lg:justify-self-start">
                {/* Solid Orange Backdrop Layer that the image lays on */}
                <div className="absolute -left-4 -top-4 w-full h-full bg-[#ff5a2c]" />

                <div className="relative overflow-hidden shadow-md shadow-black/25">
                  <img
                    src="/supreme-court.png"
                    alt="Supreme Court of India"
                    className="h-[360px] w-full object-cover sm:h-[450px] lg:h-[530px]"
                  />
                </div>
              </div>

            </div>
      </section>

      {/* Marquee Banner Section */}
      <section className="w-full bg-black py-3 overflow-hidden select-none border-y border-zinc-900">
        <div className={`animate-marquee-right ${anton.className} font-anton flex items-center text-lg sm:text-xl tracking-wider text-white uppercase whitespace-nowrap`}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 mx-5">
              <span>
                ASKING QUESTION IS YOUR <span className="text-[#ff5a2c]">RIGHT</span>
              </span>
              <span className="text-[#ff5a2c] text-xs">◆</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

//todo: add how rti work section
