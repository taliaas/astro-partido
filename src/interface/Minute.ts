import type { MinuteStatus, MinuteType, StatusAtte } from "@/enum/Estado";
import type { Reason } from "@/interface/Absent";
import type { Computo } from "@/interface/Indicadores";
import type { Invitados } from "@/interface/Invitados";
import type { Core, Militant, User } from "@/interface/Militante";
import type { MinuteOrdinary } from "@/interface/MinuteOrdinary";
import type { MinutePolitical } from "@/interface/MinutePolitical";

export default interface Minute {
  id: string;
  name: string;

  hour?: string;

  place?: string;
  type: MinuteType;
  status: MinuteStatus;
  date?: Date;
  createdAt: Date;
  core: Core | null;

  owner: User;

  abscents: Attendance[];

  invitados: Invitados[];

  alerts?: any[];

  computo?: Computo;

  ordinary?: MinuteOrdinary;
  political?: MinutePolitical;

  file?: any;

  observaciones?: string;
}

export interface Attendance {
  id: string;
  estado: StatusAtte;
  militant: Militant;
  minute: Minute;
  reason?: Reason;
}
