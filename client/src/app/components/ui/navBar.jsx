import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getIsLoggedIn } from "../../store/users";
import NavProfile from "./navProfile";

const NavBar = () => {
    const isLoggedId = useSelector(getIsLoggedIn());
    return (
        <nav className="navbar bg-light mb-3">
            <div className="container-fluid">
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            Main
                        </Link>
                    </li>
                    {isLoggedId && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/users">
                                    Users
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/favorites">
                                    My favorites
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                <div className="d-flex">
                    {isLoggedId ? (
                        <NavProfile />
                    ) : (
                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
