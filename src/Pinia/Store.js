// store.js
import { defineStore } from 'pinia';
import { auth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from '@/Firebase/Index';
import { signOut } from 'firebase/auth';


export const useStore = defineStore({
  id: 'main',
  state: () => ({
    results: JSON.parse(localStorage.getItem('results')) || [],
  }),
  actions: {
    updateResults(results) {
      this.results = results;
      localStorage.setItem('results', JSON.stringify(results));
    }
  }
});
export const useDates = defineStore({
  id: 'Dates',
  state: () => ({
    dates: {
      
    }
  }),
  actions: {
    updateDate(item, datearray) {
      this.dates[item] = datearray;
    },
    resetDates(){
      this.dates = {}
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
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    itemNames: [],
    startDate: '',
    endDate: '', 
  }),
  actions: {
    addItem(item){
      this.items.push(item);
      this.itemNames.push(item.Name)
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    emptyCart(){
      this.items = [];
      localStorage.removeItem('cartItems');
    },
    removeItem(index){
      this.items.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    addStartDate(startDate, startMonth){
      this.startDate = startDate
    },
    addEndDate(endDate, endMonth){
      this.endDate = endDate
    }
  },

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
      if(this.quantity[item] === undefined){
        return 0
      }
      return this.quantity[item]
    },
    setavailable(available){
      this.available = available
    },
    resetQuantity(){
      this.quantity = {}
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
    },
    resetCollectionName(){
      this.itemName = ''
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
    register(credentials){
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
      const user = userCredential.user
      console.log(user)
      }).catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
      });
    },
    logOut(){
      signOut(auth).then(() => {
        console.log('User signed out')
      }).catch((error) => {
        console.log(error.message)
      });
    },
    login(credentials){
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
      const user = userCredential.user
      console.log(user)
      }).catch((error) => { 
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      });
    },
    updateUserId(userId){
      this.userId = userId
    }
  }
});
export const useCategories = defineStore({
  id: 'Categories',
  state: () => ({
    categories: ['Audio', 'Belichting', 'Tools', 'Varia', 'Video', 'XR']
  }),
  actions: {
    addCategory(category){
      this.categories.push(category)
    }
  }
});
