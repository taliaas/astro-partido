import {jsPDF} from "jspdf";

export function exportarRO (acta: any)  {
    const pdf = new jsPDF()
    let yPos = 5

    // Título
    pdf.setFontSize(18)
    pdf.text(`Acta ${acta.name} ${acta.id}`, 14, 15)
    pdf.text(`Núcleo: ${acta.core?.name}`, 14, 20)

    // Información General
    pdf.setFontSize(12)
    const text = `En la CUJAE, Municipio Marianao, el día ${acta.fecha} a las ${acta.hora}, en ${acta.lugar} se reúne el núcleo del PCC, siendo presidida por el compañero ${acta.secretarioGeneral}, en su carácter de Secretario General del núcleo. Se encuentran presentes ${acta.fecha} miembros de un total de ${acta.militantes?.length} posibles para un ${acta.fecha}% de asistencia. `
    const splitIntro = pdf.splitTextToSize(text, 180)
    pdf.text(splitIntro, 14, 30)
    yPos +=  35 + (splitIntro.length * 5)

    //tabla de militantes
   // pdf.addImage()

    //invitados o participantes

    // Orden del día
    // pdf.setFontSize(14)
    // pdf.text('Orden del día', 14, yPos+5)
    // yPos += 5
    // acta.order.forEach((item: any, index: number) => {
    //     pdf.setFontSize(10)
    //     const split = pdf.splitTextToSize(item, 180)
    //     pdf.text(`${index + 1}. ${item}`, 14, yPos + 5)
    //     yPos += 20 + (split.length * 5)
    // })
    //
    // // Desarrollo de la reunión
    pdf.addPage()
     pdf.setFontSize(14)
     pdf.text('Desarrollo de la reunión', 14, 15)

    // Chequeo de acuerdos
     yPos += 5
     pdf.setFontSize(12)
     pdf.text('1. Chequeo de acuerdos', 14, yPos + 5)
     acta.chequeo?.forEach((item: any, index: number) => {
         yPos = yPos + (index * 5)
         pdf.setFontSize(10)
         const splitChequeo = pdf.splitTextToSize(acta.chequeo, 180)
         pdf.text(splitChequeo, 14, yPos + 5)
         pdf.text(`${item}`, 14, yPos + 5)
     })

     // Orientaciones y Análisis
     yPos += 5
     pdf.setFontSize(12)
     pdf.text('2. Orientaciones del Organismo Superior', 14, yPos + 5)
     pdf.setFontSize(10)
     const splitOrientaciones = pdf.splitTextToSize(acta.orientaciones, 180)
     pdf.text(splitOrientaciones, 14, yPos+10)

     pdf.setFontSize(12)
     pdf.text('3. Análisis', 14, 25 + (splitOrientaciones.length * 5) + 10)
     pdf.setFontSize(10)

     // Acuerdos
     pdf.setFontSize(14)
     pdf.text('4. Acuerdos', 14, yPos+10)
     yPos += 15
     acta.agreements.forEach((acuerdo:any, index:number) => {
        pdf.setFontSize(11)
        pdf.text(`Acuerdo ${index + 1}:`, 14, yPos+5)
        pdf.setFontSize(10)
        const splitAcuerdo = pdf.splitTextToSize(acuerdo, 180)
        pdf.text(splitAcuerdo, 14, yPos + 5)
        pdf.text(`Responsable: ${acuerdo.responsable} | Fecha de cumplimiento: ${acuerdo.fecha}`, 14, yPos + 10 + (splitAcuerdo.length * 5))
        yPos += 20 + (splitAcuerdo.length * 5)
    })

    // // Salidas al extranjero
    // pdf.setFontSize(14)
    // pdf.text('5. Salidas al extranjero', 14, 15)
    // yPos = 25
    // acta.extranjero.forEach((salida: any, index:number) => {
    //     pdf.setFontSize(11)
    //     pdf.text(`Salida ${index + 1}:`, 14, yPos+5)
    //     pdf.setFontSize(10)
    //     pdf.text(`País: ${salida.pais} | Fecha: ${salida.fecha}`, 14, yPos + 5)
    //     const splitAcuerdo = pdf.splitTextToSize(salida.acuerdo, 180)
    //     pdf.text(`Acuerdo: ${splitAcuerdo}`, 14, yPos + 10)
    //     yPos += 20 + (splitAcuerdo.length * 5)
    // })
    //
    // // Próximas fechas
    // pdf.setFontSize(14)
    // yPos +=10
    // pdf.text('Próximas fechas', 14,  yPos+5)
    // pdf.setFontSize(10)
    // pdf.text(`Fecha de la Próxima Reunión Ordinaria: ${acta.fechaProx}`, 14, yPos + 10)
    // pdf.text(`Fecha de la Preparación de la Próxima Reunión Ordinaria: ${acta.fechaPrep}`, 14, yPos + 15)
    // pdf.text(`Fecha del Próximo Círculo de Estudios Políticos: ${acta.fechaCP}`, 14, yPos + 20)

    // Guardar el PDF
    pdf.save(`Acta ${acta.core?.name}-${acta.fecha}.pdf`)
}