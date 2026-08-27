"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RTILogo from "@/components/RTILogo";
import { Poppins, Anton } from "next/font/google";
import { isUserAuthenticated, logoutUser } from "@/lib/auth";
import {
  Building2,
  FileText,
  CreditCard,
  Download,
  ArrowRight,
  ShieldCheck,
  Clock,
  Scale,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Landmark,
  FileCheck,
  ChevronRight,
  Search,
  Check,
  HelpCircle,
  Zap,
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const howItWorksSteps = [
  {
    step: "01",
    title: "Select Public Authority",
    description:
      "Choose from 10+ Central Ministries, Public Departments, or CPSEs (Road Transport, Railways, Finance, Education, Health) holding the records you need.",
    icon: Building2,
    badge: "10+ Ministries",
    highlight: "Central Authority",
  },
  {
    step: "02",
    title: "Draft Your Questions",
    description:
      "Formulate clear, specific queries regarding budgets, project timelines, tender copies, or official policy decisions under Section 6(1).",
    icon: FileText,
    badge: "Section 6(1) Format",
    highlight: "Clear & Specific",
  },
  {
    step: "03",
    title: "Nominal ₹10 Fee / BPL Waiver",
    description:
      "Pay the statutory ₹10 fee securely via UPI, Net Banking, or Card. Free ₹0 exemption is available for Below Poverty Line (BPL) applicants.",
    icon: CreditCard,
    badge: "Instant Payment",
    highlight: "₹10 / ₹0 Free BPL",
  },
  {
    step: "04",
    title: "Receive & Download Response",
    description:
      "Track your application status in real-time and download certified official RTI reports directly in PDF format with audit timestamps.",
    icon: Download,
    badge: "Instant PDF Export",
    highlight: "Official Certified PDF",
  },
];


export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [activePhase, setActivePhase] = useState(0);

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
              href="https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf"
              target="_blank"
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
                  <a href="https://rtionline.gov.in/viewPDF.php?file=um_citizen.pdf" target="_blank" className="rounded-full border border-zinc-700 bg-transparent px-5 py-2 text-lg font-medium text-zinc-700 cursor-pointer transition hover:bg-zinc-800 hover:text-white">
                    Read Manual
                  </a>

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
      {/* How It Works Section */}
      <section id="how-it-works" className="w-full px-6 py-20 lg:px-12 bg-white">
        <div id="services" className="-mt-16 pt-16 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2
              className={`${anton.className} font-anton text-5xl sm:text-6xl lg:text-7xl tracking-wide text-black uppercase`}
            >
              HOW RTI <span className="text-[#ff5a2c]">WORKS</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Filing an RTI application online is fast, transparent, and completely digital.
              Follow this 4-step workflow to seek official government records, tender allocations, and public accounts.
            </p>
          </div>

          {/* 4 Core Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-5">
            {howItWorksSteps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="cursor-pointer group relative bg-[#faf8f5] hover:bg-white rounded-3xl p-7 border-2 border-zinc-200 hover:border-[#ff5a2c] transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon & Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#ff5a2c] text-white flex items-center justify-center shadow-md">
                        <IconComp size={26} />
                      </div>
                      <span
                        className={`${anton.className} font-anton text-4xl text-zinc-300 group-hover:text-[#ff5a2c] transition-colors`}
                      >
                        {item.step}
                      </span>
                    </div>

                    <div className="inline-block px-2.5 py-1 rounded-md bg-zinc-200/80 text-[11px] font-bold text-zinc-800 mb-3 uppercase tracking-wide">
                      {item.badge}
                    </div>

                    <h3
                      className={`${anton.className} font-anton text-2xl text-black tracking-wide mb-3`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-semibold text-[#ff5a2c]">
                    <span>Step {item.step} of 04</span>
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#121214] text-zinc-400 border-t border-zinc-800 pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
            {/* Branding */}
            <div className="lg:col-span-2 space-y-4">
              <RTILogo
                size={16}
                iconColor="#ff5a2c"
                rightToColor="#ffffff"
                informationColor="#ff5a2c"
              />
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm pt-2">
                A modern redesign of RTI website for make india hackathon, Not to be affiliated by GOV of India, Created by <a href="https://github.com/CYCNO" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-[#ff5a2c]">CYCNO</a> and <a href="https://github.com/hproooo55" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-[#ff5a2c]">Noobyfy</a>
              </p>
              <div className="text-xs text-zinc-500 pt-2 w-[70%]">
                Not to be affiliated with Central Information Commission & Government of India
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`${anton.className} font-anton text-lg tracking-wider text-white mb-4`}>
                QUICK LINKS
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/submit-request" className="hover:text-[#ff5a2c] transition-colors">
                    Submit Request
                  </Link>
                </li>
                <li>
                  <Link href="/view-history" className="hover:text-[#ff5a2c] transition-colors">
                    View History
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#ff5a2c] transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Ministries */}
            <div>
              <h4 className={`${anton.className} font-anton text-lg tracking-wider text-white mb-4`}>
                COVERED BODIES
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li>Ministry of Road Transport</li>
                <li>Ministry of Railways</li>
                <li>Ministry of Finance</li>
                <li>Ministry of Health</li>
                <li>Ministry of Education</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`${anton.className} font-anton text-lg tracking-wider text-white mb-4`}>
                LEGAL & HELPLINE
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-400">
                <li>RTI Act 2005 Guidelines</li>
                <li>First Appeals Manual</li>
                <li>Helpline: 011-24648314</li>
                <li>Helpdesk: rti-online@nic.in</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} Redisgn of Right to Information Portal. Built for Hackathon.</p>
            <p className="flex items-center gap-4">
              <span>National Informatics Centre</span>
              <span>•</span>
              <span>Central Information Commission</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
