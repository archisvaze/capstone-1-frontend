import { createSlice } from "@reduxjs/toolkit";


let startState = {};

startState = { isLoggedIn: false, teacher: {}, myQuizes: [], myReports: [], tab: "My Quizes", newQuizDialog: false, editQuizDialog: false, alert: ["", false, "error"] };
if (localStorage.getItem("teacher-data")) {
    startState.teacher = JSON.parse(localStorage.getItem("teacher-data"));
    startState.isLoggedIn = true;
}

const mySlice = createSlice({
    name: "mySlice",
    initialState: startState,
    reducers: {
        setLogin: (state, action) => {
            state.teacher = action.payload.teacher;
            state.teacher.token = action.payload.accessToken;
            state.isLoggedIn = true
            localStorage.setItem("teacher-data", JSON.stringify(state.teacher))
        },
        setLogout: (state, action) => {
            localStorage.clear();
            state.isLoggedIn = false;
            state.teacher = {}
            state.myQuizes = [];
            state.myReports = [];
            state.newQuizDialog = false;
        },
        setMyQuizes: (state, action) => {
            state.myQuizes = action.payload
        },
        setMyReports: (state, action) => {
            state.myReports = action.payload
        },
        setTab: (state, action) => {
            state.tab = action.payload;
        },
        setNewQuizDialog: (state, action) => {
            state.newQuizDialog = action.payload;
        },
        setEditQuizDialog: (state, action) => {
            state.editQuizDialog = action.payload;
        },
        setAlert: (state, action) => {
            state.alert = action.payload;
        },
    }
})

export const { setLogin, setLogout, setMyQuizes, setMyReports, setTab, setNewQuizDialog, setAlert, setEditQuizDialog } = mySlice.actions;
export default mySlice.reducer;