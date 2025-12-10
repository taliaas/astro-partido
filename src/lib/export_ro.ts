import type Minute from "@/interface/Minute";
import { jsPDF } from "jspdf";

export function exportarRO(acta: Minute) {
  const pdf = new jsPDF();
  let yPosition = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;

  // Función para verificar si un valor está vacío o nulo
  const isEmpty = (value: any): boolean => {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    );
  };

  // Función para añadir texto con manejo de campos vacíos
  const addText = (label: string, value: any, isBold = false) => {
    if (value !== null && value !== undefined && value !== "") {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");

      // Si el valor es muy largo, dividirlo en líneas
      const text = `${label}: ${value}`;
      const lines = pdf.splitTextToSize(text, contentWidth);

      // Si no hay espacio suficiente, añadir nueva página
      if (yPosition + lines.length * lineHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }

      lines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    }
  };

  // Función para añadir título de sección
  const addSectionTitle = (title: string) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, yPosition);
    yPosition += 10;
  };

  // ========== ENCABEZADO DEL ACTA ==========
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("ACTA DE REUNIÓN", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Información básica
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("INFORMACIÓN BÁSICA", margin, yPosition);
  yPosition += 10;

  addText("Nombre del Acta", acta.name, false);
  if (acta.core && !isEmpty(acta.core))
    addText("Nombre del Núcleo", acta.core.name, true);
  addText(
    "Fecha",
    acta.date ? new Date(acta.date).toLocaleDateString() : null,
    false
  );
  addText("Hora", acta.hour, false);
  addText("Lugar", acta.place, false);
  addText("Tipo de Reunión", acta.type, false);
  addText("Estado", acta.status, false);
  addText(
    "Fecha de Creación",
    acta.createdAt ? new Date(acta.createdAt).toLocaleDateString() : null,
    false
  );

  // ========== ASISTENCIA ==========
  addSectionTitle("ASISTENCIA");

  // Miembros presentes (del núcleo)
  if (acta.abscents && acta.abscents.length > 0) {
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Relación de asistencia:", margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont("helvetica", "normal");
    acta.abscents.forEach((abscent: any, index: number) => {
      if (!isEmpty(abscent.estado)) {
        pdf.setFont("helvetica", "normal");
        let absenciaText = ` ${abscent.estado}`;

        if (!isEmpty(abscent.reason)) {
          absenciaText += ` - Razón: ${abscent.reason}`;
        }

        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(
          `${index + 1}. ${abscent.militant.firstname || ""} ${abscent.militant.lastname || ""} ${absenciaText}`,
          margin + 10,
          yPosition
        );
      }
      yPosition += lineHeight;
    });
  }

  // ========== ORDEN DEL DÍA ==========
  if (acta.ordinary && acta.ordinary.order && acta.ordinary.order.length > 0) {
    addSectionTitle("ORDEN DEL DÍA");

    acta.ordinary.order.forEach((item: string, index: number) => {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${index + 1}. ${item}`, margin, yPosition);
      yPosition += lineHeight;
    });
  }

  // ========== DESARROLLO ==========
  if (
    acta.ordinary &&
    acta.ordinary.development &&
    acta.ordinary.development.length > 0
  ) {
    addSectionTitle("DESARROLLO DE LA REUNIÓN");

    acta.ordinary.development.forEach((desarrollo: any, index: number) => {
      if (!isEmpty(desarrollo.content)) {
        yPosition += 5;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`Punto ${index + 1}:`, margin, yPosition);
        yPosition += lineHeight;

        // Contenido del punto
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        const contentLines = pdf.splitTextToSize(
          desarrollo.content,
          contentWidth
        );

        contentLines.forEach((line: string) => {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        // Acuerdos de este punto
        if (desarrollo.agreements && desarrollo.agreements.length > 0) {
          yPosition += 5;
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.text("Acuerdos:", margin, yPosition);
          yPosition += lineHeight;

          desarrollo.agreements.forEach(
            (acuerdo: any, acuerdoIndex: number) => {
              pdf.setFont("helvetica", "normal");

              // Descripción del acuerdo
              if (!isEmpty(acuerdo.descripcion)) {
                if (yPosition > 280) {
                  pdf.addPage();
                  yPosition = 20;
                }
                pdf.text(
                  `${acuerdoIndex + 1}. ${acuerdo.descripcion}`,
                  margin + 10,
                  yPosition
                );
                yPosition += lineHeight;
              }

              // Responsable
              if (acuerdo.responsable && !isEmpty(acuerdo.responsable)) {
                const responsableText = `   Responsable: ${acuerdo.responsable.firstname || ""} ${acuerdo.responsable.lastname || ""}`;
                if (yPosition > 280) {
                  pdf.addPage();
                  yPosition = 20;
                }
                pdf.text(responsableText, margin + 10, yPosition);
                yPosition += lineHeight;
              }

              // Fecha de vencimiento
              if (!isEmpty(acuerdo.enddate)) {
                const fechaText = `   Fecha límite: ${new Date(acuerdo.enddate).toLocaleDateString()}`;
                if (yPosition > 280) {
                  pdf.addPage();
                  yPosition = 20;
                }
                pdf.text(fechaText, margin + 10, yPosition);
                yPosition += lineHeight;
              }

              // Estado
              if (!isEmpty(acuerdo.status)) {
                const estadoText = `   Estado: ${acuerdo.status}`;
                if (yPosition > 280) {
                  pdf.addPage();
                  yPosition = 20;
                }
                pdf.text(estadoText, margin + 10, yPosition);
                yPosition += lineHeight;
              }

              yPosition += 3; // Espacio entre acuerdos
            }
          );
        }

        yPosition += 10; // Espacio entre puntos de desarrollo
      }
    });
  }

  // ========== OBSERVACIONES ==========
  if (!isEmpty(acta.observaciones)) {
    addSectionTitle("OBSERVACIONES GENERALES");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const observacionesLines = pdf.splitTextToSize(
      acta.observaciones ?? "",
      contentWidth
    );

    observacionesLines.forEach((line: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  }

  // ========== FECHAS IMPORTANTES ==========
  if (
    acta.ordinary &&
    (acta.ordinary.fechaProx ||
      acta.ordinary.fechaPrep ||
      acta.ordinary.fechaCP)
  ) {
    addSectionTitle("FECHAS IMPORTANTES");

    if (!isEmpty(acta.ordinary.fechaProx)) {
      addText(
        "Próxima reunión",
        acta.ordinary.fechaProx
          ? new Date(acta.ordinary.fechaProx).toLocaleDateString()
          : null,
        false
      );
    }

    if (!isEmpty(acta.ordinary.fechaPrep)) {
      addText(
        "Fecha de preparación",
        acta.ordinary.fechaPrep
          ? new Date(acta.ordinary.fechaPrep).toLocaleDateString()
          : null,
        false
      );
    }

    if (!isEmpty(acta.ordinary.fechaCP)) {
      addText(
        "Fecha CP",
        acta.ordinary.fechaCP
          ? new Date(acta.ordinary.fechaCP).toLocaleDateString()
          : null,
        false
      );
    }
  }

  // ========== PIE DE PÁGINA ==========
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, {
      align: "center",
    });

    // Fecha de generación
    pdf.text(`Generado el: ${new Date().toLocaleDateString()}`, margin, 290);
  }

  // Guardar el PDF
  const fileName =
    `${acta.name || "acta"}-${acta.date || acta.createdAt || "sin-fecha"}.pdf`.replace(
      /[^a-zA-Z0-9-_\.]/g,
      "-"
    ); // Limpiar caracteres inválidos

  pdf.save(fileName);
}
