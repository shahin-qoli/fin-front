import axios from 'axios'

export default {
    async loadCardtocards(context) {
        if (!context.getters.shouldUpdate) return;
       // const apiUrl = context.rootGetters.apiUrl;
        try {
       
            const { data: cardtocardsData} = await axios.get(`http://192.168.142.128:3400/api/card_to_card_raws`,{headers: {
                "Access-Control-Allow-Origin": "*"
            }});
            console.log(cardtocardsData)
            const cardtocards = [];
            //{ data: cardtocardsData}
            // console.log(cardtocardsData)
            for (const key in cardtocardsData) {
				const cardtocard = {
					id: cardtocardsData[key].id,
                    transaction_date: cardtocardsData[key].transaction_date,
                    transaction_time: cardtocardsData[key].transaction_time,
                    description: cardtocardsData[key].description,
                    amount: cardtocardsData[key].amount,
                    from_card: cardtocardsData[key].from_card,
                    to_card: cardtocardsData[key].to_card,
                    peygiri_number: cardtocardsData[key].peygiri_number,
                    serial_number: cardtocardsData[key].serial_number,
                    job_id: cardtocardsData[key].job_id,
                    is_used: cardtocardsData[key].is_used
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

