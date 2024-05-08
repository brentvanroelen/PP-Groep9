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
    startDate: '',
    endDate: '', 
  }),
  actions: {
    addItem(item){
      this.items.push(item)
    },
    emptyCart(){
      this.items = []
    },
    addStartDate(startDate, startMonth){
      this.startDate = startDate
    },
    addEndDate(endDate, endMonth){
      this.endDate = endDate
    }
  }

});
export const useQuantity = defineStore({
  id: 'Quantity',
  state: () => ({
    quantity: 1,
    available: 0
  }),
  actions: {
    setQuantity(quantity){
      this.quantity = quantity
    },
    setavailable(available){
      this.available = available
    }
  }

});
export const useChoiceOfItems = defineStore({
  id: 'ChoiceOfItems',
  state: () => ({
    items1: [],
    items2: [],
    items3: [],
    items4: [],
    items5: [],
    items6: [],
  }),
  actions: {
    addInstance(array,item){
      this[`items${array}`].push(item)
    },
    getInstance(array){
      return this[`items${array}`]
    },
    resetAllItems(){
      this.items1 = []
      this.items2 = []
      this.items3 = []
      this.items4 = []
      this.items5 = []
      this.items6 = []
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
export const useArraynumber = defineStore({
  id: 'Arraynumber',
  state: () => ({
    arraynumber: 1
  }),
  actions: {
    setArraynumber(arraynumber){
      this.arraynumber = arraynumber
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
});
export const useUserIdentification = defineStore({
  id: 'UserIdentification',
  state: () => ({
    userId: ''
  }),
  actions: {
    updateUserId(userId){
      this.userId = userId
    }
  }
});
