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
    quantity: {

    },
    available: 0
  }),
  actions: {
    setQuantity(item,quantity){
      this.quantity[item] = quantity
    },
    getQuantity(item){
      return this.quantity[item]
    },
    setavailable(available){
      this.available = available
    }
  }

});
export const useChoiceOfItems = defineStore({
  id: 'ChoiceOfItems',
  state: () => ({
    items: {

    }
  }),
  actions: {
    createCollection(collection){
      this.items[collection] = []
    },
    addInstance(collection,item){
      this.items[collection].push(item)
    },
    getInstance(collection,itemIndex){
      return this.items[collection][itemIndex]
    },
    getCollection(collection){
      return this.items[collection]
    },
    resetAllItems(){
      this.items = {}
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
export const useItemSelector = defineStore({
  id: 'ItemSelector',
  state: () => ({
    itemName: '',
  }),
  actions: {
    setCollectionName(name){
      this.itemName = name
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
