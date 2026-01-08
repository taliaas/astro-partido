import type { Computo } from "@/interface/Indicadores";
import ExcelJS, { type Workbook } from "exceljs";
import { toast } from "vue-sonner";

export interface DataComputo {
  core: string;
  date: string;
  createdAt: string;
  militants: number;
  militants_minute: number;
  difference: number;
}

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function buildExcel(computos: Computo[], month: string) {
  // if (!computos) {
  //   toast.info("No hay cómputos para este mes");
  // }
  const workbook = new ExcelJS.Workbook();
  workbook.calcProperties.fullCalcOnLoad = true;
  const asistenciaWorkSheet = buildAsistenciaSheet(workbook, month);
  computos.forEach((computo, index) => {
    const total = computo.minute?.core?.militants?.length ?? 0;
    const parte =
      computo.indicators.find((ind) => ind.key === "asistencia")?.value ?? 0;
    const resto = total - parte;
    asistenciaWorkSheet.addRow([
      index + 1,
      computo.minute.core?.comite.name,
      computo.minute.core?.name,
      computo.minute.date,
      computo.minute.createdAt,
      total,
      parte,
      resto,
    ]);
  });
  const computoWorkSheet = buildComputoSheet(workbook, month);
  return workbook;
}

function buildAsistenciaSheet(workbook: Workbook, month: string) {
  const worksheet = workbook.addWorksheet(`Asistencia`);
  const $ = (key: string) => worksheet.getCell(key);

  worksheet.columns = [
    { key: "no", width: 5 },
    { key: "cores", width: 10 },
    { key: "date", width: 25 },
    { key: "createdAt", width: 30 },
    { key: "edad", width: 10 },
    { key: "fechaRegistro", width: 15 },
  ];

  worksheet.mergeCells("B1:C1");
  $("B1").value = `Mes: ${meses[Number(month) - 1]}`;

  worksheet.mergeCells("D1:H1");
  $("D1").value = "CONTROL ASISTENCIA MILITANCIA PCC";
  $("D1").font = {
    bold: true,
    color: { argb: "FF0000" },
    size: 14,
  };

  worksheet.getRow(2).height = 40;
  worksheet.mergeCells("B2:H2");
  $("B2").value =
    'UNIVERSIDAD TECNOLÓGICA DE LA HABANA  "JOSÉ ANTONIO ECHEVERRÍA". CUJAE';
  $("B2").font = {
    color: { argb: "FF0000" },
    bold: true,
    size: 14,
    name: "Arial",
  };

  worksheet.mergeCells("B3:C4");
  $("C3").value = "Núcleos";

  worksheet.mergeCells("D3:D4");
  $("D3").value = "Fecha de Reunion";

  worksheet.mergeCells("E3:E4");
  $("E3").value = "Fecha de Entrega";

  worksheet.mergeCells("F3:H3");
  $("F3").value = "Total militantes";
  $("F4").value = "INFOEST";
  $("G4").value = "por Acta";
  $("H4").value = "Dif";

  worksheet.getRows(1, 4)?.forEach((r) => {
    r.eachCell(
      (c) =>
        (c.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        })
    );
  });
  return worksheet;
}

