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
    endDate: '',
    startMonth: '',
    endMonth: '',
  }),
  actions: {
    updateStartDate(startDate, startMonth) {
      this.startDate = startDate;
      this.startMonth = startMonth;
    },
    updateEndDate(endDate, endMonth) {
      this.endDate = endDate;
      this.endMonth = endMonth;
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
export const useQuantity = defineStore({
  id: 'Quantity',
  state: () => ({
    quantity: 0,
  }),
  actions: {
    setQuantity(quantity){
      this.quantity = quantity
    }
  }

});
export const useChoiceOfItems = defineStore({
  id: 'ChoiceOfItems',
  state: () => ({
    items: [],
  }),
  actions: {
    addInstance(instance){
      this.items.push(instance)
    }
  }

});
export const useTrigger = defineStore({
  id: 'Trigger',
  state: () => ({
    trigger: false,
  }),
  actions: {
    fireTrigger(){
      this.trigger = !this.trigger
    }
  }

});
