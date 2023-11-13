<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field 
                            label="شماره موبایل"
                            v-model="mobileNumber">
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field 
                            label="کد مشتری- c50000"
                            v-model="cardCode">
                            </v-text-field>
                        </v-col>
                        <v-col v-if="customer.id" cols="4">
                            <v-text-field 
                            label="نام مشتری"
                            v-model="customer.cardName">
                            </v-text-field>
                        </v-col>
                        <!-- <v-col v-if="customer.id" cols="4">
                            <v-file-input
                                accept="image/*"
                                label="بارگذاری فایل"
                                v-model="file"
                            />
                        </v-col> -->
                        <v-col cols="4">
                            <v-card-actions class="justify-center">
                                <v-btn v-if="!customer.id" :loading="isLoading" @click="submitFindCustomer" dark color="green">جستجو</v-btn>
                                <!-- <v-btn v-if="customer.id" :loading="isLoading" @click="submitUploadForm" dark color="yellow">بارگذاری</v-btn> -->
                            </v-card-actions> 
                        </v-col>

                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-text v-if="customer.id">
                <div id="app" class="web-camera-container">
  <div class="camera-button">
      <button type="button"  class="button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
        <span v-if="!isCameraOpen" color="purple">بازکردن دوربین</span>
        <span v-else color="red">بستن دوربین</span>
    </button>
  </div>
  
  <div v-show="isCameraOpen && isLoading" class="camera-loading">
    <ul class="loader-circle">
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
  <div class="camera-frame"></div>
  <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
    
    <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
      
    <video v-show="!isPhotoTaken" ref="camera" :width="300" :height="300" autoplay></video>
    
    <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="300" :height="300"></canvas>
  </div>
  
  <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
    <button type="button" class="button" @click="takePhoto">
      <img src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png">
    </button>
  </div>
  
  <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
    <a id="downloadPhoto" download="my-photo.jpg" class="button" role="button" @click="downloadImage">
      <p>بارگذاری عکس</p>
    </a>
  </div>
</div>

            </v-card-text>
        </v-card>
        <v-dialog v-model="notFoundModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="errorMessage"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="notFoundModal = false, errorMessage = ''">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container> 
</template>
<script>
import {finAgent} from '@/services/agent'
export default {
    data() {
        return {
            file: null,
            mobileNumber: '',
            cardCode: '',
            customer: {
                id: null,
                cardCode: null,
                cardName: null,
            },
            notFoundModal: false,
            errorMessage:'',
            isLoading: false,
            isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,

      link: '#'
        }
    },
    methods:{
        async submitUploadForm(){
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading = true;
            console.log("customer:", this.customer)
            let userId = this.customer.id
            formData.append('file', this.file,this.file.name)
            //move to store
            try {
                const response = await finAgent.post(`/v2/club_user_data/upload_image?user_id=${userId}`,formData );
                if (response.status == 200) {
                    this.notFoundModal = true;
                    this.errorMessage = "با موفقیت انجام شد"
                    this.isLoading = false;
                    this.refreshData();
   
                } else {
                    this.notFoundModal = true;
                    this.file = null;
                    this.isLoading = false;
                    this.errorMessage = "مشکلی پیش آمده است. لطفا دوباره تلاش کنید"
                    this.refreshData();
                }


            } catch (err){
                const error = new Error(
                    
                    err.response.data.error || 'Failed to fetch'
                );
                this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                throw error;
            }
        },
        async submitFindCustomer(){
            try {
                console.log("go to find")
                const response = await finAgent.get(`/v2/club_user_data/find_customer_for_image?mobile_number=${this.mobileNumber}&card_code=${this.cardCode}` );
                console.log(response.data.id)
                if (response.status == 200) {
                    this.customer = {id: response.data.id, cardCode: response.data.card_code, cardName: response.data.card_name};
                    this.isLoading = false;
                } else {
                    this.notFoundModal = true;
                    this.isLoading = false;
                    this.errorMessage = response.data.error || 'مشتری یافت نشد.';
                }

            } catch (err){ 
                this.notFoundModal = true;
                    this.errorMessage = err.response.data.error || 'Failed to fetch';
                    this.isLoading = false;

            }
        }
        ,
        refreshData(){
            this.file= null;
            this.mobileNumber = null;
            this.cardCode = null;
            this.isLoading = false;
            this.customer = {
                id: null,
                cardCode: null,
                cardName: null,
            };
    },
    toggleCamera() {
      if(this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },
    
    createCameraElement() {
      this.isLoading = true;
      
      const constraints = (window.constraints = {
				audio: false,
				video: {facingMode: { exact: "environment" },}
			});


			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(stream => {
          this.isLoading = false;
					this.$refs.camera.srcObject = stream;
				})
				.catch(error => {
          this.isLoading = false;
					alert("May the browser didn't support or there is some errors."+error);
				});
    },
    
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

			tracks.forEach(track => {
				track.stop();
			});
    },
    
    takePhoto() {
      if(!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }
      
      this.isPhotoTaken = !this.isPhotoTaken;
      
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
    },
    
    async downloadImage() {
        const canvas = document.getElementById("photoTaken");
  const quality = 0.95; // Set the desired quality level between 0 and 1
  const dataURL = canvas.toDataURL("image/jpeg", quality).replace("image/jpeg", "image/octet-stream");

// Convert data URL to Blob
const blob = await fetch(dataURL).then((res) => res.blob());

// Create a File object from the Blob
const file = new File([blob], "image.jpg", { type: "image/octet-stream" });

// Set the file in your component data (assuming you have a 'file' data property)
this.file = file;

// Now, call the submitUploadForm method
await this.submitUploadForm();
    }
}
}
</script>

<style scoped>
  .camera-frame {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center the frame */
    width: calc(100% - 20px); /* Adjust the width to compensate for the margin */
    height: calc(100% - 20px);
    background: url('@/assets/img/face-frame.svg') center center no-repeat;
    background-size: contain; /* or 'cover' depending on your image */
    opacity: 0.5; /* Adjust the opacity as needed */
    pointer-events: none; /* Allow interactions with the underlying video */
  }
</style>