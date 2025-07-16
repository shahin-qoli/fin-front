
// import cardtocardServ from '@/services/cardtocard/index.js'
import  {finAgent} from '@/services/agent'
export default {
        //   {item: this.item, cardcode: this.data.customer.cardCode, documents: this.toPaidDocument,
    //    checks: this.toPaidCheck, userid: this.user.id}
    async useCardtocard(contex, payload){
        try{
            let user = payload.userid
            if (payload.cardcode !=null && payload.documents.length < 1 && payload.checks.length < 1 ){
                var data ={"used_for": payload.cardcode, "captured_by":user.id} }
            else if (payload.documents.length > 0 || payload.checks.length > 0){
                data ={"documents": payload.documents,"checks":payload.checks, "captured_by":user.id,"used_for": payload.cardcode}
            }
            if (payload.image){
                data.image = payload.image
            }

            const {data:responseData} = await finAgent.post(`/front/card_to_card_raws/${payload.item.id}/use_payment`,data)

            if(responseData.result === true && payload.image){
                let reqId = responseData.request_id
                let formData = new FormData()
                formData.append('file', payload.image,payload.image.name)
                const imageData = await finAgent.post(`/front/used_payments/${reqId}/upload_image/`,formData );
                if(imageData.data.result){
                    data = {
                        cardcode: payload.cardcode,
                        itemId: payload.item.id
                    }
                    contex.commit('setUsedCardtocard', data)
                }  
                else {
                    throw new Error('Image upload failed');
                }              
            }

        }catch (err) {
            //console.log(err.response);
            const error = new Error(
				err || 'Failed to fetch'
			);
			throw error;
         } 
    },
   
    async loadCardtocards(context, payload) {
  
        context.commit('setIsLoading', 'true')
        try {
            console.log(payload)
            const {data:responseData} = await finAgent.get(`/front/card_to_card_raws?page=${payload.page}&per_page=${payload.itemsPerPage}&q[transaction_date_eq]=${payload.transactionDate}&q[amount_eq]=${payload.amount}&q[peygiri_number_matches]=${payload.peygiriNumber}&q[from_card_start]=${payload.fromCard}&q[to_card_start]=${payload.toCard}&q[serial_number_matches]=${payload.serialNumber}&q[is_used_eq]=${payload.isUsed}&q[bank_account_id_eq]=${payload.bankAccountId}`)
            var cardtocardsData = responseData.data;
            var itemCount = responseData.options.count;
            const cardtocards = [];
            for (const item of cardtocardsData) {
                
				const cardtocard = {
 
                     ...item
                    // number: 2
				};
				cardtocards.push(cardtocard);  
              }
          
              context.commit('setIsLoading', 'false')
              context.commit('setCardtocards', cardtocards);
              context.commit('setItemCount', itemCount);
              
            //   console.log(cardtocards)
         } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err || 'Failed to fetch'
			);
			throw error;
         } 
    }
}

