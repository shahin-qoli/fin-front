export default{
    poses (state) {
        return state.poses;
    },
	usedposes (state){
		return state.poses.filter(pos => pos.is_used)
	}
}