import { jsPDF } from "jspdf";

export function exportarRO(acta: any) {
  const pdf = new jsPDF();
  let yPos = 5;

  // Título
  pdf.setFontSize(18);
  pdf.text(`Acta ${acta.name} ${acta.id}`, 14, 15);

  // Información General
  pdf.setFontSize(12);
  pdf.text(`Núcleo: ${acta.core?.name}`, 14, 20);
  const text = `En la CUJAE, Municipio Marianao, el día ${acta.fecha} a las ${acta.hora}, en ${acta.lugar} se reúne el núcleo del PCC, siendo presidida por el compañero ${acta.secretarioGeneral}, en su carácter de Secretario General del núcleo. Se encuentran presentes ${acta.fecha} miembros de un total de ${acta.militantes?.length} posibles para un ${acta.fecha}% de asistencia. `;
  const splitIntro = pdf.splitTextToSize(text, 180);
  pdf.text(splitIntro, 14, 30);
  yPos += 35 + splitIntro.length * 5;

  //tabla de militantes
  // pdf.addImage()

  //invitados o participantes

  // Orden del día
  pdf.setFontSize(14);
  pdf.text("Orden del día", 14, yPos + 5);
  yPos += 5;
  acta.order.forEach((item: any, index: number) => {
    pdf.setFontSize(10);
    const split = pdf.splitTextToSize(item, 180);
    pdf.text(`${index + 1}. ${item}`, 14, yPos + 5);
    yPos += 5;
  });
  pdf.addPage();
  // Desarrollo de la reunión
  pdf.setFontSize(14);
  pdf.text("Desarrollo de la reunión", 14, 15);

  // Chequeo de acuerdos
  pdf.setFontSize(12)
  pdf.text("Chequeo de acuerdos", 14, 25)
  pdf.setFontSize(10)
  const splitChequeo = pdf.splitTextToSize(acta.chequeo, 180)
  pdf.text(splitChequeo, 14, 30)

  // Orientaciones y Análisis
  pdf.setFontSize(12);
  pdf.text("Orientaciones del Organismo Superior", 14, 45);
  pdf.setFontSize(10);
  const splitOrientaciones = pdf.splitTextToSize(acta.orientaciones, 180);
  pdf.text(splitOrientaciones, 14, 50);

  pdf.setFontSize(12);
  pdf.text("Análisis", 14, 60);
  pdf.setFontSize(10);
  const splitAnalisis = pdf.splitTextToSize(acta.analisis, 180);
  pdf.text(splitAnalisis, 14, 65)

  // Acuerdos
  pdf.setFontSize(12);
  pdf.text("Acuerdos", 14, 75);
  yPos = 80
  acta.agreements?.forEach((acuerdo: any) => {
    pdf.setFontSize(11);
    const splitAcuerdo = pdf.splitTextToSize(acuerdo.descripcion, 180);
    pdf.text(`Responsable: ${splitAcuerdo}`, 14, yPos + 5);
    pdf.text(
        `Responsable: ${acuerdo.responsable} | Fecha de cumplimiento: ${acuerdo.fecha}`,
        14,
        yPos + 10 + splitAcuerdo.length * 5,
    );
    yPos += 20 + splitAcuerdo.length * 5;
  });
  // Salidas al extranjero
  pdf.setFontSize(14);
  yPos += 5
  pdf.text("5. Salidas al extranjero", 14, yPos+5);
  yPos += 5;
  acta.extranjero?.forEach((salida: any) => {
    pdf.setFontSize(11);
    yPos += 5
    pdf.text(`Salida: ${salida.id}`, 14, yPos + 5);
    pdf.text(`Nombre: ${salida.nombre}`, 14, yPos + 10);
    pdf.text(`Motivo de viaje: ${salida.motivo}`, 14, yPos + 15);
    pdf.setFontSize(10);
    pdf.text(`País: ${salida.destino} | Fecha: ${salida.fechaIda} - ${salida.fechaRegreso}`, 14, yPos + 20);
    pdf.text(`Estado: ${salida.estado}`, 14, yPos + 25);
    yPos += 20
  });

  // Próximas fechas
  pdf.setFontSize(14);
  yPos += 10;
  pdf.text("Próximas fechas", 14, yPos + 5);
  pdf.setFontSize(10);
  pdf.text(
    `Fecha de la Próxima Reunión Ordinaria: ${acta.fechaProx}`,
    14,
    yPos + 10,
  );
  pdf.text(
    `Fecha de la Preparación de la Próxima Reunión Ordinaria: ${acta.fechaPrep}`,
    14,
    yPos + 15,
  );
  pdf.text(
    `Fecha del Próximo Círculo de Estudios Políticos: ${acta.fechaCP}`,
    14,
    yPos + 20,
  );

  // Guardar el PDF
  pdf.save(`${acta.name}-${acta.fecha}.pdf`);
}
