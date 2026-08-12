const API_URL = "/api";

export async function login(email, password) {
    console.log(email, password)
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Errore durante il login");
    }

    return data;
}

export async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Errore durante il logout");
    }

    return data;
}

export async function getMe() {
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Utente non autenticato");
    }

    return data;
}