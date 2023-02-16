export default{
    setCardtocards(state, payload) {
        state.cardtocards = payload;
    },
    setFetchTimestamp(state) {
		state.lastFetch = Date.now();
	}
}