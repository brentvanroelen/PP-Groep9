<template>
    <div class="card">
        <div class="card-body">
            <div v-if="scheduledLoan != undefined" class="card-content">
                <div>
                    <h5 class="card-title">{{ scheduledLoan.User }}</h5>
                    <p class="card-text">Place for timeslot</p>
                    <details>
                        <summary>See Items</summary>
                        <ul>
                            <li v-for="(item, index) in scheduledLoan.allItemNames" :key="index">
                            {{ item }}: {{ scheduledLoan.allItemSerials[index] }}
                            </li>
                        </ul>
                    </details>
                    <p v-if="scheduledLoan.ReservationPrepared" class="card-text">Status: Ready</p>
                    <p v-else>Status: {{ scheduledLoan.amountLeftToPrepare }} item{{ scheduledLoan.amountLeftToPrepare !== 1 ? 's' : '' }} to prepare</p>
                </div>
                <div class="card-actions">
                    <button @click="markAsPickedUp(scheduledLoan.StartDate)" class="btn">Picked Up</button>
                    <button @click="discardReservation(scheduledLoan.StartDate)" class="btn">Discard</button>
                </div>
            </div>
            <div v-if="scheduledReturn != undefined" class="card-content">
                <div>
                    <h5 class="card-title">{{ scheduledReturn.User }}</h5>
                    <p class="card-text"> Place for timeslot</p>
                    <details>
                        <summary>See Items</summary>
                        <ul>
                            <li v-for="(item, index) in scheduledReturn.allItemNames" :key="index">
                            {{ item }}: {{ scheduledReturn.allItemSerials[index] }}
                            </li>
                        </ul>
                    </details>
                </div>
                <div class="card-actions">
                    <button @click="markAsPickedUp(scheduledReturn.StartDate)" class="btn">Returned + check</button>
                    <button @click="markAsPickedUp(scheduledReturn.StartDate)" class="btn">Returned</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
const props = defineProps({
    scheduledLoan: Object,
    scheduledReturn: Object
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
    width: 40%;
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