import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import userService from "../services/user.service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCurrentUserData } from "../store/users";

const UserContext = React.createContext();

export const useUser = () => {
    return useContext(UserContext);
};

const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const currentUser = useSelector(getCurrentUserData());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    function catchError(error) {
        const { message } = error.response.data;
        setError(message);
    }

    useEffect(() => {
        getUsers();
    }, []);
    useEffect(() => {
        toast.error(error);
        setError(null);
    }, [error]);

    async function getUsers() {
        try {
            const { content } = await userService.get();
            setUsers(content);
            setIsLoading(false);
        } catch (error) {
            catchError(error);
        }
    }

    function getUserById(userId) {
        return users.find((user) => user._id === userId);
    }

    useEffect(() => {
        if (!isLoading) {
            const newUsers = [...users];
            const indexUser = newUsers.findIndex(
                (u) => u._id === currentUser._id
            );
            newUsers[indexUser] = currentUser;
            setUsers(newUsers);
        }
    }, [currentUser]);

    return (
        <UserContext.Provider value={{ users, getUserById }}>
            {!isLoading ? children : "loading..."}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default UserProvider;
