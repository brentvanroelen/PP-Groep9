// store.js
import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    results: []
  }),
  actions: {
    updateResults(results) {
      this.results = results;
    }
  }
});
export const useDates = defineStore({
  id: 'Dates',
  state: () => ({
    startDate: '',
    endDate: ''
  }),
  actions: {
    updateStartDate(startDate) {
      this.startDate = startDate;
    },
    updateEndDate(endDate) {
      this.endDate = endDate;
    }
  }

});