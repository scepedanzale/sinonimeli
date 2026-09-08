const API_URL = "/api";


export async function getTerms() {
    const response = await fetch(`${API_URL}/synonyms`, {
        credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante il recupero dei termini"
        );
    }

    return data;
}


export async function getTerm(id) {
    const response = await fetch(
        `${API_URL}/synonyms/${id}`,
        {
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante il recupero del termine"
        );
    }

    return data;
}


export async function createTerm(term, synonyms) {
    const response = await fetch(
        `${API_URL}/synonyms`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                term,
                synonyms
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante la creazione"
        );
    }

    return data;
}


export async function updateTerm(id, term, synonyms) {
    const response = await fetch(
        `${API_URL}/synonyms/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                term,
                synonyms
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante la modifica"
        );
    }

    return data;
}


export async function deleteTerm(id) {
    const response = await fetch(
        `${API_URL}/synonyms/${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante l'eliminazione"
        );
    }

    return data;
}


export async function searchTerms(query) {
    const response = await fetch(
        `${API_URL}/synonyms/search?q=${encodeURIComponent(query)}`,
        {
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Errore durante la ricerca"
        );
    }

    return data;
}
