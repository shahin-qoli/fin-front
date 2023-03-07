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
        setRetry(state, itemId){
            const toUpdateIndex=state.jobs.findIndex(job => job.id === itemId )
            state.jobs[toUpdateIndex].is_retried = "true"
        },
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
        async retryJob(context, item){
            const itemId = item.id
            const {data: retryData} = await finAgent.get(`/front/job_results/${itemId}/retry`)    
            if (retryData.result){
                context.commit('setRetry',itemId)
            }         
        },
        async loadJobs(context,payload){
            context.commit('setIsLoading', 'true')
            try {
                const {data: responseData} = await finAgent.get(`/front/job_results?page=${payload.page}&per_page=${payload.itemsPerPage}`);
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