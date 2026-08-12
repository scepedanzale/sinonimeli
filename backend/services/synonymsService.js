const db = require("../db");

async function getAllTerms() {
    const [rows] = await db.execute(`
        SELECT
            t.id,
            t.term,
            s.id AS synonym_id,
            s.synonym
        FROM terms t
        LEFT JOIN synonyms s ON s.term_id = t.id
        ORDER BY t.term ASC, s.synonym ASC
    `);

    const terms = new Map();

    for (const row of rows) {
        if (!terms.has(row.id)) {
            terms.set(row.id, {
                id: row.id,
                term: row.term,
                synonyms: []
            });
        }

        if (row.synonym_id) {
            terms.get(row.id).synonyms.push({
                id: row.synonym_id,
                value: row.synonym
            });
        }
    }

    return Array.from(terms.values());
}


async function getTermById(id) {
    const [terms] = await db.execute(
        `
        SELECT id, term
        FROM terms
        WHERE id = ?
        `,
        [id]
    );

    if (terms.length === 0) {
        return null;
    }

    const [synonyms] = await db.execute(
        `
        SELECT id, synonym AS value
        FROM synonyms
        WHERE term_id = ?
        ORDER BY synonym
        `,
        [id]
    );

    return {
        ...terms[0],
        synonyms
    };
}


async function createTerm(term, synonyms = []) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.execute(
            `
            INSERT INTO terms (term)
            VALUES (?)
            `,
            [term.trim()]
        );

        const termId = result.insertId;

        const uniqueSynonyms = [
            ...new Set(
                synonyms
                    .map((synonym) => synonym.trim())
                    .filter(Boolean)
            )
        ];

        for (const synonym of uniqueSynonyms) {
            await connection.execute(
                `
                INSERT INTO synonyms (term_id, synonym)
                VALUES (?, ?)
                `,
                [termId, synonym]
            );
        }

        await connection.commit();

        return getTermById(termId);

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}


async function updateTerm(id, term, synonyms = []) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [existing] = await connection.execute(
            `
            SELECT id
            FROM terms
            WHERE id = ?
            `,
            [id]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return null;
        }

        await connection.execute(
            `
            UPDATE terms
            SET term = ?
            WHERE id = ?
            `,
            [term.trim(), id]
        );

        /*
         * Per semplicità:
         * eliminiamo i vecchi sinonimi
         * e salviamo la nuova lista.
         */
        await connection.execute(
            `
            DELETE FROM synonyms
            WHERE term_id = ?
            `,
            [id]
        );

        const uniqueSynonyms = [
            ...new Set(
                synonyms
                    .map((synonym) => synonym.trim())
                    .filter(Boolean)
            )
        ];

        for (const synonym of uniqueSynonyms) {
            await connection.execute(
                `
                INSERT INTO synonyms (term_id, synonym)
                VALUES (?, ?)
                `,
                [id, synonym]
            );
        }

        await connection.commit();

        return getTermById(id);

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
}


async function deleteTerm(id) {
    const [result] = await db.execute(
        `
        DELETE FROM terms
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows > 0;
}


async function searchTerms(query) {
    const search = `%${query.trim()}%`;

    /*
     * Prima troviamo tutti i term_id per cui:
     * - il termine corrisponde
     * - oppure almeno un sinonimo corrisponde
     */

    const [matches] = await db.execute(
        `
        SELECT DISTINCT t.id
        FROM terms t
        LEFT JOIN synonyms s ON s.term_id = t.id
        WHERE t.term LIKE ?
           OR s.synonym LIKE ?
        `,
        [search, search]
    );

    if (matches.length === 0) {
        return [];
    }

    const results = [];

    for (const match of matches) {
        const term = await getTermById(match.id);

        if (term) {
            results.push(term);
        }
    }

    return results;
}


module.exports = {
    getAllTerms,
    getTermById,
    createTerm,
    updateTerm,
    deleteTerm,
    searchTerms
};