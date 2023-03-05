import { finAgent } from "@/services/agent";



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
            context.commit('cleanUser')
        },
        async userLogin(context, payload){
            const { email, password } = payload;
            var data = {"email": email, "password": password}
            try{
             console.log(data)
     
             const {data: requestsData} = await finAgent.post('/auth/login', data)
             const user = requestsData.user
             console.log(user)
             localStorage.setItem('token', requestsData.token)
             localStorage.setItem('userEmail', user.email)
             localStorage.setItem('userId', user.id)
             localStorage.setItem('userRole', user.role)
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
            if (localStorage.getItem('userId'))
                var user = {'email': localStorage.getItem('userEmail'),
                 'role': localStorage.getItem('userRole'), 'id':localStorage.getItem('userId') };
                context.commit('setUser', user)
  
        }
    }

}