import { useEffect, useState } from "react";
import { updateTerm } from "../services/synonymsService";

export default function EditTermModal({
    show,
    item,
    onClose,
    onUpdated,
}) {
    const [term, setTerm] = useState("");
    const [synonyms, setSynonyms] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!item) return;

        setTerm(item.term);

        setSynonyms(
            item.synonyms?.length
                ? item.synonyms.map((synonym) => synonym.value)
                : [""]
        );

        setError("");
    }, [item]);

    if (!show || !item) {
        return null;
    }

    const handleSynonymChange = (index, value) => {
        setSynonyms((prev) =>
            prev.map((synonym, i) =>
                i === index ? value : synonym
            )
        );
    };

    const handleAddSynonym = () => {
        setSynonyms((prev) => [...prev, ""]);
    };

    const handleRemoveSynonym = (index) => {
        setSynonyms((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!term.trim()) {
            setError("Inserisci un termine");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const cleanSynonyms = synonyms
                .map((synonym) => synonym.trim())
                .filter(Boolean);

            const updated = await updateTerm(
                item.id,
                term.trim(),
                cleanSynonyms
            );

            onUpdated?.(updated);
            onClose();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade show"
            style={{
                display: "block",
                background: "rgba(0,0,0,.5)",
            }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Modifica termine
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label">
                                    Termine
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={term}
                                    onChange={(e) =>
                                        setTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label className="form-label mb-0">
                                        Sinonimi
                                    </label>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleAddSynonym}
                                    >
                                        + Aggiungi sinonimo
                                    </button>
                                </div>

                                <div className="d-flex flex-column gap-2">

                                    {synonyms.map((synonym, index) => (
                                        <div
                                            key={index}
                                            className="input-group"
                                        >
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={synonym}
                                                onChange={(e) =>
                                                    handleSynonymChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            {synonyms.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() =>
                                                        handleRemoveSynonym(index)
                                                    }
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Annulla
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Salvataggio..."
                                    : "Salva modifiche"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}