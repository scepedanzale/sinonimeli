const synonymsService = require("../services/synonymsService");


async function getAll(req, res) {
    try {
        const terms = await synonymsService.getAllTerms();

        return res.json(terms);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore durante il recupero dei termini"
        });
    }
}


async function getById(req, res) {
    try {
        const term = await synonymsService.getTermById(req.params.id);

        if (!term) {
            return res.status(404).json({
                message: "Termine non trovato"
            });
        }

        return res.json(term);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore durante il recupero del termine"
        });
    }
}


async function create(req, res) {
    try {
        const { term, synonyms = [] } = req.body;

        if (!term?.trim()) {
            return res.status(400).json({
                message: "Il termine è obbligatorio"
            });
        }

        if (!Array.isArray(synonyms)) {
            return res.status(400).json({
                message: "Synonyms deve essere un array"
            });
        }

        const created = await synonymsService.createTerm(
            term,
            synonyms
        );

        return res.status(201).json(created);

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Termine già esistente"
            });
        }

        return res.status(500).json({
            message: "Errore durante la creazione del termine"
        });
    }
}


async function update(req, res) {
    try {
        const { term, synonyms = [] } = req.body;

        if (!term?.trim()) {
            return res.status(400).json({
                message: "Il termine è obbligatorio"
            });
        }

        if (!Array.isArray(synonyms)) {
            return res.status(400).json({
                message: "Synonyms deve essere un array"
            });
        }

        const updated = await synonymsService.updateTerm(
            req.params.id,
            term,
            synonyms
        );

        if (!updated) {
            return res.status(404).json({
                message: "Termine non trovato"
            });
        }

        return res.json(updated);

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Termine o sinonimo già esistente"
            });
        }

        return res.status(500).json({
            message: "Errore durante la modifica del termine"
        });
    }
}


async function remove(req, res) {
    try {
        const deleted = await synonymsService.deleteTerm(
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Termine non trovato"
            });
        }

        return res.json({
            message: "Termine eliminato"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore durante l'eliminazione del termine"
        });
    }
}


async function search(req, res) {
    try {
        const query = req.query.q;

        if (!query?.trim()) {
            return res.status(400).json({
                message: "Inserisci un termine da cercare"
            });
        }

        const results = await synonymsService.searchTerms(query);

        return res.json(results);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore durante la ricerca"
        });
    }
}


module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    search
};