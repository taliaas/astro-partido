export interface Transfer {
  id: number;
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
export interface Agreements{
  id: string,
  descripcion: string,
	responsable: Militantes,
	fecha: Date,
	minute: any
}
export interface Militantes {
  id: 0;
  firstname: "";
  lastname: "";
  ci: "";
  email: "";
  organization: "";
  estado: true;
  address: "";
  phone: "";
  core: {
    id: "";
    name: "";
  };
  traslados: Transfer[];
  sanciones: Sancion[];
  desactivaciones: any[];
  responsableAgreem: Agreements[]
}