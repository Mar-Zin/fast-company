import React from "react";
import NavBar from "./components/ui/navBar";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./loyaut/main";
import Login from "./loyaut/login";
import Users from "./loyaut/users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogOut from "./loyaut/logOut";
import ProtectedRoute from "./components/common/protectedRoute";
import AppLoader from "./components/ui/hoc/appLoader";
import Favorites from "./loyaut/favorites";

function App() {
    return (
        <>
            <AppLoader>
                <NavBar />
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/login/:type?" component={Login} />
                    <ProtectedRoute
                        path="/users/:userId?/:edit?"
                        component={Users}
                    />
                    <ProtectedRoute path="/favorites" component={Favorites} />
                    <Route path="/logout" component={LogOut} />
                    <Redirect to="/" />
                </Switch>

                <ToastContainer />
            </AppLoader>
        </>
    );
}

export default App;
