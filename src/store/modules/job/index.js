import  {finAgent} from '@/services/agent'

export default{
    state(){
        return{
            jobs: [],
        }
    },
    mutations:{
        setRetry(state, itemId){
            const toUpdateIndex=state.jobs.findIndex(job => job.id === itemId )
            state.jobs[toUpdateIndex].is_retried = "true"
        },
        setJobs(state, jobs){
            state.jobs = jobs;
        }

    },
    getters:{
        jobs(state){
            return state.jobs;
        }
    },
    actions:{
        async retryJob(context, item){
            const itemId = item.id
            const {data: retryData} = await finAgent.get(`http://192.168.1.80:3400/api/front/job_results/${itemId}/retry`)    
            if (retryData.result){
                context.commit('setRetry',itemId)
            }         
        },
        async loadJobs(context){
            context.commit('setIsLoading', 'true')
            try {
                const {data: jobsData} = await finAgent.get('/job_results');
                const jobs = []
                for (const item of jobsData) {
                    const job= {
                        ...item
                    }
                    jobs.push(job); 
                }
                
                context.commit('setJobs', jobs)
                context.commit('setIsLoading', 'false')
 
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