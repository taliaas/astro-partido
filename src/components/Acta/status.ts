import { MinuteStatus } from "@/enum/Estado";

export const statusMap = {
  [MinuteStatus.CREATE]: {
    title: "Creada",
    label:
      "El acta ha sido registrada correctamente y está pendiente de procesamiento. Puedes iniciar el procesamiento o cargar archivos adicionales si es necesario.",
  },
  [MinuteStatus.PROCESSING]: {
    title: "Procesando",
    label:
      "El acta se está procesando actualmente. Este proceso puede tardar unos minutos. Evita realizar cambios hasta que finalice.",
  },
  [MinuteStatus.PENDIENTE]: {
    title: "En Revisión",
    label:
      "El acta requiere revisión manual. Revisa el contenido y, si todo está correcto, procede a marcarla como procesada o solicita correcciones.",
  },
  [MinuteStatus.PROCESADA]: {
    title: "Procesada",
    label:
      "El acta fue procesada exitosamente. Puedes visualizarla, exportarla o continuar con los pasos siguientes.",
  },
  [MinuteStatus.ERROR]: {
    title: "Error",
    label:
      "Ocurrió un error al procesar el acta. Intenta reintentar el procesamiento o revisa el archivo original para corregir posibles problemas.",
  },
  [MinuteStatus.INACTIVA]: {
    title: "Inactiva",
    label:
      "El acta está inactiva y no está disponible para acciones. Contacta al administrador si crees que debería reactivarse.",
  },
};
