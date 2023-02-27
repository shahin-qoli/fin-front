export default{
    setCardtocards(state, payload) {
        state.cardtocards = payload;
    },
    setFetchTimestamp(state) {
		state.lastFetch = Date.now();
	},
    setUsedCardtocard(state, payload) {
        console.log("baaaaaabaaaaaa")
        const cid = payload.itemId
        const cardcode = payload.cardcode
        const toUpdateIndex=state.cardtocards.findIndex(c2c => c2c.id === cid )
        state.cardtocards[toUpdateIndex].used_payments = []
        state.cardtocards[toUpdateIndex].used_payments[0]={"used_for" : cardcode}
        console.log("LOOOK here")
        console.log(state.cardtocards[toUpdateIndex].used_payments[0])
        state.cardtocards[toUpdateIndex].is_used = true
        
    }
}