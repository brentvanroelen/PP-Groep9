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
      <AvailabilityHandler :page="page"></AvailabilityHandler>
    </div>
</template>
  
<script setup>
  import { ref, onMounted, computed  } from 'vue';
  import { useDates, useTrigger, useUserIdentification, useStore } from '@/Pinia/Store';
  import AvailabilityHandler from './AvailabilityHandler.vue';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { db } from '@/Firebase/Index.js';

  const test = useStore()
  const monday = ref();
  const tuesday = ref();
  const wednesday = ref();
  const thursday = ref();
  const friday = ref();
  const student = ref();
  const teacher = ref();


  const fetchData = async () => {
  const docRef = doc(db, "Settings", "Options");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()){
    const data = docSnap.data();
    student.value = data.student;
    teacher.value = data.teacher;
    monday.value = data.monday;
    tuesday.value = data.tuesday;
    wednesday.value = data.wednesday;
    thursday.value = data.thursday;
    friday.value = data.friday;
  }
  
  }

  let currentMonth = ref(0);
  const currentYear = ref(0);
  const dates = useDates();
  const user = useUserIdentification();
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

  const {page,item} = defineProps({
    page: String,
    item: {
      type: String,
      default: "global"
    }
  });


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
    const date = new Date(currentYear.value, currentMonth.value, day);
    const Weekend = date.getDay() === 0 || date.getDay() === 6;
    

    if( Weekend || day < currentDate.getDate() && currentMonth.value <= currentDate.getMonth() && currentYear.value === currentDate.getFullYear() ||  currentMonth.value < currentDate.getMonth() || monday.value === false && date.getDay() === 1 || tuesday.value === false && date.getDay() === 2 || wednesday.value === false && date.getDay() === 3 || thursday.value === false && date.getDay() === 4 || friday.value === false && date.getDay() === 5 ){
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
    const date = new Date(currentYear.value, currentMonth.value, day);
    const selectedDate = new Date(currentYear.value, currentMonth.value, day);
    const maxReservationDays = 14;
    const currentDateStartOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const selectedDateStartOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const diffInMilliseconds = selectedDateStartOfDay - currentDateStartOfDay;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    let duration = 0;

    if (isWeekend) {
      return;
    }
    if(monday.value === false && date.getDay() === 1 || tuesday.value === false && date.getDay() === 2 || wednesday.value === false && date.getDay() === 3 || thursday.value === false && date.getDay() === 4 || friday.value === false && date.getDay() === 5){
      return;
    }
    if(user.user.type === "student" ){
      duration = student.value * 7 +1;
    }else if(user.user.type === "docent"){
      duration = teacher.value * 7 +1;
    }
    console.log(test.values)
    console.log(duration)
    if (selectedDateStartOfDay >= currentDateStartOfDay && diffInDays <= maxReservationDays) {
      const maxAllowedDuration = 7; 
      if (!selectedStartDate.value) {
        selectedStartDate.value = selectedDateStartOfDay;
      } else if (!selectedEndDate.value && selectedDateStartOfDay >= selectedStartDate.value) {
        const diffInDays = Math.ceil((selectedDateStartOfDay - selectedStartDate.value) / (1000 * 60 * 60 * 24));
        if (diffInDays <= maxAllowedDuration) {
          selectedEndDate.value = selectedDateStartOfDay;
          let dateInfo = [selectedStartDate.value.getDate(), selectedStartDate.value.getMonth() + 1, selectedEndDate.value.getDate(), selectedEndDate.value.getMonth() + 1]
          dates.updateDate(item,dateInfo)
          console.log(dates.dates)
          useTrigger().fireTrigger();
          displayDate.value = [
            selectedStartDate.value.getDate(),
            selectedStartDate.value.getMonth() + 1,
            selectedEndDate.value.getDate(),
            selectedEndDate.value.getMonth() + 1
            ];
          } else {
            // Voorlopige alert, moet nog aangepast worden ==>popup
            alert("Maximum loan period exceeded.");
          }
      } else {
          selectedStartDate.value = selectedDateStartOfDay;
          selectedEndDate.value = null;
          dates.resetDates();
      }
    } else {
      alert("Reservation is only possible up to a maximum of 14 days in advance.");
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
    

  onMounted(() => {
    fetchData();
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
  