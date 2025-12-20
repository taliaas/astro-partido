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
  if (!computos) {
    toast.info("No hay cómputos para este mes");
  }
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

function buildComputoSheet(workbook: Workbook, month: string) {
  const worksheet = workbook.addWorksheet(`Computo`);
  const $ = (key: string) => worksheet.getCell(key);

  worksheet.mergeCells("B1:Z1");
  $("B1").value =
    'UNIVERSIDAD TECNOLÓGICA DE LA HABANA  "JOSÉ ANTONIO ECHEVERRÍA". CUJAE';
  $("B1").font = {
    color: { argb: "FF0000" },
    bold: true,
    size: 14,
    name: "Arial",
    outline: true,
  };

  worksheet.columns = [
    { key: "no", width: 5 },
    { key: "cores", width: 10 },
    { key: "date", width: 25 },
    { key: "createdAt", width: 30 },
    { key: "edad", width: 10 },
    { key: "fechaRegistro", width: 15 },
  ];

  // worksheet.mergeCells("B3:C3");
  $("C3").value = `Mes: ${meses[Number(month) - 1]}`;

  // worksheet.mergeCells("D3:BI3");
  $("D3").value =
    "De los temas debatidos en la Reunión Ordinaria  clasifíquelos en :";

  // worksheet.mergeCells("B4:C6");
  $("C4").value = "Núcleos";
  $("C4").font = {
    bold: true,
    name: "Arial",
    size: 12,
  };

  return worksheet;
}
