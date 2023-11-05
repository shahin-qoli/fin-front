import  {finAgent} from '@/services/agent'

export default{
    state(){
        return{
            slps: []
        }
    },
    mutations:{
        setSlps(state, payload){
            state.slps = payload
        }
    },
    getters:{
        getSpls(state){
            return state.slps
        }
    },
    actions:{
        async findUserByMobile(context, payload){
            try{
  
            const response = await finAgent.get(`/v2/club_user_data/find_by_phone?mobile_number=${payload}`)  
            if (response.status == 200)
                return  {success: true, result:response.data}
            else 
                return  {success: false, result:response.data}
            
        }catch (err) {
            return  {success: false, result: err.response.data}
         } 
    },
    async submitMobileForCode(context, payload){
        try{
        const body = {card_code: payload.cardCode, mobile_number: payload.mobileNumber}
        const response = await finAgent.post(`/v2/club_user_data/settle_user`, body)  

        if (response.status == 200)
            return  {success: true, result:response.data}
        else 
            return  {success: false, result:response.data}
        
    }catch (err) {
        return  {success: false, result: err.response.data}
     } 
},
async submitFormGatherData(context, payload){
    try{
    const body = {card_code: payload.cardCode, signed_day: payload.signedDay,
     guest_count: payload.guestCount, id_number: payload.idNumber,county: payload.county,
     city: payload.city, address: payload.address}
    const response = await finAgent.post(`/v2/club_invited_users/create_guest`, body)  

    if (response.status == 200)
        return  {success: true, result:response.data}
    else 
        return  {success: false, result:response.data}
    
}catch (err) {
    return  {success: false, result: err.response.data}
 } 
},
async submitFormAdvancedSearch(context, payload){
    try{
        const response = await finAgent.get(`/v2/club_user_data?q[address_cont]=${payload.address}&q[card_name_cont]=${payload.cardName}&
        q[county_matches]=${payload.county}&q[slp_name_cont]=${payload.slpName}&q[slp_code_eq]=${payload.slpCode}&q[id_number_eq]=${payload.idNumber}&
        q[county_phone_code_eq]=${payload.countyPhoneCode}`)  
    
        if (response.status == 200)
            return  {success: true, result:response.data}
        else 
            return  {success: false, result:response.data}
        
    }catch (err) {
        return  {success: false, result: err.response.data}
     } 
},
async submitFormUnknown(context, payload){
    try{
        const body = {name: payload.name, signed_day: payload.signedDay, guest_count: payload.guestCount, id_number: payload.idNumber,
        county: payload.county, city: payload.city, mobile_number: payload.mobileNumber,address: payload.address, slp_name: payload.slpName}
        const response = await finAgent.post(`/v2/club_unknown_users/create_guest`, body)  
    
        if (response.status == 200)
            return  {success: true, result:response.data}
        else 
            return  {success: false, result:response.data}
        
    }catch (err) {
        return  {success: false, result: err.response.data}
     } 
},
async loadSlpData(context){
    try{
        const {data:responseData} = await finAgent.get(`/v2/club_slp_data`)  
        var slpData = responseData
        const slps = [];
        for (const item of slpData) {
            
            const slp = {

                 ...item
            };
            slps.push(slp);  
          }
          context.commit('setSlps', slps);
    }catch (err) {
        //console.log(err.response);
        const error = new Error(
            err || 'Failed to fetch'
        );
        throw error;
     }  
}
}}