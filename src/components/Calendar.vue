<template>
    <div class="calendar">
      <div class="header">
        <button @click="previousMonth">&larr;</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button @click="nextMonth">&rarr;</button>
      </div>
      <div class="days">
        <div
          v-for="day in days"
          :key="day"
          @click="selectDay(day)"
          :class="{ 'selected': isSelected(day) }"
        >
          {{ day }}
        </div>
      </div>
      <button @click="submitDateRange">Submit</button>
      <p v-if="selectedStartDate && selectedEndDate">
        Selected Date Range: {{ selectedStartDate }} to {{ selectedEndDate }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentMonth: 0,
        currentYear: 0,
        days: [],
        selectedStartDate: null,
        selectedEndDate: null,
      };
    },
    mounted() {
      this.setCurrentMonth();
      this.generateDays();
    },
    methods: {
      setCurrentMonth() {
        const currentDate = new Date();
        this.currentMonth = currentDate.getMonth();
        this.currentYear = currentDate.getFullYear();
      },
      generateDays() {
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        this.days = [];
        for (let i = 1; i <= daysInMonth; i++) {
          this.days.push(i);
        }
      },
      nextMonth() {
        this.currentMonth = (this.currentMonth + 1) % 12;
      if (this.currentMonth === 0) {
        this.currentYear++;
      }
      this.generateDays();
      },
      previousMonth() {
        this.currentMonth = (this.currentMonth - 1 + 12) % 12;
      if (this.currentMonth === 11) {
        this.currentYear--;
      }
      this.generateDays();
      },
      selectDay(day) {
        if (!this.selectedStartDate) {
          this.selectedStartDate = day;
        } else if (!this.selectedEndDate) {
          this.selectedEndDate = day;
        } else {
          // Reset selection if both start and end dates are already set
          this.selectedStartDate = day;
          this.selectedEndDate = null;
        }
      },
      isSelected(day) {
        return (
          (this.selectedStartDate && day === this.selectedStartDate) ||
          (this.selectedEndDate && day === this.selectedEndDate)
        );
      },
      submitDateRange() {
        // Send selectedStartDate and selectedEndDate to your backend for database storage
        // Example: Make an API call to save the date range
        console.log('Submitting date range:', this.selectedStartDate, this.selectedEndDate);
      },
      getMonthName(monthIndex) {
        const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames[monthIndex];
      },
    },
    computed: {
      currentMonthName() {
        return this.getMonthName(this.currentMonth);
      },
    },
  };
  </script>
  
  <style scoped>
  .calendar {
    background-color: white;
    color: black;
    width: 25%;
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
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .days div {
        width: calc(100% / 7);
        text-align: center;
        padding: 10px;
        border: 1px solid lightgray;
    }
  .selected {
    background-color: #f0f0f0;
  }
  </style>
  