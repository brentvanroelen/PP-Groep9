<template>
  <div class="ItemsToPrepare">
    <h2>Items to prepare:</h2>
    
    <!-- Loept door de students -->
    <div v-for="student in students" :key="student.id" class="studentContainer">
      <div class="studentInfo">
        <p>Student: {{ student.name }}</p>
        <p>Pick-up date: {{ student.pickUpDate }}</p>
        <p>Pick-up time: {{ student.pickUpTime }}</p>
      </div>
      <button class="readyButton">Everything is ready</button>
      <button class="adjustButton">Adjustments</button>
      <button class="deleteButton" @click="deleteStudent(student.id)">Delete</button>
      <br>
      <button @click="toggleOrders(student)">▾</button>
      <!-- lijst met reservaties van de studenten-->
      <ul v-if="student.showOrders" class="ordersList">
        <!-- Loept door de reservaties -->
        <li v-for="order in student.orders" :key="order.id" class="items">
          <p>Name: {{ order.name }}</p>
          <p>Serial: {{ order.serial }}</p>
          <p>Brand: {{ order.brand }}</p>
          <p>Location: {{ order.location }}</p>
          <p>Status: {{ order.status }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

  
  
  <script>
  export default {
    data() {
      return {
        students: [
          {
            id: 1,
            name: 'Fredrick Thompson',
            pickUpDate: '27-03-2024',
            pickUpTime: '10:30', 
            showOrders: false,
            orders: [
              { id: 1, name: 'Camera', serial: 'CA-24', brand: 'Sony', location: 'Closet 6 Shelf 4', status: 'Uitgeleend tot 27/03/2024 10:30' }, 
              { id: 2, name: 'Statief', serial: 'ST-33', brand: 'Sony', location: 'Closet 15 helf 7', status: 'Beschikbaar' }, 
              { id: 3, name: 'Greenscreen', serial: 'GS-02', brand: 'Greenindustries', location: 'Closet 3 shelf 1', status: 'Beschikbaar'}, 
              { id: 4, name: 'Statief', serial: 'ST-27', brand: 'Sony', location: 'Closet 6 shelf 3', status: 'Beschikbaar'}
            ]
          },
          {
            id: 2,
            name: 'Samuel Lemmings', 
            pickUpDate: '27/03/2024', 
            pickUpTime: '11:30', 
            showOrders: false,
            orders: [
              { id: 1, name: 'VR Oculus Rift', serial: 'OR', brand:'Meta' ,location: 'Closet 3 Shelf 5', status: 'Beschadigd' },
              { id: 2, name: 'Statief', serial: 'ST-39', brand:'Sony' ,location: 'Closet 6 Shelf 5', status: 'Beschikbaar' },
              { id: 3, name: 'Microfoon', serial: 'MC-14', brand:'DPA Microphones' ,location: 'Closet 12 Shelf 6', status: 'Versleten kabel' },
              { id: 4, name: 'Speaker', serial: 'SP-42', brand:'Adam Audio' ,location: 'Closet 9 Shelf 15', status: 'Beschikbaar' }
            ]
          },
          {
            id: 3,
            name: 'Bob Wouters',
            pickUpDate: '29/03/2024',
            pickUpTime: '09:45', 
            showOrders: false,
            orders: [
              { id: 4, name: 'Tablet', serial: 'DEF456', location: 'Shelf C', status: 'Ready' }
            ]
          }
        ]
      };
    },
    methods: {
      toggleOrders(student) {
        student.showOrders = !student.showOrders;
      }
    }
  };
  </script>
  
 <style scoped>
.ItemsToPrepare {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

.studentContainer {
  position: relative;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
}

.studentInfo {
  margin-bottom: 10px;
}


.readyButton,
.adjustButton,
.deleteButton {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  border: none;
  border-radius: 20px; 
  background-color: #f44336; 
  color: white; 
}

.readyButton:hover,
.adjustButton:hover,
.deleteButton:hover {
  opacity: 0.8;
}

.items {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 5px;
}

.items p {
  margin: 5px 0;
}

.items p:nth-child(even) {
  color: #666;
}

.toggleButton {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1.5em;
}

.toggleButton:focus {
  outline: none;
}


@media (max-width: 600px) {
  .ItemsToPrepare {
    padding: 0 10px;
  }
}


</style>
