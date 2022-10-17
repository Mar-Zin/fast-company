import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        error: null,
        isLoading: true
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state) => {
            state.error = actions.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        commentCreatedFailed: (state, action) => {
            state.error = action.payload;
        },
        commentRemoved: (state, action) => {
            state.entities = state.entities.filter(
                (comment) => comment._id !== action.payload
            );
        },
        commentRemovedFailed: (state, action) => {
            state.error = action.payload;
        }
    }
});

const commentCreateRequested = createAction("comments/commentCreateRequested");
const commentRemoveRequested = createAction("comments/commentRemoveRequested");

const { actions, reducer: commentsReducer } = commentsSlice;
const {
    commentsRequested,
    commentsReceved,
    commentsRequestFailed,
    commentCreated,
    commentCreatedFailed,
    commentRemoved,
    commentRemovedFailed
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceved(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const createComment = (payload) => async (dispatch) => {
    dispatch(commentCreateRequested());

    try {
        const { content } = await commentService.createComment(payload);
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentCreatedFailed(error.message));
    }
};

export const removeComment = (id) => async (dispatch) => {
    dispatch(commentRemoveRequested());
    try {
        const { content } = await commentService.removeComment(id);
        if (!content) {
            dispatch(commentRemoved(id));
        }
    } catch (error) {
        dispatch(commentRemovedFailed(error.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
