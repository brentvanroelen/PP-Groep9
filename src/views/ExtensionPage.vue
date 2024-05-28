<template>
    <div class="product">
        <div class="title">
            <h1>{{ ItemName }}</h1>
        </div>
        <div class="image">
            <img :src="ItemImage" alt="Product Image" v-if="ItemImage"/>
            <p v-else>Image not available</p>
        </div>
    </div>
    <div class="info">
        <div class="date">
            <p class="how">How long is the extension you want to request?</p>
            <div class="calendar">
                <VueDatePicker
                    v-model="selectedEndDate"
                    :min-date="fullDate"
                    :disabled-dates="[fullDate]"
                    inline
                    auto-apply
                    :clearable="false"
                />
            </div>
            <p>Selected Extension End Date: {{ selectedEndDate }}</p>
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
    <div>
        <h2></h2>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// Gebruik useRoute om de route parameters te krijgen
const route = useRoute();

// Haal de reservationId uit de URL parameters
const reservationId = route.query.reservationId;

// Declareer de nodige refs
const reason = ref('');
const userId = ref('');
const selectedEndDate = ref(null);
const fullDate = ref(new Date());
const ItemName = ref('');
const ItemImage = ref('');

// Functie om reservatie details op te halen
const fetchReservationDetails = async () => {
    try {
        if (!reservationId) {
            console.error('No reservationId provided in URL parameters');
            return;
        }

        const reservationDocRef = doc(db, `Users/${userId.value}/Reservations/${reservationId}`);
        const reservationDoc = await getDoc(reservationDocRef);

        if (reservationDoc.exists()) {
            const reservationData = reservationDoc.data();
            userId.value = reservationData.User;
            const endDate = new Date(new Date().getFullYear(), reservationData.EndMonth - 1, reservationData.EndDate);
            fullDate.value = endDate;
            selectedEndDate.value = endDate; // Set initial end date to the end date from the database
            await fetchProductDetails();
        } else {
            console.log('Reservation does not exist');
        }
    } catch (error) {
        console.error('Error fetching reservation details:', error);
    }
};

// Functie om product details op te halen
const fetchProductDetails = async () => {
    try {
        const reservationDocRef = doc(db, `Users/${userId.value}/Reservations/${reservationId}`);
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

// Functie om de extensie aan te vragen
const requestExtension = async () => {
    console.log('Selected End Date:', selectedEndDate.value);

    if (!userId.value) {
        console.error('User ID is not set');
        return;
    }

    try {
        const reservationDocRef = doc(db, `Users/${userId.value}/Reservations/${reservationId}`);
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
            alert('End date updated successfully');

            // Update the fullDate to the new end date
            fullDate.value = new Date(year, newEndMonth - 1, newEndDate);
            selectedEndDate.value = fullDate.value; // Reset selected dates to the new end date
        } else {
            console.log('Reservation does not exist');
        }
    } catch (error) {
        console.error('Error processing extension request:', error);
    }
};

// Fetch reservation details when the component is mounted
onMounted(fetchReservationDetails);
</script>

<style scoped>
.product {
    display: flex;
    text-align: center;
}

.title {
    margin-left: 30em;
    margin-top: 1.2em;
}

.image {
    margin-left: auto;
    padding-right: 26em;
    padding-top: 2em;
}

h1, h4 {
    margin: 3px;
}

h1 {
    margin-left: 4em;
}

.info {
    display: flex;
    margin-top: 1em;
    margin-left: 2em;
}

.reason {
    padding-right: 15em;
}

.text {
    width: 400px;
    height: 250px;
}

p {
    text-align: center;
}

.date {
    margin-right: auto;
}

button {
    flex: 1;
    height: 40px;
    padding: 5px 20px;
    border: none;
    border-radius: 20px;
    background-color: red;
    color: white;
    text-align: center;
    margin-bottom: 5px;
}

.how {
    padding-bottom: 1em;
    margin-left: 2em;
}

.why {
    margin-top: 4em;
}

.calendar {
    margin-left: 2em;
}

input {
    background-color: #c1c1c1;
}
</style>
