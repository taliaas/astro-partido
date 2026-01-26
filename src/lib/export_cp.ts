import type Minute from "@/interface/Minute";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportarCP(minute: Minute) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;

  // Encabezado
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `ACTA ${minute.type ? "CÍRCULO POLÍTICO" : "EXTRAORDINARIA"} DE ${minute.core?.name || "-"}`,
    pageWidth / 2,
    yPosition,
    {
      align: "center",
    },
  );
  yPosition += 10;

  // Información general
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
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
    // Columna izquierda
    pdf.setFont("helvetica", "bold");
    pdf.text(infoData[i][0], col1X, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(infoData[i][1], col1X + 35, yPosition);

    // Columna derecha
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
      att.militant?.firstname || "N/A",
      att.militant?.lastname || "N/A",
      att.estado || "N/A",
      att.reason || "N/A",
    ]);

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

  // Sección Política (Desarrollo)
  if (minute.political) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 15;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(`TEMA: ${minute.political.topic || "No hay tema"}`, 15, yPosition);
    yPosition += 8;

    minute.political.development.forEach((dev, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(
        `${index + 1}. ${dev.militant?.firstname || "Participante"}`,
        15,
        yPosition,
      );
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const splitText = pdf.splitTextToSize(dev.argument || "", pageWidth - 30);
      pdf.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 5;
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
    pdf.text(splitObs, 20, yPosition);
  }

  // Guardar el PDF
  const fecha = minute.date
    ? new Date(minute.date).toISOString().split("T")[0]
    : "sin-fecha";
  pdf.save(`CP_${minute.core?.name}_${fecha}.pdf`);
}
