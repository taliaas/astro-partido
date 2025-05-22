export interface Role {
    id: string;
    name: string;
    description: string;
    users: number;
    claims: any;
}