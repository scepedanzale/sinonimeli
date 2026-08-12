import { useState } from "react";
import { deleteTerm } from "../services/synonymsService";

export default function DeleteTermModal({
    show,
    item,
    onClose,
    onDeleted,
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!show || !item) {
        return null;
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            setError("");

            await deleteTerm(item.id);

            onDeleted?.(item.id);
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
                            Elimina termine
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />
                    </div>

                    <div className="modal-body">

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <p className="mb-0">
                            Vuoi eliminare il termine{" "}
                            <strong>{item.term}</strong> e tutti i suoi
                            sinonimi?
                        </p>

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
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading
                                ? "Eliminazione..."
                                : "Elimina"}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}