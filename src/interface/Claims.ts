import type {Role} from "@/interface/Roles.ts";

export interface Claims{
    id: number,
    action:  'create' | 'update' | 'delete' | 'read' | 'export',
    module: string,
    role: Role
}