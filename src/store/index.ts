import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../api/api";

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    refreshToken: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    refreshToken: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.refreshToken = null;
        },
    },
});

export const { setUser, setRefreshToken, logout } = userSlice.actions;

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
