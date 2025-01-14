import {jsPDF} from "jspdf";

export function exportar (acta: any) {
        const pdf = new jsPDF()
        const presentes = acta.total - acta.ausentes
        let yPos = 90

        // Título
        pdf.setFontSize(18)
        pdf.text(`${acta.name} ${acta.id}`, 14, 15)

        // Información General
        pdf.setFontSize(14)
        pdf.text('Información General', 14, 25)
        pdf.setFontSize(10)
        pdf.text(`Núcleo: ${acta.core?.name}`, 14, 35)
        pdf.text(`Fecha: ${acta.fecha}`, 14, 40)
        pdf.text(`Lugar: ${acta.lugar}`, 14, 45)
        pdf.text(`Hora: ${acta.hora}`, 14, 50)

        // Asistencia
        pdf.setFontSize(14)
        pdf.text('Asistencia', 14, 60)
        pdf.setFontSize(10)
        pdf.text(`Total: ${acta.total}`, 14, 70)
        pdf.text(`Presentes: ${presentes}`, 14, 75)
        pdf.text(`Ausentes: ${acta.ausentes}`, 14, 80 )
        pdf.text(`Total de trabajadores presentes: ${acta.total_trabajador}`, 14, 85 )
        pdf.text(`Por el organismo superior: ${acta.total_organismo}`, 14, 90 )
        // acta.causas.forEach((causa) => {
        //   pdf.setFontSize(10)
        //   const splitCausa = pdf.splitTextToSize(causa, 180)
        //   pdf.text(splitCausa, 14, yPos+5)
        //   yPos += 20 + (splitCausa.length * 5)
        // })

        // Tema
        yPos += 5
        pdf.setFontSize(14)
        pdf.text('Tema evaluado en la reunión:', 14, yPos+5)
        pdf.setFontSize(10)
        const split = pdf.splitTextToSize(`${acta.tema}`, 180)
        pdf.text(split, 14, yPos+10)

        // Planteamiento
        pdf.setFontSize(14)
        pdf.text('Principales planteamientos realizados: ', 14, 120)
        yPos = 125
        acta.planteamientos.forEach((planteam) => {
            pdf.setFontSize(10)
            const splitAcuerdo = pdf.splitTextToSize(planteam, 180)
            pdf.text(splitAcuerdo, 14, yPos + 5)
            yPos += 20 + (splitAcuerdo.length * 5)
        })

        //Valoracion
        pdf.setFontSize(14)
        pdf.text('Valoración de la reunión: ', 14, yPos+5)
        pdf.setFontSize(10)
        yPos += 5
        pdf.text(`${acta.valoracion}`, 14, yPos+5 )

        yPos += 10
        pdf.setFontSize(12)
        pdf.text(`Orientador político:`, 14, yPos+5)
        pdf.setFontSize(10)
        pdf.text(`${acta.name_orientador}`, 14, yPos+10)
        yPos += 15
        pdf.setFontSize(12)
        pdf.text(`Secretario del núcleo:`, 14, yPos+5)
        pdf.setFontSize(10)
        pdf.text(`${acta.name_secretario}`, 14, yPos+10)

        // Guardar el PDF
        pdf.save(`Acta ${acta.core?.name}-${acta.fecha}.pdf`)
}