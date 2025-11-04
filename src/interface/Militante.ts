import type { UserStatus } from "@/enum/Status";

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
}
export interface Agreements {
  id: string;
  descripcion: string;
  responsable: Militant;
  fecha: Date;
  minute: any;
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
  id: string;
  firstname: "";
  lastname: "";
  ci: "";
  email: "";
  organization: "";
  address: "";
  phone: "";
  abscents: any;
  user: any;
  core: {
    id: "";
    name: "";
  };
  transfer: Transfer[];
  sancions: Sancion[];
  deactivation: any[];
  agreements: Agreements[];
}
