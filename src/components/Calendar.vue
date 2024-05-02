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
      <p v-if="selectedStartDate && selectedEndDate">
        Selected Date Range: {{ displayDate[0] }}/{{ String(displayDate[1]).padStart(2, '0') }} to {{ displayDate[2] }}/{{ String(displayDate[3]).padStart(2, '0') }}
            </p>
      <AvailabilityHandler></AvailabilityHandler>
    </div>
  </template>
  
  <script setup>
  import { ref  } from 'vue';
  import { computed } from 'vue';
  import { onMounted} from 'vue';
  import { useDates, useTrigger } from '@/Pinia/Store';
  import AvailabilityHandler from './AvailabilityHandler.vue';

    let currentMonth = ref(0);
    const currentYear = ref(0);
    const days = ref([]);
    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
    const displayDate = ref('');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthName = ref('');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    const trigger = useTrigger();




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
        /*selectedStartDate.value = null;
        selectedEndDate.value = null;
        useDates().$reset()*/
      };

      const previousMonth = () => {
        currentMonth.value = (currentMonth.value - 1 + 12) % 12;
        monthName.value = monthNames[currentMonth.value];
        if (currentMonth.value === 11) {
          currentYear.value--;
        }
        generateDays();
        /*selectedStartDate.value = null;
        selectedEndDate.value = null;
        useDates().$reset()*/
      };

  const selectDay = (day) => {
    const selectedDate = new Date(currentYear.value, currentMonth.value, day);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate >= currentDate) {
      if (!selectedStartDate.value) {
        selectedStartDate.value = selectedDate;
      } else if (!selectedEndDate.value && selectedDate >= selectedStartDate.value) {
        selectedEndDate.value = selectedDate;
        useDates().updateStartDate(selectedStartDate.value.getDate(), selectedStartDate.value.getMonth() + 1);
        useDates().updateEndDate(selectedEndDate.value.getDate(), selectedEndDate.value.getMonth() + 1);
        useTrigger().fireTrigger();
        displayDate.value = [selectedStartDate.value.getDate(),selectedStartDate.value.getMonth() + 1, selectedEndDate.value.getDate(),selectedEndDate.value.getMonth() + 1]
      } else {
        selectedStartDate.value = selectedDate;
        selectedEndDate.value = null;
        useDates().$reset()
      }
    }
  };
  const isSelected = (day) => {
    const date = new Date(currentYear.value, currentMonth.value, day);
    return (
      (selectedStartDate.value && date.getTime() === selectedStartDate.value.getTime()) ||
      (selectedEndDate.value && date.getTime() === selectedEndDate.value.getTime())
    );
};
    onMounted(() =>{
      monthName.value = setCurrentMonth();
      generateDays();
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
    background-color: #D9D9D9;
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
  border: 1px solid #D9D9D9;
}
.selected {
   background-color: #52810c;
}
.weekdays {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #D9D9D9;
  font-weight: bold;
}
button {
  background-color: #D9D9D9;
  border: none;
  padding: 10px;
  cursor: pointer;
}
.grayedOut {
  background-color: #D9D9D9;
}
</style>
  