import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
// import { nanoid } from "nanoid";
import commentService from "../services/comment.service";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserId } from "../store/users";
import { createComment } from "../store/comments";

const CommentsContext = React.createContext();
export const useComments = () => {
    return useContext(CommentsContext);
};

export const CommentsProvider = ({ children }) => {
    const { userId } = useParams();
    const currentUserId = useSelector(getCurrentUserId());
    const dispatch = useDispatch();
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getComments();
    }, [userId]);

    function catchError(error) {
        const { message } = error.response.data;
        setError(message);
    }

    function createdComment(data) {
        dispatch(createComment({ data, userId, currentUserId }));
        // const comment = {
        //     ...data,
        //     pageId: userId,
        //     created_at: `${Date.now()}`,
        //     userId: currentUserId,
        //     _id: nanoid()
        // };
        // try {
        //     const { content } = await commentService.createComment(comment);
        //     setComments((prevState) => [...prevState, content]);
        // } catch (error) {
        //     catchError(error);
        // }
    }

    async function getComments() {
        try {
            const { content } = await commentService.getComments(userId);
            setComments(content);
        } catch (error) {
            catchError(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function removeComment(id) {
        try {
            const { content } = await commentService.removeComment(id);
            if (content === null) {
                setComments((prevstate) =>
                    prevstate.filter((comment) => comment._id !== id)
                );
            }
        } catch (error) {}
    }

    useEffect(() => {
        if (error !== null) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    return (
        <CommentsContext.Provider
            value={{ comments, createdComment, isLoading, removeComment }}
        >
            {children}
        </CommentsContext.Provider>
    );
};
CommentsProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
