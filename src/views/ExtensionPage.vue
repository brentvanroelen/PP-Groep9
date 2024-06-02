<template>
    <div class="product">
        <div class="title">
            <h1>{{ ItemName }}</h1>
        </div>
        <div class="image"></div>
        <img :src="ItemImage" alt="Product Image" v-if="ItemImage"/>
        <p v-else>Image not available</p>
    </div>
    <div class="info">
        <div class="date">
            <p class="how">How long is the extension you want to request?</p>
            <div class="calendar">
                <VueDatePicker
                    v-model="selectedDates"
                    inline
                    auto-apply
                    :min-date="fullDate"
                    :clearable="false"
                    :range="true"
                />
            </div>
            
        </div>

        <div class="reason">
            <p class="why">Why do you want the extension?</p>
            <div class="text">
                <input
                    type="text"
                    v-model="reason"
                    placeholder="Enter reason here"
                />
            </div>
            <button @click="requestExtension">Request extension</button>
        </div>
    </div>
            <p class="duration">Selected Duration: {{ extensionDuration }} days</p>

    <div>
        <h2></h2>
    </div>
    <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Popup from "@/components/Popup.vue";

const route = useRoute();
const reason = ref('');
const selectedDates = ref([]);
const fullDate = ref(new Date());
const ItemName = ref('');
const ItemImage = ref('');
const reservationId = route.query.reservationId;
const userId = route.query.userId
const popupVisible = ref(false);
const popupMessage = ref('');




  const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

const fetchReservationDetails = async () => {
    try {
        console.log(reservationId)
        console.log(userId)
        const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
        const reservationDoc = await getDoc(reservationDocRef);
        
        if (reservationDoc.exists()) {
            const reservationData = reservationDoc.data();
            const endDate = new Date(new Date().getFullYear(), reservationData.EndMonth - 1, reservationData.EndDate);
            fullDate.value = endDate;
            selectedDates.value = [endDate];
            await fetchProductDetails();
        } else {
            console.log('Reservation does not exist');
        }
    } catch (error) {
        console.error('Error fetching reservation details:', error);
    }
};

const fetchProductDetails = async () => {
    try {
        const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
        const reservationDoc = await getDoc(reservationDocRef);
        
        if (reservationDoc.exists()) {
            const reservationData = reservationDoc.data();
            const item1 = reservationData?.Item1;
            if (item1) {
                ItemName.value = item1.ItemName || 'Product not found';
                ItemImage.value = item1.ItemImage || '';
            } else {
                ItemName.value = 'Product not found';
                ItemImage.value = '';
            }
        } else {
            console.log('Reservation does not exist');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        ItemName.value = 'Product not found';
        ItemImage.value = '';
    }
};

const extensionDuration = computed(() => {
    if (selectedDates.value.length === 2) {
        const [startDate, endDate] = selectedDates.value;
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) - 1;
        return Math.ceil(duration); 
    }
    return 0;
});

watch(selectedDates, (newDates) => {
    console.log('Selected Dates:', newDates);
    if (newDates.length === 2) {
        console.log('Start Date:', newDates[0]);
        console.log('End Date:', newDates[1]);
    }
});

const requestExtension = async () => {
    console.log('Selected Dates:', selectedDates.value);
    console.log('Extension Duration:', extensionDuration.value);

    try {
        const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
        const reservationDoc = await getDoc(reservationDocRef);
        
        if (reservationDoc.exists()) {
            const reservationData = reservationDoc.data();
            console.log('Reservation Data:', reservationData);
            
            let { EndDate, EndMonth } = reservationData;
            let newEndDate = EndDate + extensionDuration.value;
            let newEndMonth = EndMonth;
            const year = new Date().getFullYear();

            const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

            while (newEndDate > getDaysInMonth(year, newEndMonth)) {
                newEndDate -= getDaysInMonth(year, newEndMonth);
                newEndMonth++;
                if (newEndMonth > 12) {
                    newEndMonth = 1;
                }
            }

            await updateDoc(reservationDocRef, {
                EndDate: newEndDate,
                EndMonth: newEndMonth,
                Extended: true,
            });

            console.log('End date updated successfully');
            
            fullDate.value = new Date(year, newEndMonth - 1, newEndDate);
            selectedDates.value = [fullDate.value]; 
        } else {
            console.log('Reservation does not exist');
        }
    } catch (error) {
        console.error('Error processing extension request:', error);
    }
    showPopup('Your extension request has been submitted successfully!'); 
};

onMounted(fetchReservationDetails);
</script>



<style scoped>
.product {
    margin-bottom: 20px;
    text-align: center
}
.title h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

.info{
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.date, 
.reason{
   border: 1px solid #ccc;
   padding: 20px;
   border-radius: 10px;
   transition: transform 0.3s ease;
}

.reason:hover{
    transform: trasformY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
.date {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 20px;
}

.date:hover{
    transform: translateY(-5px);
} 

.calendar {
  margin: 0 auto; 
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.calendar:hover{
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}


.how, 
.why{
    font-weight: bold;
    font-size: 16px;
    margin-bottom:10px;
}

  
.reason {
  border: 1px solid #ccc;
  padding: 20px;
  width: 90%;
  margin: 0 auto;
  border-radius: 10px; 
}

.reason:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.text input {
  width: calc(100% - 20px);
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}
.text input::placeholder {
  text-align: center; 
}
button {
  padding: 10px 20px;
  background-color: #cd3545;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #c82333;
}


.duration {
  font-size: 16px;
  font-style: italic;
  margin-top: 20px;
  margin-bottom: 20px;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

</style>