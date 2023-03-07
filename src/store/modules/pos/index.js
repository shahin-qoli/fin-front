import mutations from './mutations'
import getters from './getters'
import actions from './actions'
export default {

    state() {
        return {
        poses:[],
        lastFetch: null,
        itemCount: null  
    }
    },
    mutations,
    getters,
    actions

}