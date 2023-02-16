<template>
<v-container class="grey lighten-5" >
    <v-divider class="mb-1" />
        <v-row>

                        <v-col cols="6">
       <v-img
       max-width="50"
       max-height="50"
       src = "../assets/logo.png"
    />

</v-col>
<v-col align-self="center" cols="3"><h2 style="bold center" >بروکس</h2> </v-col>


    <v-divider class="mb-1" />
    <v-col cols="9">
    <router-link to='/cardtocard'><h3>کارت به کارت</h3></router-link>
</v-col>
    <v-divider class="mb-1" />
    <v-col cols="9">
        <router-link to='/cardtocard'><h3>کارتخوان</h3></router-link> 
</v-col>
   <v-divider class="mb-1" />

</v-row>
</v-container>

</template>

<style scoped>
 .header{
    background: #000;
 }
</style>

