<template>
    <v-dialog :value="showSendMessageModal" max-width="500">
      <v-card>
        <v-card-title>Message Form</v-card-title>
        <v-card-text>
          <!-- Your form content here, including v-select -->
          <v-select
           v-model="selectedTemplate"
           :items="messageTemplates"
           solo
           item-text="name"
            item-value="id"

          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="submitForm">Submit</v-btn>
          <v-btn @click="cancelForm">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {  
        item: Object, // To control the modal's visibility
        showSendMessageModal: Boolean,
    },
    emits: ['close'],
    data() {
      return {
        selectedTemplate: '',
      };
    },
    methods: {
        loadTemplates() {
            this.$store.dispatch('loadMiarzeMessageTemplates')
        },
      submitForm() {

        // Add your logic to handle form submission here
        this.closeModal();
      },
      cancelForm() {
        this.closeModal();
      },
      closeModal() {
        this.$emit("close"); // Emit an event to close the modal
      },
    },
    computed:{
        messageTemplates(){
            return this.$store.getters.getMiarzeMessageTemplates;
        }
    },
    created(){
        this.loadTemplates();
    }
  };
  </script>
  