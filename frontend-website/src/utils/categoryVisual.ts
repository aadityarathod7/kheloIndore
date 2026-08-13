export const getCategoryIcon = (category: string) => {
  const value = String(category || "").toLowerCase();
  if (value.includes("swim")) return "fas fa-swimmer";
  if (value.includes("tennis") || value.includes("badminton")) return "fas fa-table-tennis";
  if (value.includes("cricket") || value.includes("baseball")) return "fas fa-baseball-ball";
  if (value.includes("football") || value.includes("soccer") || value.includes("turf")) return "fas fa-futbol";
  if (value.includes("basket")) return "fas fa-basketball-ball";
  if (value.includes("gym") || value.includes("fitness")) return "fas fa-dumbbell";
  if (value.includes("shoot")) return "fas fa-bullseye";
  if (value.includes("yoga") || value.includes("zumba") || value.includes("dance")) return "fas fa-child";
  return "fas fa-running";
};

export const getCategoryStyle = (category: string) => {
  const value = String(category || "").toLowerCase();
  if (value.includes("swim")) return { color: "#0891B2", background: "#CFFAFE" };
  if (value.includes("basket")) return { color: "#DC2626", background: "#FEE2E2" };
  if (value.includes("tennis") || value.includes("badminton")) return { color: "#2563EB", background: "#DBEAFE" };
  return { color: "#16A34A", background: "#DCFCE7" };
};
