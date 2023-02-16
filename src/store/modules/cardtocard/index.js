import mutations from './mutations'
import getters from './getters'
import actions from './actions'
export default {

    state() {
        return {
        cardtocards:[],
        lastFetch: null,
            // {
            //     id: 1,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 2000,
            //     from_card : "6037603760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },
            // {
            //     id: 2,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 200210,
            //     from_card : "6237603760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },
            // {
            //     id: 3,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 221000,
            //     from_card : "6037688760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },
            // {
            //     id: 4,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 122000,
            //     from_card : "6098503760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },            {
            //     id: 5,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 52000,
            //     from_card : "6037093760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },
            // {
            //     id: 6,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 29000,
            //     from_card : "6037603760376037",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // },
            // {
            //     id: 7,
            //     transaction_date: '2-16-2023',
            //     transaction_date: '18:22',
            //     description : " پرداخت",
            //     amount : 9242000,
            //     from_card : "589210117113193 ",
            //     to_card : "120938765789",
            //     peygiri_number : "22422",
            //     serial_number : 12313,
            //     job_id : 1
            // }
        
    }
    },
    mutations,
    getters,
    actions

}