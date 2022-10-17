import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getCurrentUserData } from "../../store/users";
const BookMark = ({ user, ...rest }) => {
    const currentUser = useSelector(getCurrentUserData());
    const status = currentUser.bookmark
        ? currentUser.bookmark.find((_id) => _id === user._id)
        : "";

    return (
        <button {...rest}>
            <i className={"bi bi-heart" + (status ? "-fill" : "")}></i>
        </button>
    );
};
BookMark.propTypes = {
    user: PropTypes.object
};

export default BookMark;
