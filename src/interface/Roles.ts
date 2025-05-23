export interface Role {
    id: number;
    name: string;
    description: string;
    users: number;
    claims: any;
}