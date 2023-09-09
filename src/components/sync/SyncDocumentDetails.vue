<template>
    <v-container>
        <v-row>
            <v-card>
                <v-card-title>
                    <h1>Document Details Page</h1>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col 
                        v-for="(document, index) in selectedDocs"
                        :key="index"
                        cols="12"
                        >
                        <v-card  @click="showDocumentDetails(document)">
                            <v-card-text>{{ document }}</v-card-text>
                        </v-card>   
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>
  
  <script>

  </script>
  