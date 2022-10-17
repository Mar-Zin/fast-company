import { createAction, createSlice } from "@reduxjs/toolkit";
import authService from "../services/auth.service";
import localStorageService from "../services/localStorage.service";
import userService from "../services/user.service";
import { generateAuthError } from "../utils/generatorAuthErrors";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken()
    ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
    : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      };

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceved: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, actions) => {
            state.auth = actions.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, actions) => {
            state.error = actions.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.dataLoaded = false;
        },
        userDataUpdated: (state, actions) => {
            const indexUpdateUser = state.entities.findIndex(
                (u) => u._id === actions.payload._id
            );
            state.entities[indexUpdateUser] = actions.payload;
        },
        userDataUpdatedFailed: (state, actions) => {
            state.error = actions.payload;
        },
        authRequested: (state) => {
            state.error = null;
        }
    }
});

const { actions, reducer: usersReducer } = usersSlice;
const {
    usersRequested,
    usersReceved,
    usersRequestFailed,
    authRequestSuccess,
    authRequestFailed,
    userLoggedOut,
    userDataUpdated,
    userDataUpdatedFailed,
    authRequested
} = actions;

const updateUserRequested = createAction("users/updateUserRequested");

export const logIn =
    ({ payload, redirect }) =>
    async (dispatch) => {
        const { email, password } = payload;
        dispatch(authRequested());
        try {
            const data = await authService.login({ email, password });
            localStorageService.setTokens(data);
            dispatch(authRequestSuccess({ userId: data.userId }));
            history.push(redirect);
        } catch (error) {
            const { code, message } = error.response.data.error;
            if (code === 400) {
                const errorMessage = generateAuthError(message);
                dispatch(authRequestFailed(errorMessage));
            } else {
                dispatch(authRequestFailed(error.message));
            }
        }
    };

export const signUp = (payload) => async (dispatch) => {
    dispatch(authRequested());
    try {
        const data = await authService.register(payload);
        localStorageService.setTokens(data);
        dispatch(authRequestSuccess({ userId: data.userId }));
        history.push("/users");
    } catch (error) {
        dispatch(authRequestFailed(error.message));
    }
};

export const logOut = () => (dispatch) => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    history.push("/");
};

export const updateUserData = (payload) => async (dispatch) => {
    dispatch(updateUserRequested());
    try {
        const { content } = await userService.update(payload);
        console.log(payload);
        dispatch(userDataUpdated(content));
        history.push(`/users/${content._id}`);
    } catch (error) {
        dispatch(userDataUpdatedFailed(error.message));
    }
};

export const loadUsersList = () => async (dispatch) => {
    dispatch(usersRequested());
    try {
        const { content } = await userService.get();
        dispatch(usersReceved(content));
    } catch (error) {
        dispatch(usersRequestFailed(error.message));
    }
};

export const toggleBookmark = (id) => async (dispatch, getState) => {
    dispatch(updateUserRequested());
    let bookmarks;
    if (!getCurrentUserData()(getState()).bookmark) {
        bookmarks = [];
        bookmarks.push(id);
    } else {
        bookmarks = [...getCurrentUserData()(getState()).bookmark];
        if (bookmarks.findIndex((_id) => _id === id) !== -1) {
            bookmarks = bookmarks.filter((_id) => _id !== id);
        } else bookmarks.push(id);
    }
    const payload = {
        ...getCurrentUserData()(getState()),
        bookmark: bookmarks
    };
    try {
        const { content } = await userService.update(payload);
        dispatch(userDataUpdated(content));
    } catch (error) {
        dispatch(userDataUpdatedFailed(error.message));
    }
};

export const getUsers = () => (state) => state.users.entities;
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;
export const getUserById = (userId) => (state) => {
    if (state.users.entities) {
        return state.users.entities.find((user) => user._id === userId);
    }
};
export const getCurrentUserData = () => (state) => {
    return state.users.entities
        ? state.users.entities.find((u) => u._id === state.users.auth.userId)
        : null;
};
export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getDataStatus = () => (state) => state.users.dataLoaded;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getAuthError = () => (state) => state.users.error;
export default usersReducer;
