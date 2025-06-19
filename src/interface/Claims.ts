import type { roleEnum } from "@/enum/roleEnum";
import type {Role} from "@/interface/Roles.ts";

export interface Claims{
    id: number,
    actions:  ('create' | 'update' | 'delete' | 'read' | 'export')[],
    module: string,
    role: roleEnum
}