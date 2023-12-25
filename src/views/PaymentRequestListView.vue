<template>
    <nav>
      <payment-request-list></payment-request-list>
    </nav>
  </template>
  


<script>
    import PaymentRequestList from '@/components/paymentrequest/RequestList.vue';
    export default {
      components: {
        PaymentRequestList
      }
    }
</script>
  