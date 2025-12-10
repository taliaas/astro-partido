import type { AgreementStatus } from "@/enum/Status";
import type { Militant } from "@/interface/Militante";
import type Minute from "@/interface/Minute";

export interface Agreements {
  id: string;
  descripcion: string;
  created: Date;
  enddate: Date;
  status: AgreementStatus;
  responsable: Militant;
  participants: Militant[];
  minute: Minute;
  pto: string;
}
