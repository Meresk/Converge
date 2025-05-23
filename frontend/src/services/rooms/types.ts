export interface Room {
    id: number;
    name: string;
    ownerID?: number;
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