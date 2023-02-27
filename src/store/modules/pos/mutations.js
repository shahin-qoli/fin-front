export default{
    setPoses(state, payload) {
        state.poses = payload;
    },
    setFetchTimestamp(state) {
		state.lastFetch = Date.now();
	},
    setUsedPos(state, payload) {

        const cid = payload.itemId
        const cardcode = payload.cardcode
        const toUpdateIndex=state.poses.findIndex(c2c => c2c.id === cid )
        state.poses[toUpdateIndex].used_payments = []
        state.poses[toUpdateIndex].used_payments[0]={"used_for" : cardcode}
        state.poses[toUpdateIndex].is_used = true
        
    }
}