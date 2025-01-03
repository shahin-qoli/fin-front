export const TransactionTypes ={
    data(){
        return {
            transactionTypes: new Map([
                ["0", "نامشخص"],
                ["1", "کارت به کارت"],
                ["2", "حساب به حساب"],
                ["3", "وصول چک"],
                ["4","پرداخت پل"]
            ]),
            transactionTypesColor: new Map([
                ["0", "red"],
                ["1", "blue"],
                ["2", "green"],
                ["3", "yellow"],
                ["4","purple"]
            ])

        }
    },
    methods:{
        transformTransactionTypes(tr){
            return this.transactionTypes.get(tr)
        },
        getColorTransactionType(tr){
            return this.transactionTypesColor.get(tr)
        }
    }
}