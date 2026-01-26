import { StatusAtte } from "@/enum/Estado";
import type Minute from "@/interface/Minute";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportarRO(minute: Minute) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;

  // Encabezado
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `ACTA ORDINARIA DEL ${minute.core?.name || "-"}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );
  yPosition += 10;

  // Información general
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  //ausentes, total, porciento, fechaCP, fechaPP, fechaProx
  const infoData = [
    [
      "Fecha:",
      minute.date ? new Date(minute.date).toLocaleDateString() : "N/A",
    ],
    ["Hora:", minute.hour || "N/A"],
    ["Núcleo:", minute.core?.name || "N/A"],
    ["Lugar:", minute.place || "N/A"],
    [
      "Creada:",
      minute.createdAt
        ? new Date(minute.createdAt).toLocaleDateString()
        : "N/A",
    ],
    ["Autor:", minute.owner?.email || "N/A"],
  ];

  // Mostrar info en dos columnas
  const col1X = 15;
  const col2X = pageWidth / 2 + 5;
  const rowHeight = 7;
  const half = Math.ceil(infoData.length / 2);
  for (let i = 0; i < half; i++) {
    pdf.setFont("helvetica", "bold");
    pdf.text(infoData[i][0], col1X, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(infoData[i][1], col1X + 35, yPosition);
    if (infoData[i + half]) {
      pdf.setFont("helvetica", "bold");
      pdf.text(infoData[i + half][0], col2X, yPosition);
      pdf.setFont("helvetica", "normal");
      pdf.text(infoData[i + half][1], col2X + 35, yPosition);
    }
    yPosition += rowHeight;
  }
  yPosition += 5;

  // Sección de Asistencia
  if (minute.abscents && minute.abscents.length > 0) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("ASISTENCIA", 15, yPosition);
    yPosition += 8;
    const attendanceData = minute.abscents.map((att) => [
      att.militant?.firstname || "-",
      att.militant?.lastname || "-",
      att.estado || "-",
      att.reason || "-",
    ]);
    // ajustar porque sale el reason cuando es presente
    autoTable(pdf, {
      head: [["Nombre", "Apellido", "Estado", "Causa"]],
      body: attendanceData,
      startY: yPosition,
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Sección de Invitados
  if (minute.invitados && minute.invitados.length > 0) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("INVITADOS", 15, yPosition);
    yPosition += 8;
    const invitadosData = minute.invitados.map((inv) => [
      inv.nombre_apellidos || "N/A",
      inv.cargo || "N/A",
    ]);
    autoTable(pdf, {
      head: [["Nombre", "Cargo"]],
      body: invitadosData,
      startY: yPosition,
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Desarrollo del acta ordinaria
  if (
    minute.ordinary &&
    minute.ordinary.development &&
    minute.ordinary.development.length > 0
  ) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("DESARROLLO", 15, yPosition);
    yPosition += 8;
    minute.ordinary.development.forEach((dev, idx) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`${idx + 1}. ${dev.order || "Punto"}`, 15, yPosition);
      yPosition += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      // Justificado
      const splitText = pdf.splitTextToSize(dev.content || "", pageWidth - 30);
      let yText = yPosition;
      splitText.forEach((line: any) => {
        justifyText(pdf, line, 20, yText, pageWidth - 30);
        yText += 5;
      });
      yPosition = yText + 2;
    });
  }

  // Observaciones
  if (minute.observaciones) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 15;
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("OBSERVACIONES", 15, yPosition);
    yPosition += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const splitObs = pdf.splitTextToSize(minute.observaciones, pageWidth - 30);
    let yText = yPosition;
    splitObs.forEach((line: any) => {
      justifyText(pdf, line, 20, yText, pageWidth - 30);
      yText += 5;
    });
    yPosition = yText + 2;
  }

  // Guardar el PDF
  const fecha = minute.date
    ? new Date(minute.date).toISOString().split("T")[0]
    : "sin-fecha";
  pdf.save(`RO_${minute.core?.name}_${fecha}.pdf`);
}

// Función para justificar texto en jsPDF
function justifyText(pdf: any, text: any, x: any, y: any, width: any) {
  const words = text.split(" ");
  let line = "";
  let testLine = "";
  let lineArray = [];
  for (let n = 0; n < words.length; n++) {
    testLine += words[n] + " ";
    const testWidth = pdf.getTextWidth(testLine);
    if (testWidth > width && n > 0) {
      lineArray.push(line.trim());
      line = words[n] + " ";
      testLine = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lineArray.push(line.trim());
  lineArray.forEach((l) => {
    const textWidth = pdf.getTextWidth(l);
    let spaceCount = l.split(" ").length - 1;
    let extraSpace = spaceCount > 0 ? (width - textWidth) / spaceCount : 0;
    let currX = x;
    l.split(" ").forEach((word, idx, arr) => {
      pdf.text(word, currX, y, { baseline: "top" });
      currX += pdf.getTextWidth(word + " ");
      if (idx < arr.length - 1) currX += extraSpace;
    });
    y += 5;
  });
}
