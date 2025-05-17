export interface Role{
    id: number;
    name: string;
}

export interface User {
    id: number;
    login: string;
    role: Role;
}
