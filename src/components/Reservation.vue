<template>
    <div>
        <div v-for="reservation in reservationslist" :key="reservation.StartDate">
            <div class="card">
                <div class="card-body">
                    <div v-if="!Returns" class="card-content">
                        <div>
                            <h5 class="card-title">{{ reservation.User }}</h5>
                            <p class="card-text">{{ reservation.StartDate }}</p>
                            <p class="card-text">{{ reservation.ReservationPrepared }}</p>
                        </div>
                        <div class="card-actions">
                            <button @click="markAsPickedUp(reservation.StartDate)" class="btn">Picked Up</button>
                            <button @click="discardReservation(reservation.StartDate)" class="btn">Discard</button>
                        </div>
                    </div>
                    <div v-else class="card-content">
                        <div>
                            <h5 class="card-title">{{ reservation.User }}</h5>
                            <p class="card-text">{{ reservation.EndDate }}</p>
                            <p class="card-text">{{ reservation.ReservationPrepared }}</p>
                        </div>
                        <div class="card-actions">
                            <button @click="markAsPickedUp(reservation.StartDate)" class="btn">Returned + check</button>
                            <button @click="markAsPickedUp(reservation.StartDate)" class="btn">Returned</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed,watchEffect } from 'vue';
import { onSnapshot, doc, db,query,where,collection} from '../Firebase/Index.js';

const currentDate = new Date().getDate();
let unssub = false;
const props = defineProps({
    Returns: Boolean
});

const reservationslist = ref([]);

watchEffect(() => {
  const q = collection(db, "Reservations");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const reservations = [];
    querySnapshot.forEach((doc) => {
      reservations.push(doc.data());
    });
    reservationslist.value = reservations;
    if (unssub) {
      unsubscribe();
    }
  });
});

onUnmounted(() => {
    unssub = true;
});

const markAsPickedUp = async (reservationId) => {
    await markReservationAsPickedUp(reservationId);
    reservations.value = await getReservations();
};

const discardReservation = async (reservationId) => {
    await discardReservation(reservationId);
    reservations.value = await getReservations();
};


</script>

<style scoped>
.card {
    background-color: lightblue;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
}

.card-body {
    display: flex;
    justify-content: space-between;
}

.card-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.card-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 45%;
}
.btn{
    background-color: #FF0000;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: white;
    border-radius: 1em;
    width: 100%;
    height: 3.8em;
  
}
</style>