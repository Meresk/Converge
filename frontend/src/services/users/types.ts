export interface Role{
    id: number;
    name: string;
}

export interface User {
    id: number;
    login: string;
    role: Role;
}

export interface CreateUserParams {
    login: string;
    password: string;
    roleID: number;
}