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
export const useCart = defineStore({
  id: 'Cart',
  state: () => ({
    items: [],
  }),
  actions: {
    addItem(item){
      this.items.push(item)
    },
    emptyCart(){
      this.items = []
    }
  }

});
export const useOptions = defineStore({
  id: 'Options',
  state: () => ({
    options: []
  }),
  actions: {
    updateOptions(options){
      this.options = options
    }
  }
})