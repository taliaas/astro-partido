import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getSession } from "auth-astro/server.ts";
import { API_URL } from "astro:env/client";
import { Clasificacion, Nivel, Raza, Sexo } from "@/enum/Status";

const EstadoDesactivacion = ["PENDIENTE", "APROBADA", "RECHAZADA"] as const; // ← ACTUALIZADO
const ORGANIZACION = ["PCC", "UJC"] as const;

export const deactiveMili = defineAction({
  input: z.object({
    motivo: z.string().min(3),
    details: z.string().optional(),
    fecha: z.coerce.date(),
    estado: z.enum(EstadoDesactivacion).optional().default("PENDIENTE"),
    militanteId: z.number(), // Recibir militanteId en lugar de militante
  }),
  handler: async ({ motivo, estado, fecha, details, militanteId }, context) => {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/desactivation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
      body: JSON.stringify({
        motivo,
        fecha,
        estado: estado || "PENDIENTE",
        militanteId, // ✅ CAMBIO: Enviar militanteId
        details,
      }),
    });
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${res.status}`,
      });
    }
    return await res.json();
  },
});

export const updateDeactivation = defineAction({
  input: z.object({
    id: z.coerce.number(),
    motivo: z.string().min(3).optional(),
    details: z.string().optional(),
    fecha: z.coerce.date().optional(),
    estado: z.enum(EstadoDesactivacion).optional(),
    // ❌ NO incluir militante ni militanteId en actualización
  }),
  async handler({ id, motivo, details, fecha, estado }, context) {
    const session: any = await getSession(context.request);
    const res = await fetch(`${API_URL}/desactivation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.jwt,
      },
      body: JSON.stringify({
        motivo,
        fecha,
        estado,
        details,
        // ❌ NO enviar militante ni militanteId
      }),
    });
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${res.status}`,
      });
    }
    return await res.json();
  },
});

export const createMember = defineAction({
  input: z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().min(10),
    ci: z.string(),
    organization: z.enum(ORGANIZACION).optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    date: z.string().date().optional(),
    core: z.object({
      id: z.coerce.number(),
    }),
    sexo: z.nativeEnum(Sexo).optional(),
    raza: z.nativeEnum(Raza).optional(),
    religion: z.string().optional(),
    nivel_escolar: z.nativeEnum(Nivel).optional(),
    clasificacion: z.nativeEnum(Clasificacion).optional(),
    work: z.string().optional(),
    cuenta_propia: z.boolean(),
    fundador: z.boolean(),
    CIPCC: z.string().optional(),
    militant_doble: z.boolean(),
    expediente: z.string(),
  }),
  async handler(
    {
      firstname,
      lastname,
      email,
      address,
      ci,
      core,
      date,
      organization,
      phone,
      CIPCC,
      cuenta_propia,
      expediente,
      fundador,
      militant_doble,
      religion,
      work,
      clasificacion,
      nivel_escolar,
      raza,
      sexo,
    },
    context,
  ) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const body = JSON.stringify({
      firstname,
      lastname,
      email,
      address,
      ci,
      core,
      date,
      organization,
      phone,
      CIPCC,
      cuenta_propia,
      expediente,
      fundador,
      militant_doble,
      religion,
      work,
      clasificacion,
      nivel_escolar,
      raza,
      sexo,
    });

    const res = await fetch(`${API_URL}/militant`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});

export const updateMember = defineAction({
  input: z.object({
    id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    date: z.string().date(),
    email: z.string(),
    ci: z.string(),
    organization: z.enum(ORGANIZACION),
    address: z.string(),
    phone: z.string(),
    core: z.object({
      id: z.coerce.number(),
    }),
    sexo: z.nativeEnum(Sexo).optional(),
    raza: z.nativeEnum(Raza).optional(),
    religion: z.string(),
    nivel_escolar: z.nativeEnum(Nivel).optional(),
    clasificacion: z.nativeEnum(Clasificacion).optional(),
    work: z.string(),
    cuenta_propia: z.boolean(),
    fundador: z.boolean(),
    CIPCC: z.string(),
    militant_doble: z.boolean(),
    expediente: z.string(),
  }),
  async handler(
    {
      id,
      firstname,
      lastname,
      email,
      address,
      date,
      ci,
      core,
      organization,
      phone,
      CIPCC,
      cuenta_propia,
      expediente,
      fundador,
      militant_doble,
      religion,
      work,
      clasificacion,
      nivel_escolar,
      raza,
      sexo,
    },
    context,
  ) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const updateData: any = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (core !== undefined) updateData.core = core;
    if (date !== undefined) updateData.date = date;
    if (organization !== undefined) updateData.organization = organization;
    if (phone !== undefined) updateData.phone = phone;
    if (CIPCC !== undefined) updateData.CIPCC = CIPCC;
    if (cuenta_propia !== undefined) updateData.cuenta_propia = cuenta_propia;
    if (expediente !== undefined) updateData.expediente = expediente;
    if (fundador !== undefined) updateData.fundador = fundador;
    if (militant_doble !== undefined)
      updateData.militant_doble = militant_doble;
    if (religion !== undefined) updateData.religion = religion;
    if (work !== undefined) updateData.work = work;
    if (clasificacion !== undefined) updateData.clasificacion = clasificacion;
    if (nivel_escolar !== undefined) updateData.nivel_escolar = nivel_escolar;
    if (raza !== undefined) updateData.raza = raza;
    if (sexo !== undefined) updateData.sexo = sexo;

    const body = JSON.stringify(updateData);
    const body = JSON.stringify(updateData);

    const res = await fetch(`${API_URL}/militant/${id}`, {
      method: "PATCH",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});
