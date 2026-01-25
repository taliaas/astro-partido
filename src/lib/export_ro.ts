import type Minute from "@/interface/Minute";
import { jsPDF } from "jspdf";

export function exportarRO(minute: Minute) {
  const pdf = new jsPDF();

  pdf.save(`RO_${minute.core?.name}-${minute.date}.pdf`);
}
