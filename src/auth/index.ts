import type { token } from "./type";
import router from "@/router";

export function saveToken(token: token) {
  return localStorage.setItem(
    'token', 
    JSON.stringify(token)
  );
}

export function saveUser(user: string) {
  return localStorage.setItem('user', user);
}

export function isLoggedIn() {
    const token = localStorage.getItem('token');

    return token !== null;
}

export function getUser(): string {
    const user = localStorage.getItem('user');

    let returnUser = '' as string;
    if (user) {
        returnUser = user as string;
    }

    return returnUser;
}

export function getToken(): token {
    const token = localStorage.getItem('token');

    let returnToken = {} as token;
    if (token) {
        returnToken = JSON.parse(token) as token;
    }

    return returnToken;
}

export async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return await router.push({ 
        name: 'login' 
    });
}
