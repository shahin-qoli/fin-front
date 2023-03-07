export default{
	getCardItemCount(state){
		return state.itemCount;
	},
    cardtocards (state) {
        return state.cardtocards;
    },
	usedcardtocards (state){
		return state.cardtocards.filter(cardtocard => cardtocard.is_used)
	},
    shouldUpdate(state) {
		const lastFetch = state.lastFetch;
		if (!lastFetch) {
			return true;
		} else {
			const currentTimestamp = Date.now();
			// if it's more than minute ago
			return (currentTimestamp - lastFetch) / 1000 > 60;
		}
	}
}