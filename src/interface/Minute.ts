import type { Status } from "@/enum/Status";
import type { Invitados } from "@/interface/Invitados";
import type { Agreements, Core, User } from "@/interface/Militante";
import type MinuteOrdinary from "@/interface/MinuteOrdinary";
import type MinutePolitical from "@/interface/MinutePolitical";

export default interface Minute {
  id: string;
  name: string;
  hora?: string;
  lugar?: string;
  type: string;
  status: Status;
  date?: Date;
  createdAt: Date;
  core: Core | null;
  owner: User;
  abscents: any[];
  militants: any[];
  agreements: Agreements[];
  invitados: Invitados[];
  alerts?: any[];
  computo?: any;
  ordinary?: MinuteOrdinary;
  political?: MinutePolitical;
  file?: any;
  observaciones?: string;
}
