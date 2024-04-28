<template>
    <div class="calendar">
      <div class="header">
        <button @click="previousMonth">&larr;</button>
        <h2>{{ monthName }} {{ currentYear }}</h2>
        <button @click="nextMonth">&rarr;</button>
      </div>
      <div class="days" >
        <!-- weekdays -->
        <div
        class="day"
        v-for="day in daysOfWeek"
        :key="day"
      >{{ day }}</div>
      <!-- blank days -->
      <div
          v-for="blank in blanks()"
          :key="blank"></div>
        <!-- dates -->
        <div
          v-for="day in days.values()"
          :key="day"
          @click="selectDay(day)"
          :class="{ 'selected': isSelected(day), 'grayedOut': grayedOut(day)  }">
          {{ day }}
        </div>
      </div>
      <button @click="submitDateRange">Submit</button>
      <p v-if="selectedStartDate && selectedEndDate">
        Selected Date Range: {{ selectedStartDate }} to {{ selectedEndDate }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { computed } from 'vue';
  import { onMounted } from 'vue';
  import { useDates } from '@/Pinia/Store';

  
      let currentMonth = ref(0);
      const currentYear = ref(0);
      const days = ref([]);
      const selectedStartDate = ref(null);
      const selectedEndDate = ref(null);
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const monthName = ref('');
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentDate = new Date();

      const setCurrentMonth = () => {
        currentMonth.value = currentDate.getMonth();
        currentYear.value = currentDate.getFullYear();
        
        console.log(currentMonth.value)
        return monthNames[currentMonth.value];
      };

      const generateDays = () => {
        const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
        days.value = [];
        for (let i = 1; i <= daysInMonth; i++) {
          days.value.push(i);
        }
      };
      const grayedOut = (day) => {
        if(day < currentDate.getDate() && currentMonth.value <= currentDate.getMonth() && currentYear.value === currentDate.getFullYear() ||  currentMonth.value < currentDate.getMonth() ){
          return true;
        }else{
          return false;
        }
        
      };

      const blanks = () => {
        const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 0);
        return new Array(firstDayOfMonth.getDay()).fill('');
      };

      const nextMonth = () => {
        currentMonth.value = (currentMonth.value + 1) % 12;
        monthName.value = monthNames[currentMonth.value];
        if (currentMonth.value === 0) {
          currentYear.value++;
        }
        generateDays();
      };

      const previousMonth = () => {
        currentMonth.value = (currentMonth.value - 1 + 12) % 12;
        monthName.value = monthNames[currentMonth.value];
        if (currentMonth.value === 11) {
          currentYear.value--;
        }
        generateDays();
      };

      const selectDay = (day) => {
        if(day >= currentDate.getDate() && currentMonth.value 
        >= currentDate.getMonth() ||  currentMonth.value > 
        currentDate.getMonth() ){
          if (!selectedStartDate.value) {
            selectedStartDate.value = day;
          } else if (!selectedEndDate.value && day >= selectedStartDate.value) {
            selectedEndDate.value = day;
          } else {
            // Reset selection if both start and end dates are already set
            selectedStartDate.value = day;
            selectedEndDate.value = null;
          }
        }
      console.log(day)
      };

      const isSelected = (day) => {
        return (
          (selectedStartDate.value && day === selectedStartDate.value) ||
          (selectedEndDate.value && day === selectedEndDate.value)
        );
      };

      const submitDateRange = () => {
        useDates().updateStartDate(selectedStartDate.value);
        useDates().updateEndDate(selectedEndDate.value);
        console.log(useDates().startDate)
        console.log(useDates().endDate)
      };


      
    onMounted(() =>{
      generateDays();
      monthName.value = setCurrentMonth();
    });
    
  </script>
  
  <style scoped>
  .calendar {
    background-color: white;
    color: black;
    width: 500px;
    margin: auto;
}

.header {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px;
    background-color: lightgray;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1em;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1px;
}

.days div {
  text-align: center;
  padding: 10px;
  border: 1px solid lightgray;
}
.selected {
   background-color: lightgreen;
}
.weekdays {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: lightgray;
  font-weight: bold;
}
button {
  background-color: lightgray;
  border: none;
  padding: 10px;
  cursor: pointer;
}
.grayedOut {
  background-color: lightgray;
}
</style>
  