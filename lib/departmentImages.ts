export const DEPARTMENT_IMAGES: Record<string, string> = {
  // Food & Consumer Affairs
  "Ministry of Consumer Affairs, Food & Public Distribution":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  "Consumer Affairs":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",

  // Road Transport & Highways
  "Ministry of Road Transport and Highways":
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",

  // Health & Family Welfare
  "Ministry of Health & Family Welfare":
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",

  // Railways
  "Ministry of Railways":
    "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80",

  // Education
  "Ministry of Education":
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",

  // Finance & Corporate Affairs
  "Ministry of Finance & Corporate Affairs":
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",

  // Water Resources / Jal Shakti
  "Ministry of Jal Shakti (Water Resources)":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",

  // Environment & Forest
  "Ministry of Environment, Forest & Climate Change":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",

  // Electronics & IT
  "Ministry of Electronics & Information Technology":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",

  // Telecommunications
  "Department of Telecommunications":
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",

  // Home Affairs
  "Ministry of Home Affairs":
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",

  // Defense
  "Ministry of Defense":
    "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",

  // Housing & Urban Affairs
  "Ministry of Housing & Urban Affairs":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
};

export function getDepartmentImageUrl(departmentName?: string): string {
  if (!departmentName) return "/supreme-court.png";

  if (DEPARTMENT_IMAGES[departmentName]) {
    return DEPARTMENT_IMAGES[departmentName];
  }

  const lower = departmentName.toLowerCase();

  if (lower.includes("food") || lower.includes("consumer") || lower.includes("grain") || lower.includes("agriculture")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"; // Food, grains, vegetables
  }
  if (lower.includes("road") || lower.includes("transport") || lower.includes("highway")) {
    return "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"; // Highway & roads
  }
  if (lower.includes("health") || lower.includes("medical") || lower.includes("hospital") || lower.includes("family")) {
    return "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"; // Medical & health
  }
  if (lower.includes("rail") || lower.includes("train")) {
    return "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80"; // Railways
  }
  if (lower.includes("educat") || lower.includes("school") || lower.includes("college")) {
    return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"; // Education
  }
  if (lower.includes("financ") || lower.includes("tax") || lower.includes("bank") || lower.includes("corporate")) {
    return "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"; // Finance & economy
  }
  if (lower.includes("water") || lower.includes("jal") || lower.includes("river")) {
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"; // Water
  }
  if (lower.includes("environ") || lower.includes("forest") || lower.includes("climate")) {
    return "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"; // Forests & nature
  }
  if (lower.includes("electr") || lower.includes("tech") || lower.includes("telecom") || lower.includes("it")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"; // Technology & telecom
  }
  if (lower.includes("defen") || lower.includes("home") || lower.includes("police")) {
    return "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80"; // Monument / Security
  }
  if (lower.includes("housing") || lower.includes("urban") || lower.includes("city")) {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"; // Urban development
  }

  return "/supreme-court.png";
}