function colToLetter(colNum: number) {
  let letter = "";
  while (colNum > 0) {
    const remainder = (colNum - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return letter;
}

function buildComputoSheet(workbook: Workbook, month: string) {
  const worksheet = workbook.addWorksheet("Computo");
  const $ = (key: string) => worksheet.getCell(key);

  worksheet.mergeCells("B1:BG1");
  $("B1").value =
    'UNIVERSIDAD TECNOLÓGICA DE LA HABANA  "JOSÉ ANTONIO ECHEVERRÍA". CUJAE';
  $("B1").font = {
    color: { argb: "FF0000" },
    bold: true,
    size: 14,
    name: "Arial",
  };
  worksheet.getRow(2).height = 30;
  worksheet.mergeCells("B2:BG2");
  $("B2").value =
    "De los temas debatidos en la Reunión Ordinaria  clasifíquelos en :";
  $("B2").font = { bold: true, size: 12, name: "Arial" };

  worksheet.getRow(3).values = [
    "NO.",
    "",
    "",
    "Ptos Orden Día",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Acuerdo salidas ext",
    "Guardia PCC",
    "Otros temas",
    "Otros acuerdos guardia + otros temas",
    "Total acuerdos",
    "",
    "",
    "",
    "Fecha próxima",
    "Ver Acta cte CUJAE",
  ];

  worksheet.getRow(3).border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };

  // worksheet.mergeCells("B3:C4");
  worksheet.mergeCells("E3:F3");
  worksheet.mergeCells("G3:K3");
  worksheet.mergeCells("L3:O3");
  worksheet.mergeCells("P3:AE3");
  worksheet.mergeCells("AF3:AO3");
  worksheet.mergeCells("AP3:AX3");
  worksheet.mergeCells("BD3:BF3");

  $("B3").value = "Núcleos";
  $("E3").value = "Particip. Org Sup";
  $("G3").value = "Invitados";
  $("L3").value = "Rendición Cuentas";
  $("P3").value = "Funcionamiento PCC";
  $("AF3").value = "Procesos Específicos";
  $("AP3").value = "TPI";
  $("BD3").value = "Otras reuniones extraordinarias";

  worksheet.getRow(4).values = [
    "",
    "",
    "",
    "",
    "Cté CUJAE",
    "Mov por Org.",
    "Invitados de la  UJC o FEU",
    "Invitados  Trabaj",
    "Inv/ S. Sindical",
    "Invitados Administrativos",
    "total Invit.",
    "Militantes",
    "Organizaciones y otros",
    "Dirig Adm",
    "Acuerdo R\C",
    "Chequeo de acuerdos",
    "Impl. ortcs Org Sup",
    "Análisis Aus. R/O",
    "Otros Análisis Discp",
    "Análisis Act Ftal",
    "Acuerd/act ftal",
    "Discus. Delito, corrup, ilegalid",
    "Acuerd/delito",
    "Uso comisiones",
    "Polít de cuadros",
    "Reglam, Estatutos",
    "Plan de Trab",
    "Functo PCC",
    "Evaluación",
    "Traslados e incorporación",
    "Otros acuerd/functo",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Sanciones",
    "Desactivación",
    "Acuerdos  P/Específicos",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "sanciones",
    "crecimiento",
    "salidas al exterior",
  ];

  worksheet.mergeCells("A3:A6");
  worksheet.mergeCells("B3:C6");
  worksheet.mergeCells("D3:D6");
  worksheet.mergeCells("AY3:AY6");
  worksheet.mergeCells("AZ3:AZ6");
  worksheet.mergeCells("BA3:BA6");
  worksheet.mergeCells("BB3:BB6");
  worksheet.mergeCells("BC3:BC6");
  worksheet.mergeCells("BG3:BG6");
  worksheet.mergeCells("BI3:BH6");

  // Merge desde columna 5 (E) hasta columna 41 (AO)
  for (let col = 5; col <= 31; col++) {
    const colLetter = colToLetter(col);
    worksheet.mergeCells(`${colLetter}4:${colLetter}6`);
  }

  worksheet.mergeCells("AM4:AM6");
  worksheet.mergeCells("AN4:AN6");
  worksheet.mergeCells("AO4:AO6");

  worksheet.mergeCells("AF4:AL4");
  $("AF4").value = "Crecimiento";

  worksheet.mergeCells("AP4:AS4");
  $("AP4").value = "Atenc organizcs";

  worksheet.mergeCells("AT4:AX4");
  $("AT4").value = "CÍRCULO POLÍTICO";

  worksheet.getRow(5).values = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "socio-político",
    "posibles crecimientos",
    "A/Ejem o   C/Masas",
    "total iniciados",
    "otros pasos",
    "p/v o detenidos",
    "r/aprobación",
    "",
    "",
    "",
    "Atención FEU",
    "Atención UJC",
    "Functo Sind",
    "acuerdos/atenc organizcs",
    "reunión ordinaria",
    "Reunión Extraord",
    "Total intervenciones",
    "Trabajs o invitados q  participan ",
    "acuerdo/ CPolítico",
  ];
  worksheet.getRow(5).font = { bold: true, name: "Arial" };

  [1, 2, 3, 4, 5].forEach((row) => {
    worksheet.getRow(row).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.font = { bold: true, name: "Arial" };
      cell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    });
  });

  // Ajusta el ancho de columnas si lo deseas
  worksheet.columns = [
    { key: "no", width: 5 },
    { key: "nucleo", width: 15 },
    { key: "cip_sup", width: 10 },
    // ...agrega todas las columnas necesarias
  ];

  // Centrar y dar formato a los encabezados
  [1, 2, 3, 4, 5].forEach((rowNum) => {
    worksheet.getRow(rowNum).eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.font = { bold: true, name: "Arial" };
    });
  });

  return worksheet;
}
