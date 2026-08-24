import Link from "next/link";
import { Poppins, Anton } from "next/font/google";
import RTILogo from "@/components/RTILogo";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
}

const mockReports: ReportItem[] = [
  {
    id: "1",
    title: "Food Supply by Gov in 2025",
    image: "/supreme-court.png",
    status: "completed",
    date: "12 Jan 2025",
    refNumber: "RTI/2025/FS-902",
    department: "Ministry of Consumer Affairs",
  },
  {
    id: "2",
    title: "Highway Budget & Toll Allocation",
    image: "/supreme-court.png",
    status: "completed",
    date: "28 Jan 2025",
    refNumber: "RTI/2025/NH-418",
    department: "Ministry of Road Transport",
  },
  {
    id: "3",
    title: "AIIMS Medical Equipment Audit",
    image: "/supreme-court.png",
    status: "pending",
    date: "04 Feb 2025",
    refNumber: "RTI/2025/MH-102",
    department: "Ministry of Health",
  },
];

interface ReportCardProps {
  report: ReportItem;
}

function ReportCard({ report }: ReportCardProps) {
  const isCompleted = report.status === "completed";

  return (
    <div
      className={`flex flex-col justify-between overflow-hidden rounded-2xl p-3.5 shadow-lg ${
        isCompleted
          ? "bg-[#ff5a2f]"
          : "bg-[#161618] border border-zinc-800"
      }`}
    >
      {/* Top Image */}
      <div className="overflow-hidden rounded-xl bg-black/10">
        <img
          src={report.image}
          alt={report.title}
          className="h-[320px] w-full object-cover"
        />
      </div>

      {/* Card Body */}
      <div className="px-1 pt-3.5 pb-2">
        <div
          className={`flex items-center justify-between text-xs font-medium mb-1.5 ${
            isCompleted ? "text-white/80" : "text-zinc-400"
          }`}
        >
          <span>{report.department}</span>
          <span>{report.date}</span>
        </div>

        <h2
          className={`${anton.className} text-2xl sm:text-3xl leading-[1.05] tracking-wide text-white line-clamp-2`}
        >
          {report.title}
        </h2>
      </div>

      {/* Action Button */}
      {isCompleted ? (
        <button className="cursor-pointer mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white font-bold text-[#222222] shadow-sm transition-colors hover:bg-gray-100 active:scale-[0.98]">
          <FileText size={18} className="text-[#ff5a2f]" />
          <span>Download PDF</span>
        </button>
      ) : (
        <button className="cursor-default mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 font-semibold text-zinc-200 shadow-sm">
          <Clock size={17} className="text-amber-400" />
          <span>Under Review</span>
        </button>
      )}
    </div>
  );
}

export default function History() {
  return (
    <div className={poppins.className}>
      {/* Top Header */}
      <div className="px-8 sm:px-16 py-8 mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`${anton.className} text-5xl leading-[0.75] tracking-wide text-black inline-block border-b-7 border-[#ff5a2c] pb-0`}
          >
            YOUR RTIs
          </h1>
          <p className="max-w-xl leading-relaxed mt-4 text-slate-700 text-sm sm:text-base">
            These are all the RTIs filed under your account. You can track pending
            applications or download official completed reports directly.
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <RTILogo size={13} />
          </Link>
        </div>
      </div>

      {/* Reports Grid - 3 cards per row */}
      <div className="px-8 sm:px-16 pb-16">
        <div className="px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}

// todo: add logo as per Ministry Department
