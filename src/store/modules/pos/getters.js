export default{
    poses (state) {
        return state.poses;
    },
	usedposes (state){
		return state.poses.filter(pos => pos.is_used)
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