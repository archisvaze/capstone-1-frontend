import { createSlice } from "@reduxjs/toolkit";


let startState = {};

startState = {
    isLoggedIn: false,
    teacher: {},
    myQuizes: [],
    myReports: [],
    tab: "My Quizes",
    newQuizDialog: false,
    alert: ["", false, "error"],
    currQuiz: { name: "", questions: [], teacher: "", _id: "" },
    student: "",
    connectedStudents: ["hi"],
    clientID: "",
};
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
        setAlert: (state, action) => {
            state.alert = action.payload;
        },
        setCurrQuiz: (state, action) => {
            state.currQuiz = action.payload;
        },
        setStudent: (state, action) => {
            state.student = action.payload;
        },
        addStudent: (state, action) => {
           state.connectedStudents.push(action.payload)
        },
        clearStudents: (state, action) => {
            state.connectedStudents = [];
        },
        setClientID: (state, action) => {
            state.clientID = action.payload;
        }
    }
})

export const {
    setLogin,
    setLogout,
    setMyQuizes,
    setMyReports,
    setTab,
    setNewQuizDialog,
    setAlert,
    setCurrQuiz,
    setStudent,
    addStudent,
    clearStudents,
    setClientID,

} = mySlice.actions;
export default mySlice.reducer;