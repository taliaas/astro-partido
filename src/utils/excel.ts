import ExcelJS, { type Workbook } from "exceljs";

export interface DataComputo {
  core: string;
  date: string;
  createdAt: string;
  militants: number;
  militants_minute: number;
  difference: number;
}

export function buildExcel(computos: DataComputo[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.calcProperties.fullCalcOnLoad = true;
  const asistenciaWorkSheet = buildAsistenciaSheet(workbook);
  for

  const computoWorkSheet = buildComputoSheet(workbook);

  return workbook;
}

function buildAsistenciaSheet(workbook: Workbook) {
  const worksheet = workbook.addWorksheet(`Asistencia`);
  const $ = (key: string) => worksheet.getCell(key);

  worksheet.columns = [
    { key: "empty", width: 1 },
    { key: "id", width: 10 },
    { key: "nombre", width: 25 },
    { key: "email", width: 30 },
    { key: "edad", width: 10 },
    { key: "fechaRegistro", width: 15 },
  ];

  worksheet.mergeCells("B1:C1");
  $("B1").value = "Mes";

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

function buildComputoSheet(workbook: Workbook) {
  const worksheet = workbook.addWorksheet(`Computo`);
  const $ = (key: string) => worksheet.getCell(key);

  return worksheet;
}
