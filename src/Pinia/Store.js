// store.js
import { defineStore } from 'pinia';
import { auth,createUserWithEmailAndPassword,signInWithEmailAndPassword, collection, setDoc, db,doc, getDoc } from '@/Firebase/Index';
import { signOut,onAuthStateChanged } from 'firebase/auth';


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
    user: {
      id: '',
      email: '',
      type: '',
      firstName: '',
      lastName: '',
    }
  }),
  actions: {
    initialize(){
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('user:' , user)
          this.user.id = user.uid
          this.user.email = user.email
          const docreference = doc(db, 'Users', user.uid)
          getDoc(docreference).then((doc) => {
            if(doc.exists()){
              this.user.id = user.uid
              this.user.email = user.email
              this.user.type = doc.data().type
              this.user.firstName = doc.data().firstName
              this.user.lastName = doc.data().lastName
              if(this.user.type === 'student'){
                this.router.push('/')
              }else if (this.user.type === 'admin'){
                this.router.push('/HomeAdmin')
              }else{
                this.router.push('/')
              }
            }
        })
        } else {
          console.log('user logged out')
          this.user = {}
          this.router.replace('/login')
        }
      })
    },
    register(credentials){
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
      const user = userCredential.user

      const docreference = doc(db,"Users", user.uid)
      setDoc(docreference, {
        type: 'student',
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        uid: user.uid,
        email: credentials.email,
      })
      this.user.id = user.uid
      this.user.email = credentials.email
      this.user.type = 'student'
      this.user.firstName = credentials.firstName
      this.user.lastName = credentials.lastName
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
        this.router.push('/login')
      }).catch((error) => {
        console.log(error.message)
      });
    },
    login(credentials){
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
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
export const useKitItems = defineStore({
  id: 'kitItems',
  state: () => ({
    selectedItems: []
  }),
  actions: {
    addItem(itemArray){
      
      this.selectedItems.push(...itemArray);
    }
  }
});
