import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";


export default function Navbar() {
    const { setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();

            setUser(null);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">SinoniMeli</a>

                <div className="navbar" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button
                            className="btn text-danger"
                            onClick={handleLogout}
                            >
                                Esci <i class="bi bi-box-arrow-right"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
