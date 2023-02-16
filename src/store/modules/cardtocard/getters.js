export default{
    cardtocards (state) {
        return state.cardtocards;
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