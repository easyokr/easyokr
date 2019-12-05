
function token(state = {}, action) {
    switch (action.type) {
        case 'login':
            return { ...state, token: action.token }
        case 'logout':
            delete state.token
            return state
        default:
            return state
    }
}

export default token