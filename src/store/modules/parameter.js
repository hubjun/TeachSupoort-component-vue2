const parameter = {
    state: {
        parameter: {}
    },
    mutations: {
        setParameterInfo(state, obj) {
            state.parameter = obj
            sessionStorage.setItem('parameter', JSON.stringify(obj))
        }
    },
    getters: {
        getParameter(state) {
            return state.parameter
        }
    }
}

export default parameter
