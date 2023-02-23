<template>
    <nav>
        <table>
            
            <thead><p>شماره درخواست</p>
            <p>نوع درخواست</p>
            <p>تاریخ  تراکنش</p></thead>
            <tbody>
            <tr>
                <td>
                <p>{{request.id}}</p> 
                <p>{{request.name}}</p>
                <p>{{request.payfull.pos_raw.transaction_date}}</p>
</td>
            </tr>
           

            </tbody>
        </table>

      
       
    </nav>
</template>

<script>

    export default {
        props: ['request']
    }
</script>