// ACTION TYPES
const SET_USER = "user/SET_USER";
const REMOVE_USER = "user/REMOVE_USER";


// ACTIONS
export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const removeUser = ( userId ) => {
    return {
        type: REMOVE_USER,
        payload: userId
    }
}


// REDUCER
export default function reducer(state = {user: {}}, action){
    switch (action.type){
        case SET_USER:
            return {
                user: action.payload.user
            }
        default:
            return state
    }
}