import { finAgent,spreeAgent } from "@/services/agent";

export default{
    state(){
        return {
            cardGroups:[],
            disRelations:[],
            disPolicies:[],
            priceLists:[],
            itemGroups:[],
            filteredItems:[],
            campaigns:[],
            campaignDetails:[],
            bundleRows:[]
    }
    },
    mutations:{
        setInitialData(state,payload){
            state.cardGroups = payload.card_groups
            state.disRelations = payload.dis_relations
            state.disPolicies = payload.dis_policies
            state.priceLists = payload.price_lists
            state.itemGroups = payload.item_groups
        },
        setFilteredItems(state,payload){
            state.filteredItems = payload
        },
        setCampaignData(state, payload){
            state.campaigns = payload.campaigns
            state.campaignDetails = payload.campaign_details
            state.bundleRows = payload.bundle_rows
        }
    },
    actions:{
        async fetchFilteredItems(context,payload){
            try{
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/b1_items_data?q[item_code_cont]=${payload}&per_page=500`);
                let items = responseData.data
                context.commit('setFilteredItems',items);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async fetchTaxonItems(context, payload){
            try{
            const {data: responseData} = await spreeAgent.get(`/storefront/products?filter[taxons]=${payload}&page=1&per_page=250&include=variants`)
            console.log(responseData)
            if (responseData){
                console.log("fffffffffffffffffffffffff")
                let result = responseData.included.map(item =>{
                    return item.attributes.sku
                } )
                return result
        }else{
            return []
        }} catch(e){
            console.log(e)
            return []
        }
        }, 
        async fetchInitialData(context){
            try{
                const {data: responseData} = await finAgent.get('/front/campaign/get_initialize_data')
                if (responseData.success){
                    context.commit("setInitialData",responseData)
                    return {success: true}
                }
            }catch(e){
                return {success: false, error: e}
            }
        },
        async createCampaign(context, payload){
            try{
                const {data: responseData} = await finAgent.post('/front/campaign/', payload)
                return responseData
            }catch(e){
                return {success: false, error: e}
            }
        },
        async fetchCampaignsData(context){
            try{
                const {data: responseData} = await finAgent.get("/front/campaign")
                if ("error" in responseData){
                    return {success: false, error: responseData.error}
                }else{
                    context.commit("setCampaignData",responseData)
                    return {success: true }
                }
            }catch(e){
                return {success: false, error: e}
            }
        }},
    getters:{
        getCardGroups(state){
            return state.cardGroups
        },
        getDisRelations(state){
            return state.disRelations
        },
        getDisPolicies(state){
            return state.disPolicies
        },
        getPriceLists(state){
            return state.priceLists
        },
        getItemGroups(state){
            return state.itemGroups
        },
        getFilteredItems(state){
            return state.filteredItems
        },
        getCampaigns(state){
            return state.campaigns
        },
        getCampaignDetails(state){
            return state.campaignDetails
        },
        getBundleRows(state){
            return state.bundleRows
        }
    }
}