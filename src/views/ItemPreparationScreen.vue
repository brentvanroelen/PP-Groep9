<template>
  <div class="ItemsToPrepare">
    <div class="head">
      <button @click="decrementDate" class="readyButton">&larr;</button><h2>Items to prepare:</h2><button @click="incrementDate" class="readyButton">&rarr;</button>
    </div>
    <p>Today: {{ displayDate }}</p>
    
    <!-- Loept door de students -->
    <div v-for="student in students" :key="student.id" class="studentContainer">
      <div class="studentInfo">
        <p>Student: {{ student.name }}</p>
        <p>Pick-up date: {{ student.pickUpDate }}</p>
        <p>Pick-up time: {{ student.pickUpTime }}</p>
        <p v-if="student.reservationPrepared">The reservation is prepared</p>
        <p v-else>Status: {{ student.itemsToPrepare }} item{{ student.itemsToPrepare > 1 ? 's' : '' }} left to prepare</p>
      </div>
      <button @click="markAllItemsAsPrepared(student)" class="readyButton">Everything is ready</button>
      <button class="adjustButton">Adjustments</button>
      <button class="deleteButton" @click="deleteStudent(student.id)">Delete</button>
      <br>
      <button @click="toggleOrders(student)">&#9776;</button>
      <!-- lijst met reservaties van de studenten-->
      <ul v-if="student.showOrders" class="ordersList">
        <!-- Loept door de reservaties -->
        <li v-for="item in student.orders" :key="item.id" class="items">
          <p>Name: {{ item.ItemName }}</p>
          <p>Serial: {{ item.Serial }}</p>
          <p v-if="item.itemPrepared">Status: Item prepared</p>
          <p v-else>Status: Item not prepared</p>
          <button @click="markItemAsPrepared(student, item)" class= readyButton> item prepared</button>
        </li>
      </ul>
    </div>
  </div>
</template>

  
  
<script setup>
  import { onUnmounted, ref, watchEffect } from 'vue';
  import { getDocs,getDoc, collection, onSnapshot,db,where,query, updateDoc, doc } from '../Firebase/Index.js';
  
  
  let todayDate = new Date();
  let displayDate = ref(("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() +1)).slice(-2) + "/" + todayDate.getFullYear())
  let unsub = false;
  const students = ref([]) 
  const toggleOrders = (student) => {
    student.showOrders = !student.showOrders;
  }
  const getItems = async() =>{
    const reservations = collection(db, 'Utility/Reservations/All Reservations');
    const q = query(reservations, where("EndDate", "==", todayDate.getDate()), where("EndMonth", "==", todayDate.getMonth() + 1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let itemsToPrepare = 0;
      let items = [];
      for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
        items.push(doc.data()[`Item${i}`]);
        if(doc.data()[`Item${i}`].ItemPrepared == false){
            itemsToPrepare++;
          }
      }
      let date = new Date();
      date.setDate(doc.data().EndDate);
      date.setMonth(doc.data().EndMonth);
      let formattedDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth())).slice(-2) + "/" + date.getFullYear();
      students.value.push({
        id: doc.data().id,
        name: doc.data().User,
        pickUpDate: formattedDate,
        pickUpTime: 12,
        showOrders: false,
        orders: items,
        reservationPrepared: doc.data().ReservationPrepared,
        itemsToPrepare: itemsToPrepare
      });
    });
  }
  watchEffect(() => {
    console.log("watchEffect")
    const reservations = collection(db, 'Utility/Reservations/All Reservations');
    const q = query(reservations, where("EndDate", "==", todayDate.getDate()), where("EndMonth", "==", todayDate.getMonth()));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsToPrepare = 0;
      querySnapshot.forEach((doc) => {
        let items = [];
        for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
          console.log(doc.data())
          items.push(doc.data()[`Item${i}`]);
          if(doc.data()[`Item${i}`].ItemPrepared == false){
            itemsToPrepare++;
          }
        }
        let date = new Date();
        date.setDate(doc.data().EndDate);
        date.setMonth(doc.data().EndMonth);
        let formattedDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth())).slice(-2) + "/" + date.getFullYear();
        students.value.push({
          id: doc.data().id,
          name: doc.data().User,
          pickUpDate: formattedDate,
          pickUpTime: 12,
          showOrders: false,
          orders: items,
          reservationPrepared: doc.data().ReservationPrepared,
          itemsToPrepare: itemsToPrepare
        });
        console.log(students.value)
      });
      if(unsub){
        unsubscribe();
      }
    })
  })
  onUnmounted(() => {
    unsub = true;
  })
  const decrementDate = () => {
    students.value = [];
    todayDate.setDate(todayDate.getDate() - 1);
    displayDate.value = ("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "/" + todayDate.getFullYear()
    getItems();
  }
  const incrementDate = () => {
    students.value = [];
    todayDate.setDate(todayDate.getDate() + 1);
    displayDate.value = ("0" + todayDate.getDate()).slice(-2) + "/" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "/" + todayDate.getFullYear()
    getItems();
  }
  const markItemAsPrepared = async(student, item) => {
    console.log(student)
    console.log(item)
    student.itemsToPrepare--;
    item.itemPrepared = true;
    const docRef = doc(db, `Utility/Reservations/All Reservations/${student.id}`);
    if(student.itemsToPrepare == 0){
        student.reservationPrepared = true;
        await updateDoc(docRef, {
          [`Item${item.id}`]: {ItemPrepared: true},
          ReservationPrepared : true
        });
    }else{
        await updateDoc(docRef, {
          [`Item${item.id}`]: {ItemPrepared: true}
        });
    }
  }
  const markAllItemsAsPrepared = async(student) => {
    student.orders.forEach(item => {
      item.itemPrepared = true;
    });
    student.itemsToPrepare = 0;
    student.reservationPrepared = true;
    const docRef = doc(db, `Utility/Reservations/All Reservations/${student.id}`);
    for(let i = 1; i <= student.orders.length; i++)
      await updateDoc(docRef, {
        [`Item${item.id}`]: {ItemPrepared: true},
        ReservationPrepared : true
      });
  }
</script>
  
 <style scoped>
.ItemsToPrepare {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.ItemsToPrepare:hover {
  background-color: #ddd;
}
  
.studentContainer {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.studentContainer:hover {
    transform: translateY(-5px);
}

.readyButton {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    background-color: #4caf50;
    color: white;
    transition: background-color 0.3s;
    margin-bottom: 10px;
}

.readyButton:hover {
    background-color: #45a049; 
}

.adjustButton {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    background-color: #ff9800; 
    color: white;
    transition: background-color 0.3s;
    margin-bottom: 10px;
}

.adjustButton:hover {
    background-color: #f57c00; 
}

.deleteButton {
  padding: 8px 16px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border: none;
  border-radius: 20px; 
  background-color: #f44336; 
  color: #fff; 
  transition: background-color 0.3s;
  margin-bottom: 10px
}

.deleteButton:hover {
  background-color: #d32f2f;
}

.items {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.items:hover {
    background-color: #f0f0f0;
}

.items p {
  margin: 5px 0;
}

.items p:nth-child(even) {
  color: #777;
}

.toggleButton {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  border: none;
  background: #ddd;
  border-radius: 50%;
  padding: 10px;
  font-size: 1.5em;
  transition: background-color 0.3s, transform 0.3s;
}

.toggleButton:focus {
  outline: none;
}

.toggleButton:hover {
    background-color: #ccc; 
}
.head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

}
   
@media (max-width: 600px) {
  .ItemsToPrepare {
    padding: 10px;
  }
}
</style>
