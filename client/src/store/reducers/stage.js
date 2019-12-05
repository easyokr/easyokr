
function stage(state = {}, action) {
    switch (action.type) {
        case 'update':
            return { ...state, stage: action.stage }
        default:
            return state
    }
}

export default stage