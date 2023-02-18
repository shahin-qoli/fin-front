export default{
    setPoses(state, payload) {
        state.poses = payload;
    },
    setFetchTimestamp(state) {
		state.lastFetch = Date.now();
	}
}