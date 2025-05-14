export interface Room {
    id: number;
    name: string;
    ownerID?: number;
    isProtected: boolean;
    startsAt: Date;
    EndsAt?: Date | null;
}

export interface CreateRoomParams {
    name: string;
    password?: string;
}