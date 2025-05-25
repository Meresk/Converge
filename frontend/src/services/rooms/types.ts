export interface Room {
    id: number;
    name: string;
    ownerID?: number;
    ownerName?: string;
    ownerSurname?: string;
    ownerPatronymic?: string;
    isProtected: boolean;
    startsAt: Date;
    endsAt?: Date | null;
}

export interface JoinRoomResponse {
    token: string;
}

export interface CreateRoomParams {
    name: string;
    password?: string;
}

export interface JoinRoomParams {
    id: number;
    nickname: string;
    password: string;
}