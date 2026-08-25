"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Poppins, Anton } from "next/font/google";
import RTILogo from "@/components/RTILogo";
import { isUserAuthenticated } from "@/lib/auth";
import {
  Building2,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  Loader2,
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const ministries = [
  "Ministry of Road Transport and Highways",
  "Ministry of Consumer Affairs, Food & Public Distribution",
  "Ministry of Health & Family Welfare",
  "Ministry of Railways",
  "Ministry of Finance & Corporate Affairs",
  "Ministry of Education",
  "Ministry of Jal Shakti (Water Resources)",
  "Ministry of Environment, Forest & Climate Change",
  "Ministry of Electronics & Information Technology",
  "Department of Telecommunications",
];

export default function SubmitRequestPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserAuthenticated()) {
      toast.error("Please login first to file an RTI request!");
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const [formData, setFormData] = useState({
    ministry: ministries[0],
    subject: "",
    description: "",
    fullName: "Aryan Sharma",
    email: "aryan.sharma@gmail.com",
    phone: "+91 98765 43210",
    address: "24, MG Road, Connaught Place",
    state: "Delhi",
    pincode: "110001",
    isBPL: false,
    bplNumber: "",
    agreedToTerms: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/view-history");
    }, 5000);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ff5a2c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${poppins.className} font-poppins min-h-screen bg-[#faf8f5]`}>
      {/* Top Header */}
      <div className="px-8 sm:px-16 pt-8 mb-2 mx-auto flex items-start justify-between gap-4">
        <div>
          <h1
            className={`${anton.className} font-anton text-5xl leading-[0.75] tracking-wide text-black inline-block border-b-7 border-[#ff5a2c] pb-0`}
          >
            FILE RTI
          </h1>
          <p className="max-w-2xl leading-relaxed mt-2 text-slate-700 text-sm sm:text-base">
            Submit Your RTI from here, all the info you give here should be correct (not really)
          </p>
        </div>

        <div className="self-start shrink-0">
          <RTILogo size={13} />
        </div>
      </div>

      <div className="mx-8 sm:mx-16 border-b-2 border-slate-600 mb-12" />


      {/* Main Content Area */}
      <main className="px-8 sm:px-16 pb-16 max-w-7xl mx-auto">
        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Fields - 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
              {/* Section 1: Authority Selection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-zinc-200">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-[#fff2ec] flex items-center justify-center text-[#ff5a2c]">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h2 className={`${anton.className} font-anton text-2xl text-black`}>
                      1. SELECT PUBLIC AUTHORITY
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Choose the Central Ministry or Department you want information from.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="ministry"
                      className="block text-sm font-semibold text-zinc-800 mb-2"
                    >
                      Ministry / Department <span className="text-[#ff5a2c]">*</span>
                    </label>
                    <select
                      id="ministry"
                      value={formData.ministry}
                      onChange={(e) =>
                        setFormData({ ...formData, ministry: e.target.value })
                      }
                      className="w-full h-14 rounded-xl border-2 border-zinc-300 bg-white px-4 text-base text-zinc-800 outline-none focus:border-[#ff5a2c] transition-colors"
                      required
                    >
                      {ministries.map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: RTI Query & Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-zinc-200">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-[#fff2ec] flex items-center justify-center text-[#ff5a2c]">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h2 className={`${anton.className} font-anton text-2xl text-black`}>
                      2. RTI APPLICATION DETAILS
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Formulate your questions clearly. Be specific to receive timely answers.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* RTI Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-zinc-800 mb-2"
                    >
                      Subject / Title of RTI <span className="text-[#ff5a2c]">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. Budget allocation and expenditure details for National Highway 48"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full h-14 rounded-xl border-2 border-zinc-300 bg-white px-4 text-base text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-[#ff5a2c] transition-colors"
                      required
                    />
                  </div>

                  {/* RTI Text Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-semibold text-zinc-800"
                      >
                        Text of RTI Request (Questions) <span className="text-[#ff5a2c]">*</span>
                      </label>
                      <span className="text-xs text-zinc-500">
                        {formData.description.length}/3000 chars
                      </span>
                    </div>

                    <textarea
                      id="description"
                      rows={6}
                      maxLength={3000}
                      placeholder={`Please provide the following information under RTI Act 2005:
1. Total sanctioned budget for the project during fiscal year 2024-25.
2. Certified copies of the completion audit reports.
3. Name and designation of the designated project supervisor.`}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full rounded-xl border-2 border-zinc-300 bg-white p-4 text-base text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-[#ff5a2c] transition-colors"
                      required
                    />
                  </div>

                  {/* Supporting Document Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-800 mb-2">
                      Supporting Document (Optional PDF / Image, max 2MB)
                    </label>
                    <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:border-[#ff5a2c] transition-colors cursor-pointer bg-zinc-50/50">
                      <Upload className="mx-auto text-zinc-400 mb-2" size={28} />
                      <p className="text-sm font-medium text-zinc-700">
                        Click to upload or drag and drop supporting papers
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        PDF, JPG, PNG (up to 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Applicant Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-zinc-200">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-xl bg-[#fff2ec] flex items-center justify-center text-[#ff5a2c]">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className={`${anton.className} font-anton text-2xl text-black`}>
                      3. APPLICANT INFORMATION
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Communication and physical response will be addressed to these details.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full h-12 rounded-xl border-2 border-zinc-300 px-3 pl-10 text-sm text-zinc-800 outline-none focus:border-[#ff5a2c]"
                        required
                      />
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full h-12 rounded-xl border-2 border-zinc-300 px-3 pl-10 text-sm text-zinc-800 outline-none focus:border-[#ff5a2c]"
                        required
                      />
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-12 rounded-xl border-2 border-zinc-300 px-3 pl-10 text-sm text-zinc-800 outline-none focus:border-[#ff5a2c]"
                        required
                      />
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      State / Union Territory
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full h-12 rounded-xl border-2 border-zinc-300 px-3 pl-10 text-sm text-zinc-800 outline-none focus:border-[#ff5a2c]"
                        required
                      />
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Mailing Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full h-12 rounded-xl border-2 border-zinc-300 px-3 text-sm text-zinc-800 outline-none focus:border-[#ff5a2c]"
                      required
                    />
                  </div>
                </div>

                {/* BPL Exemption Checkbox */}
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-start gap-3">
                  <input
                    id="bpl"
                    type="checkbox"
                    checked={formData.isBPL}
                    onChange={(e) =>
                      setFormData({ ...formData, isBPL: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-[#ff5a2c] focus:ring-[#ff5a2c]"
                  />
                  <label htmlFor="bpl" className="text-xs text-zinc-600 leading-normal">
                    I belong to Below Poverty Line (BPL) category. (RTI fee of ₹10 is
                    waived with valid proof).
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar Summary & Payment Column */}
            <div className="space-y-6">
              {/* Fee & Payment Card with Brand Offset Effect */}
              <div className="relative">
                {/* Brand Offset Backdrop Plate */}
                <div className="absolute -left-3 -top-3 w-full h-full bg-[#ff5a2c] rounded-3xl" />

                <div className="relative bg-[#161618] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-zinc-800">
                  <h3 className={`${anton.className} font-anton text-3xl tracking-wide mb-4`}>
                    FEE SUMMARY
                  </h3>

                  <div className="space-y-3 text-sm pb-5 border-b border-zinc-800">
                    <div className="flex justify-between text-zinc-300">
                      <span>Government RTI Fee</span>
                      <span className="font-semibold text-white">
                        {formData.isBPL ? "₹0.00 (BPL)" : "₹10.00"}
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-300">
                      <span>Portal Processing</span>
                      <span className="font-semibold text-white">₹0.00</span>
                    </div>

                    <div className="flex justify-between text-zinc-300">
                      <span>GST (0%)</span>
                      <span className="font-semibold text-white">₹0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-2xl text-[#ff5a2c]">
                      {formData.isBPL ? "₹0.00" : "₹10.00"}
                    </span>
                  </div>

                  {/* Declaration */}
                  <div className="bg-zinc-900/80 rounded-xl p-3.5 mb-6 text-xs text-zinc-400 flex items-start gap-2.5">
                    <ShieldCheck size={18} className="text-[#ff5a2c] shrink-0 mt-0.5" />
                    <span>
                      I declare that I am an Indian Citizen and the queries sought fall
                      under RTI Act 2005.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full h-14 rounded-2xl bg-[#ff5a2c] hover:bg-[#e94b20] disabled:opacity-80 text-white text-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        <span>Processing (5s)...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {formData.isBPL ? "Submit RTI Request" : "Pay ₹10 & Submit RTI"}
                        </span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-zinc-500 mt-3">
                    Secure 256-bit SSL encrypted government payment gateway
                  </p>
                </div>
              </div>
            </div>
          </form>
      </main>
    </div>
  );
}
