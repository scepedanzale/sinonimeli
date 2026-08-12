import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";

import {
    getTerms,
    searchTerms,
} from "./services/synonymsService";
import AddTermModal from "./components/AddTermModal";
import EditTermModal from "./components/EditTermModal";
import DeleteTermModal from "./components/DeleteTermModal";


const ITEMS_PER_PAGE = 10;


export default function Homepage() {
    const [terms, setTerms] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);


    const fetchTerms = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTerms();

            setTerms(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setCurrentPage(1);

            if (!search.trim()) {
                fetchTerms();
                return;
            }

            try {
                setLoading(true);
                setError("");

                const results = await searchTerms(search);

                setTerms(results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);


    useEffect(() => {
        fetchTerms();
    }, []);



    const totalPages = Math.ceil(
        terms.length / ITEMS_PER_PAGE
    );


    const paginatedTerms = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;

        return terms.slice(
            start,
            start + ITEMS_PER_PAGE
        );
    }, [terms, currentPage]);


    const isMatchedSynonym = (synonym) => {
        if (!search.trim()) {
            return false;
        }

        return synonym
            .toLowerCase()
            .includes(search.trim().toLowerCase());
    };


    const isMatchedTerm = (term) => {
        if (!search.trim()) {
            return false;
        }

        return term
            .toLowerCase()
            .includes(search.trim().toLowerCase());
    };


    const handlePreviousPage = () => {
        setCurrentPage((page) =>
            Math.max(page - 1, 1)
        );
    };


    const handleNextPage = () => {
        setCurrentPage((page) =>
            Math.min(page + 1, totalPages)
        );
    };

    const sortTerms = (items) => {
        return [...items].sort((a, b) =>
            a.term.localeCompare(b.term, "it", {
                sensitivity: "base"
            })
        );
    };


    return (
        <>
            <Navbar />

            <main className="container py-4">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">

                    <div className="search">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Cerca un termine o un sinonimo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Aggiungi termine
                    </button>

                </div>





                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}


                {loading ? (

                    <div className="text-center py-5">
                        Caricamento...
                    </div>

                ) : terms.length === 0 ? (

                    <div className="text-center py-5 text-muted">
                        Nessun termine trovato
                    </div>

                ) : (

                    <>
                    <p>{terms.length} {terms.length>1 ? 'termini trovati' : 'termine trovato'}</p>
                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>
                                    <tr>
                                        <th style={{ width: "60px" }}>
                                            #
                                        </th>

                                        <th>
                                            Termine
                                        </th>

                                        <th>
                                            Sinonimi
                                        </th>

                                        <th
                                        >

                                        </th>
                                    </tr>
                                </thead>


                                <tbody>

                                    {paginatedTerms.map((item, index) => {

                                        const number =
                                            (currentPage - 1) *
                                            ITEMS_PER_PAGE +
                                            index +
                                            1;

                                        return (
                                            <tr key={item.id}>

                                                <td className="text-muted">
                                                    {number}
                                                </td>


                                                <td>
                                                    <span
                                                        className={
                                                            isMatchedTerm(item.term)
                                                                ? "search-highlight"
                                                                : ""
                                                        }
                                                    >
                                                        {item.term}
                                                    </span>
                                                </td>


                                                <td>
                                                    <div className="d-flex flex-wrap gap-2">

                                                        {item.synonyms.length > 0 ? (
                                                            item.synonyms.map(
                                                                (synonym) => (
                                                                    <span
                                                                        key={synonym.id}
                                                                        className={`synonym-item ${isMatchedSynonym(
                                                                            synonym.value
                                                                        )
                                                                            ? "search-highlight"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {synonym.value}
                                                                    </span>
                                                                )
                                                            )
                                                        ) : (
                                                            <span className="text-muted small">
                                                                Nessun sinonimo
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>


                                                <td className="text-end">

                                                    <div className="d-flex justify-content-end gap-2 actions">

                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => setEditingItem(item)}
                                                        >
                                                            <i class="bi bi-pencil-fill"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm text-danger"
                                                            onClick={() => setDeletingItem(item)}
                                                        >
                                                            <i class="bi bi-trash3-fill"></i>
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>


                        {totalPages > 1 && (

                            <nav className="mt-4">

                                <ul className="pagination justify-content-center">

                                    <li
                                        className={`page-item ${currentPage === 1
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={handlePreviousPage}
                                        >
                                            ‹
                                        </button>
                                    </li>


                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => {
                                            const page = index + 1;

                                            return (
                                                <li
                                                    key={page}
                                                    className={`page-item ${currentPage === page
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() =>
                                                            setCurrentPage(page)
                                                        }
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            );
                                        }
                                    )}


                                    <li
                                        className={`page-item ${currentPage === totalPages
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={handleNextPage}
                                        >
                                            ›
                                        </button>
                                    </li>

                                </ul>

                            </nav>

                        )}
                    </>
                )}

            </main>


            <AddTermModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onCreated={(created) => {
                    setTerms((prev) =>
                        sortTerms([...prev, created])
                    );
                }}
            />
            <EditTermModal
                show={Boolean(editingItem)}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onUpdated={(updated) => {
                    setTerms((prev) =>
                        sortTerms(
                            prev.map((item) =>
                                item.id === updated.id
                                    ? updated
                                    : item
                            )
                        )
                    );
                }}
            />

            <DeleteTermModal
                show={Boolean(deletingItem)}
                item={deletingItem}
                onClose={() => setDeletingItem(null)}
                onDeleted={(id) => {
                    setTerms((prev) =>
                        prev.filter((item) => item.id !== id)
                    );
                }}
            />
        </>
    );
}