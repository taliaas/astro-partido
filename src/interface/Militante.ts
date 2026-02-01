import type {
  AgreementStatus,
  Clasificacion,
  Nivel,
  Raza,
  Sexo,
  UserStatus,
} from "@/enum/Status";
import type { Development } from "@/interface/MinuteOrdinary";

export interface Transfer {
  id: string;
  origen: string;
  destino: string;
  details: string;
  fecha: Date;
  estado: string;
}

export interface Sancion {
  id: string;
  causa: string;
  fecha: Date;
  severidad: string;
  estado: string;
  details: string;
  duracion: number;
  militant: Militant;
}
export interface Agreements {
  id: number;
  descripcion: string;
  responsable: Militant;
  participants: Militant[];
  created: Date;
  enddate: Date;
  status: AgreementStatus;
  minute: any;
  development: Development;
}

export interface Comite {
  id: string;
  name: string;
  cores: Core[];
  disabled: boolean;
}

export interface Core {
  id: string;
  name: string;
  disabled: boolean;
  generalSecretary: Militant;
  operationSecretary: Militant;
  comite: Comite;
  militants: Militant[];
  users: User[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  militant: Militant;
  core: Core;
  notification: Notification[];
  logs: any[];
  minutes: any[];
  role: any;
  lastLogin: Date;
  events: Event[];
  status: UserStatus;
}
export interface Militant {
  id: number;
  firstname: "";
  lastname: "";
  createdAt: Date;
  ci: "";
  email: "";
  organization: "";
  address: "";
  phone: "";
  abscents: any;
  user: any;
  sexo: Sexo;
  raza: Raza;
  religion: string;
  nivel_escolar: Nivel;
  clasificacion: Clasificacion;
  work: string;
  cuenta_propia: boolean;
  fundador: boolean;
  date: Date;
  CIPCC: string;
  militant_doble: boolean;
  expediente: string;
  core: {
    id: number;
    name: string;
  };
  transfer: Transfer[];
  sancions: Sancion[];
  deactivation: any[];
  agreements: Agreements[];
}
