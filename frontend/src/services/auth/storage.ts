import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = `token`;

interface DecodedToken {
    exp: number;
    iat: number;
    role: string;
    sub: number;
}

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(): boolean {
    const decoded = getDecodedToken();
    if (!decoded) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
}

export function getDecodedToken(): DecodedToken | null {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode<DecodedToken>(token);
    } catch {
        return null;
    }
}