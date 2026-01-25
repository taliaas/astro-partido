import type Minute from "@/interface/Minute";
import { jsPDF } from "jspdf";

export function exportarCP(minute: Minute) {
  const pdf = new jsPDF();

  // Guardar el PDF
  pdf.save(`CP_${minute.core?.name}-${minute.date}.pdf`);
}
