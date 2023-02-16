import axios from 'axios'

export default {
    async loadCardtocards(context) {
        if (!context.getters.shouldUpdate) return;
       // const apiUrl = context.rootGetters.apiUrl;
        try {
       
            const { data: cardtocardsData} = await axios.get(`http://192.168.142.128:3400/api/card_to_card_raws`,{headers: {
                "Access-Control-Allow-Origin": "*"
            }});
            const cardtocards = [];
            console.log(cardtocardsData)
            for (const key in cardtocardsData) {
				const cardtocard = {
					id: key,

				};
				cardtocards.push(cardtocard);  
              }
              context.commit('setCardtocards', cardtocards);
              context.commit('setFetchTimestamp');
              console.log(cardtocards)
         } catch (err) {
            //console.log(err.response);
            const error = new Error(
				err.response.data.error || 'Failed to fetch'
			);
			throw error;
         } 
    }
}

