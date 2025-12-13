import type { PlanStatus } from "@/enum/Estado";
import type { Agreements, Militant } from "@/interface/Militante";
import type Minute from "@/interface/Minute";

export interface MinuteOrdinary {
  id: string;
  fechaProx: Date | null;
  fechaPrep: Date | null;
  fechaCP: Date | null;
  development: Development[];
  minute: Minute;
}
export interface WorkPlan {
  id: string;
  descripcion: string;
  created: Date;
  enddate: Date;
  status: PlanStatus;
  responsable: Militant;
  participants: Militant[];
  pto: string;
}
export interface Development {
  id: string;
  order: string | null;
  agreements: Agreements[];
  workplan: WorkPlan[];
  content: string;
  minute: MinuteOrdinary;
}
