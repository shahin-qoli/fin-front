import { finAgent, applyAuthFromResponse } from "@/services/agent";



export default {
    state(){
        return {
            user:null
        }
    },
    mutations:{
        cleanUser(state){
            state.user=null
        },
        setUser(state, user){
            state.user = user;
        }
    },
    getters:{
        getUser(state){
            return state.user || {}
        },
        isLogged(state){
            return state.user != null
        }
    },
    actions:{
        cleanUser(context){
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userRole')
            localStorage.removeItem('b1OperatorCode')
            localStorage.removeItem('platformToken')
            localStorage.removeItem('tokenExpiresAt')
            localStorage.removeItem('refreshToken')
            context.commit('cleanUser')
        },
        async userLogin(context, payload){
            const { email, password } = payload;
            var data = {"email": email, "password": password}
            try{
             console.log(data)
     
             const {data: requestsData} = await finAgent.post('/auth/login', data)
             applyAuthFromResponse(requestsData)
             const user = requestsData.user
             console.log(user)
             context.commit('setUser', user)

     
            } catch (err) {
                 //console.log(err.response);
                 const error = new Error(
                     err.response.data.error || 'Failed to fetch'
                 );
                 throw error;
              }
        },
        initUser(context){
            const userId = localStorage.getItem('userId')
            if (!userId) return
            const user = {
                email: localStorage.getItem('userEmail'),
                role: localStorage.getItem('userRole'),
                id: userId,
                b1_operator_code: localStorage.getItem('b1OperatorCode')
            }
            context.commit('setUser', user)
        }
    }

}