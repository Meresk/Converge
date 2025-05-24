export interface Role{
    id: number;
    name: string;
}

export interface User {
    id: number;
    login: string;
    role: Role;
    name: string;
    surname: string;
    patronymic: string;
}

export interface CreateUserParams {
    login: string;
    password: string;
    roleID: number;
    name: string;
    surname: string;
    patronymic: string;
}