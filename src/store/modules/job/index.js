import  {finAgent} from '@/services/agent'

export default{
    state(){
        return{
            itemCount:null,
            jobs: [],
        }
    },
    mutations:{
        setItemCount(state, payload){
            state.itemCount = payload;},

        setJobs(state, jobs){
            state.jobs = jobs;
        }

    },
    getters:{
        getJobItemCount(state){
            return state.itemCount;
        },
        jobs(state){
            return state.jobs;
        }
    },
    actions:{

        async loadJobs(context,payload){
            context.commit('setIsLoading', 'true')
            let qstring = ''
            if (payload.isSuccess){
                qstring = 'q[jobfull_of_UsedPayment_type_state_not_eq]='
            }
            else {
                qstring = 'q[jobfull_of_UsedPayment_type_state_eq]='
            }
            try {
                const {data: responseData} = await finAgent.get(`/front/job_results?page=${payload.page}&per_page=${payload.itemsPerPage}&${qstring}complete`);
                const jobs = []
                var jobsData = responseData.data;
                var itemCount = responseData.options.count;
                for (const item of jobsData) {
                    const job= {
                        ...item
                    }
                    jobs.push(job); 
                }
                
                context.commit('setJobs', jobs)
                context.commit('setIsLoading', 'false')
                context.commit('setItemCount', itemCount);
 
            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             } 
        }

    }
}