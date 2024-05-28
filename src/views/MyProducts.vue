<template>
    <button @click="log">Test</button>
    <template v-for="(cancellableReservation, index) in displayReservations[0]" :key="index">
      <div class="product1" v-if="!cancelledReservations.includes(cancellableReservation)">
        <div class="kolom1">
          <p>Serial: {{ cancellableReservation.id }}</p>
          <div class="actions">
            <!-- Dit moet nog aangepast worden, dit gaat misschien weg -->
            <!-- <button @click="reservationReturnedOrCanceled(cancellableReservation); cancelRes(cancellableReservation)">
              Cancel Reservation
            </button> -->
            <button @click="toggleReservationDetails(index)">See Reservations</button>
            <button>
                <router-link class="link" :to="{ name: 'ExtensionPage', query: { reservationId: reservation.id }}">Request extension</router-link>
            </button>
          </div>
          <div v-if="isReservationVisible(index)" class="reservation-details">
            <ul>
              <li v-for="(item, index) in getItems(cancellableReservation)" :key="index" class="reservation-item">
                Name: {{ item.ItemName }}
                Serial number: {{ item.Serial }}
                <img :src="item.ItemImage" alt="picture">
                <div class="actions">
                  <button>
                    <router-link class="link" to="/ExtensionPage">Request singular extension</router-link>
                  </button>
                  <button @click="getReportedItems">
                    <router-link class="link" to="/ReportIssue">Report Issue</router-link>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="kolom4">
          <p>{{ cancellableReservation.StartDate }}/{{ cancellableReservation.StartMonth }}/{{ year }}</p>
          <p>{{ cancellableReservation.EndDate }}/{{ cancellableReservation.EndMonth }}/{{ year }}</p>
        </div>
      </div>
    </template>
    <div v-for="(reservation, index) in displayReservations[1]" :key="index" class="product1">
      <div class="kolom1">
        <p>Serial: {{ reservation.id }}</p>
        <div class="actions">
          <button @click="toggleReservationDetails(index)">See Reservations</button>
          <button>
            <router-link class="link" to="/ExtensionPage">Request extension</router-link>
          </button>
        </div>
        <div v-if="isReservationVisible(index)" class="reservation-details">
          <ul>
            <li v-for="(item, index) in getItems(reservation)" :key="index" class="reservation-item">
              Name: {{ item.ItemName }}
              Serial number: {{ item.Serial }}
              <img :src="item.ItemImage" alt="picture">
              <div class="actions">
                <button>
                  <router-link class="link" to="/ExtensionPage">Request singular extension</router-link>
                </button>
                <button @click="getReportedItems(item)">
                  <router-link class="link" to="/ReportIssue">Report Issue</router-link>
                </button>
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
  
  <script setup>
  import { computed, onMounted, ref } from "vue";
  import { db, collection,query, getDocs,where,doc } from "../Firebase/Index.js";
  import { reservationReturnedOrCanceled } from "../js/functions.js";
  import { useUserIdentification, useReportedItems } from "@/Pinia/Store.js";
  
  const report = useReportedItems();

 
  
  let cancelledReservations = ref([]);
  let reservations = ref([]);
  let cancellableReservations = ref([]);
  const year = ref(new Date().getFullYear());
  const user = useUserIdentification();
  let startDate = ref(new Date());
  const visibleReservations = ref({});
  
  
  const displayReservations = computed(() => {
    let test = cancellableReservationsCalc();
    let array = [test[0], test[1]];
    return array;
});
const arrayifier = computed(() => {
    let array = [];
    for (let reservation of reservations.value){
        console.log(reservations.value)
        for (let i = 1; i <= 10; i++){
            if (reservation[`Item${i}`] != undefined){
                array.push(reservation[`Item${i}`]);
            }else{
                break;
            }
        }
    }
    return array;
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
  
  const cancelRes = (reservation) => {
    cancelledReservations.value.push(reservation);
  };

  const getReportedItems =(item) => {
    report.addImage(item.ItemImage);
    console.log(report.itemImage);
    report.addName(item.ItemName);
    console.log(report.itemName);
    report.addSerial(item.Serial);
    console.log(report.itemSerial);
  };
  
  const getReservations = async () => {
    if(user.user.id){
        const collectionRef = collection(db, `Users/${user.user.id}/Reservations`);
        const querySnapshot = await getDocs(collectionRef);
        if (querySnapshot.empty) {
            console.log('No Reservations found!');
            return;
        }else{
            querySnapshot.forEach((doc) => {
            reservations.value.push(doc.data());
            });
        }
        
    }
}
  
  const cancellableReservationsCalc = () => {
    if (reservations.value == undefined){
        console.log("loading...")
    } else {
        let cancellableReservations = [];
        let remainingReservations = [];

        for (let reservation of reservations.value){
            console.log(reservations.value)
            startDate.value.setDate(reservation.StartDate);
            startDate.value.setMonth(reservation.StartMonth);
            let adjustedStartDate = new Date(startDate.value);
            adjustedStartDate.setDate(adjustedStartDate.getDate() - 2);
            adjustedStartDate.setMonth(adjustedStartDate.getMonth() - 1);
            adjustedStartDate.setHours(0,0,0,0);
            console.log(adjustedStartDate)
            
            if (!reservation.CurrentlyWithUser && new Date().setHours(0,0,0,0) <= adjustedStartDate){
                cancellableReservations.push(reservation);
            } else {
                remainingReservations.push(reservation);
            }
        }

        return [cancellableReservations, remainingReservations];
    }
};
  
  const toggleReservationDetails = (index) => {
    visibleReservations.value[index] = !visibleReservations.value[index];
  };
  
  const isReservationVisible = (index) => visibleReservations.value[index] || false;
  
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
