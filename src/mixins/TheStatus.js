export const TheStatus ={
    data(){
        return {
            requestStatus: new Map([
                ["requested", "درخواست شده"],
                ["verified", "تایید شده"],
                ["denied", "رد شده"],
                ["api_error", "خطا"],
                ["complete", "تکمیل شده"],
                ["retried", "تلاش مجدد"]
            ]),
            requestStatusColor: new Map([
                ["requested", "yellow"],
                ["verified", "blue"],
                ["denied", "red"],
                ["api_error", "red"],
                ["complete", "green"],
                ["retried", "gray"]
            ])

        }
    },
    methods:{
        transformRequestStatus(status){
            return this.requestStatus.get(status)
        },
        getColorRequestStatus(status){
            return this.requestStatusColor.get(status)
        }
    }
}