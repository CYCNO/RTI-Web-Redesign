"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Poppins, Anton } from "next/font/google";
import RTILogo from "@/components/RTILogo";
import { FileText, Clock, Loader2 } from "lucide-react";
import { isUserAuthenticated } from "@/lib/auth";
import { generateAndOpenRtiPdf } from "@/lib/generateRtiPdf";
import { getDepartmentImageUrl } from "@/lib/departmentImages";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

interface ReportItem {
  id: string;
  title: string;
  image: string;
  status: "completed" | "pending";
  date: string;
  refNumber: string;
  department: string;
  description?: string;
  applicant?: string;
  response?: string[] | string;
  createdAt?: number;
}

interface ReportCardProps {
  report: ReportItem;
  isUnderReview?: boolean;
}

function ReportCard({ report, isUnderReview = false }: ReportCardProps) {
  const isCompleted = report.status === "completed" && !isUnderReview;
  const displayImage =
    report.image && report.image !== "/supreme-court.png"
      ? report.image
      : getDepartmentImageUrl(report.department);

  const handleDownload = async () => {
    await generateAndOpenRtiPdf(report);
  };

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden rounded-2xl p-3.5 shadow-lg transition-all duration-500 ${
        isCompleted
          ? "bg-[#ff5a2f]"
          : "bg-[#18181b] border border-zinc-700/80 shadow-black/40"
      }`}
    >
      {/* Top Image */}
      <div className="overflow-hidden rounded-xl bg-black/20">
        <img
          src={displayImage}
          alt={report.title}
          className={`h-[320px] w-full object-cover transition-all duration-500 ${
            isCompleted ? "" : "grayscale contrast-110 brightness-95"
          }`}
        />
      </div>

      {/* Card Body */}
      <div className="px-1 pt-3.5 pb-2">
        <div
          className={`flex items-center justify-between text-xs font-medium mb-1.5 ${
            isCompleted ? "text-white/80" : "text-zinc-400"
          }`}
        >
          <span className="w-[70%] text-xs truncate">{report.department}</span>
          <span>{report.date}</span>
        </div>

        <h2
          className={`${anton.className} font-anton text-2xl sm:text-3xl leading-[1.05] tracking-wide text-white line-clamp-2`}
        >
          {report.title}
        </h2>
      </div>

      {/* Action Button: Uses standard Under Review template or Download PDF */}
      {isCompleted ? (
        <button
          onClick={handleDownload}
          className="cursor-pointer mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-[#222222] shadow-sm transition-all hover:bg-gray-100 active:scale-[0.98]"
        >
          <FileText size={18} className="text-[#ff5a2f]" />
          <span>Download PDF</span>
        </button>
      ) : (
        <button className="cursor-default mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#27272a] border border-zinc-700/60 font-semibold text-zinc-300 shadow-sm">
          <Clock size={17} className="text-amber-400" />
          <span>Under Review</span>
        </button>
      )}
    </div>
  );
}

export default function History() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [underReviewIds, setUnderReviewIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserAuthenticated()) {
      toast.error("Please login first to view your RTI history!", {
        id: "auth-toast",
      });
      router.replace("/login");
    } else {
      setIsAuthenticated(true);

      // Check if user just submitted a new RTI
      let recentSubmissionId: string | null = null;
      let submissionTime = 0;
      try {
        const stored = sessionStorage.getItem("new_rti_submission");
        if (stored) {
          const parsed = JSON.parse(stored);
          recentSubmissionId = parsed.id;
          submissionTime = parsed.timestamp;
        }
      } catch (e) {
        console.error(e);
      }

      fetch("/api/rti")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setReports(data.data);

            // If user just submitted this RTI, keep it in "Under Review" for 20 seconds
            if (recentSubmissionId) {
              const elapsedMs = Date.now() - submissionTime;
              const remainingMs = Math.max(0, 10000 - elapsedMs);

              if (remainingMs > 0) {
                setUnderReviewIds(new Set([recentSubmissionId]));

                toast(
                  "Your RTI is submitted. Please wait 10 seconds for the official response...",
                  {
                    id: "wait-10s",
                    icon: "⏳",
                    duration: 5000,
                  }
                );

                const timer = setTimeout(() => {
                  setUnderReviewIds(new Set());
                  sessionStorage.removeItem("new_rti_submission");
                  toast.success(
                    "Official RTI response is now ready to download!",
                    {
                      id: "ready-toast",
                      icon: "📄",
                    }
                  );
                }, remainingMs);

                return () => clearTimeout(timer);
              } else {
                sessionStorage.removeItem("new_rti_submission");
              }
            }
          }
        })
        .catch((err) => console.error("Failed to load RTIs:", err))
        .finally(() => setIsLoading(false));
    }
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ff5a2c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={poppins.className}>
      {/* Top Header */}
      <div className="px-4 sm:px-8 md:px-16 pt-6 sm:pt-8 mx-auto flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div>
          <h1
            className={`${anton.className} font-anton text-4xl sm:text-5xl leading-[0.85] sm:leading-[0.75] tracking-wide text-black inline-block border-b-4 sm:border-b-7 border-[#ff5a2c] pb-0`}
          >
            YOUR RTIs
          </h1>
          <p className="max-w-xl leading-relaxed mt-2 text-slate-700 text-xs sm:text-sm md:text-base">
            These are all the RTIs filed under your account.
          </p>
        </div>

        <div className="self-start sm:self-start shrink-0">
          <RTILogo size={13} />
        </div>
      </div>

      <div className="mx-4 sm:mx-8 md:mx-16 border-b-2 border-slate-600 mb-8 sm:mb-12 mt-2" />

      {/* Reports Section */}
      <div className="px-4 sm:px-8 md:px-16 pb-16">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-[#ff5a2c] animate-spin" />
            <p className="text-zinc-500 font-medium text-base">
              Fetching your RTI records...
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 px-6 text-center max-w-md mx-auto bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#fff2ec] flex items-center justify-center text-[#ff5a2c]">
              <FileText size={26} />
            </div>
            <h3 className={`${anton.className} font-anton text-2xl tracking-wide text-black mb-2`}>
              NO RTIs ISSUED
            </h3>
            <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
              No RTI is issued from this account yet.
            </p>
            <Link
              href="/submit-request"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff5a2c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e94b20] active:scale-[0.98] shadow-sm"
            >
              <span>File An RTI Request</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="px-0 sm:px-8 lg:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isUnderReview={
                  report.status === "pending" || underReviewIds.has(report.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
