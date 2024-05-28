<template>
  <div>
    <button @click="log">Test</button>
    <template v-for="(reservation, index) in displayReservations" :key="index">
      <div class="product1" v-if="!cancelledReservations.includes(reservation)">
        <div class="kolom1">
          <p>Serial: {{ reservation.id }}</p>
          <div class="actions">
            <button @click="toggleReservationDetails(reservation)">See Reservations</button>
            <router-link class="link" :to="{ name: 'ExtensionPage', query: { reservationId: reservation.id, userId: user.user.id }}">Request extension</router-link>
          </div>
          <div v-if="isReservationVisible(reservation)" class="reservation-details">
            <ul>
              <li v-for="(item, index) in getItems(reservation)" :key="index" class="reservation-item">
                Name: {{ item.ItemName }}
                Serial number: {{ item.Serial }}
                <img :src="item.ItemImage" alt="picture">
                <div class="actions">
                  <router-link class="link" :to="{ name: 'ExtensionPage', query: { reservationId: reservation.id }}">Request single extension</router-link>
                  <router-link class="link" to="/ReportIssue">Report Issue</router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="kolom4">
          <p>{{ reservation.StartDate }}/{{ reservation.StartMonth }}/{{ year }}</p>
          <p>{{ reservation.EndDate }}/{{ reservation.EndMonth }}/{{ year }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { db, collection, getDocs } from "../Firebase/Index.js";
import { useUserIdentification } from "@/Pinia/Store.js";

const user = useUserIdentification();

const cancelledReservations = ref([]);
const reservations = ref([]);
const visibleReservations = ref({});

const year = ref(new Date().getFullYear());

const displayReservations = computed(() => {
  let [cancellableReservations, remainingReservations] = cancellableReservationsCalc();
  return cancellableReservations.concat(remainingReservations);
});

const getItems = (reservation) => {
  const items = [];
  if (reservation) {
    for (let i = 1; i <= 10; i++) {
      if (reservation[`Item${i}`]) {
        items.push(reservation[`Item${i}`]);
      } else {
        break;
      }
    }
  }
  return items;
};

const getReservations = async () => {
  if (user.user.id) {
    const collectionRef = collection(db, `Users/${user.user.id}/Reservations`);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      console.log('No Reservations found!');
      return;
    } else {
      querySnapshot.forEach((doc) => {
        reservations.value.push(doc.data());
      });
    }
  }
};

const cancellableReservationsCalc = () => {
  let cancellableReservations = [];
  let remainingReservations = [];

  for (let reservation of reservations.value) {
    // Implement your logic here to determine cancellable reservations
    // For demonstration, assuming all reservations are cancellable
    cancellableReservations.push(reservation);
  }

  return [cancellableReservations, remainingReservations];
};

const toggleReservationDetails = (reservation) => {
  visibleReservations.value[reservation.id] = !visibleReservations.value[reservation.id];
};

const isReservationVisible = (reservation) => visibleReservations.value[reservation.id] || false;

onMounted(getReservations);
</script>
  
  <style scoped>
.product1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

.kolom1, .kolom4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 16px;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 8px;
}

.reservation-details {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.reservation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.reservation-item img {
  max-width: 50px;
  max-height: 50px;
  margin-left: 16px;
  border-radius: 8px;
}

.button {
  padding: 8px;
  background-color: #ff3333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.button:hover {
  background-color: #cc0000;
}
</style>
