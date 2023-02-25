import axios from 'axios'

export default {
    async loadCardtocards(context) {
        if (!context.getters.shouldUpdate) return;
       // const apiUrl = context.rootGetters.apiUrl;
        try {
       
            const { data: cardtocardsData} = await axios.get(`http://192.168.1.80:3400/api/card_to_card_raws`,{headers: {
                "Access-Control-Allow-Origin": "*"
            }});
            console.log(cardtocardsData)
            const cardtocards = [];
            //{ data: cardtocardsData}
            // console.log(cardtocardsData)
            for (const item of cardtocardsData) {
                
				const cardtocard = {
					id: item.id,
                    transaction_date: item.transaction_date,
                    transaction_time: item.transaction_time,
                    description: item.description,
                    amount: item.amount,
                    from_card: item.from_card,
                    to_card: item.to_card,
                    peygiri_number: item.peygiri_number,
                    serial_number: item.serial_number,
                    job_id: item.job_id,
                    is_used: item.is_used 
                    // ...item,
                    // number: 2
				};
				cardtocards.push(cardtocard);  
              }
              context.commit('setCardtocards', cardtocards);
              context.commit('setFetchTimestamp');
            //   console.log(cardtocards)
         } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err.response.data.error || 'Failed to fetch'
			);
			throw error;
         } 
    }
}

