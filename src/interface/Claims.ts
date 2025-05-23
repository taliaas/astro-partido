import type {Role} from "@/interface/Roles.ts";

export interface Claims{
    id: number,
    actions:  ('create' | 'update' | 'delete' | 'read' | 'export')[],
    module: string,
    role: Role
}