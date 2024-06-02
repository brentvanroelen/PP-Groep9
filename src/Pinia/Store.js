// store.js
import { defineStore } from 'pinia';
import { auth,createUserWithEmailAndPassword,signInWithEmailAndPassword, collection, setDoc, db,doc, getDoc } from '@/Firebase/Index.js';
import { signOut,onAuthStateChanged } from 'firebase/auth';


export const useStore = defineStore({
  id: 'main',
  state: () => ({
    results: [],
  }),
  actions: {
    updateResults(results) {
      this.results = results;
    }
  },
  persistedState: {
    persist: false,
  },
});
export const useDates = defineStore({
  id: 'Dates',
  state: () => ({
    dates: {
      
    },
    general: [], 
    allDatesSetToGeneral: false

  }),
  actions: {
    updateDate(item, datearray) {
      this.dates[item] = datearray;
    },
    resetDates(all){
      this.dates = {}
      if(all){
        this.allDatesSetToGeneral = false
        this.general = []
      }
    },
    resetGeneralDates(){
      this.general = []
    },
    updateGeneralDates(datearray){
      this.general = datearray
    },
    updateAllDatesToGeneral(){
      Object.keys(this.dates).forEach(key => {
        this.dates[key] = this.general;
      })
      this.allDatesSetToGeneral = true
    }
  }

});
export const useCart = defineStore({
  id: 'Cart',
  state: () => ({
    items: [],
    itemNames: [],
  }),
  actions: {
    addItem(item){
      this.items.push(item);
      this.itemNames.push(item.Name)
    },
    emptyCart(){
      this.items = [];
      this.itemNames = [];
      localStorage.removeItem('cartItems');
    },
    removeItem(index){
      this.items.splice(index, 1);
    },
  },

});
export const useQuantity = defineStore({
  id: 'Quantity',
  state: () => ({
    quantity: {

    },
    available: {}
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
    setavailable(kit, available){
      this.available[kit] = available
    },
    resetQuantity(){
      this.quantity = {}
      this.available = {}
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
      console.log(collection, item)
      console.log(this.items)
      this.items[collection].push(item)
    },
    addKitInstance(collection, item){
      console.log(collection)
      console.log(this.items)
      console.log(this.items[collection])
      this.items[collection].push(item)
      console.log(this.items[collection])
    },
    getInstance(collection,itemIndex){
      return this.items[collection][itemIndex]
    },
    getCollection(collection){
      return this.items[collection]
    },
    resetAllItems(){
      this.items = {}
    },
    resetCollection(collection){
      this.items[collection] = []
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
      warningCount: 0
    },
    loading: true,
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
              this.auth = auth
              this.user.id = user.uid
              this.user.email = user.email
              this.user.type = doc.data().type
              this.user.firstName = doc.data().firstName
              this.user.lastName = doc.data().lastName
              this.user.warningCount = doc.data().warningCount
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
        this.loading = false;
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
        warningCount: 0
      })
      this.user.id = user.uid
      this.user.email = credentials.email
      this.user.type = 'student'
      this.user.firstName = credentials.firstName
      this.user.lastName = credentials.lastName
      this.user.warningCount = 0
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
  },
  getters: {
  isLoggedIn(state){
    return !!state.user.id;
  }},
  persistedState: {
    persist: false,
  },
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
export const useReportedItems = defineStore({
  id: 'reportedItems',
  state: () => ({
    itemImage: '',
    itemName: '',
    itemSerial: '',
  }),
  actions: {
    addName(itemName){
      this.itemName = itemName
    },
    addImage(itemImage){
      this.itemImage = itemImage
    },
    addSerial(itemSerial){
      this.itemSerial= itemSerial
    },
    
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
export const useSearchedItems = defineStore({
  id: 'searchedItems',
  state: () => ({
    item: []
  }),
  actions: {
    addSearchedItem(item){
      this.item.push(item)
    } 
  }
});
export const useSelectedUser = defineStore({
  id: 'selectedUser',
  state: () => ({
    user: 0
  }),
  actions: {
    selectUser(user){
      this.user = user
    }
  }
});
export const useEarlyReturnsReservations = defineStore({
  id: 'EarlyReturnsReservations',
  state: () => ({
    Reservations: []
  }),
  actions: {
    addReservation(reservation){
      this.Reservations.push(reservation)
    }
  },
  persistedState: {
    persist: false,
  },
});
export const useItemsToGet = defineStore({
  id: 'ItemsToGet',
  state: () => ({
    items: []
  }),
  actions: {
    addItem(item){
      this.items.push(item)
    }
  }
});
export const useKitToBeMade = defineStore({
  id: 'KitToBeMade',
  state: () => ({
    kit: ''
  }),
  actions: {
    addKit(kit){
      this.kit = kit
    },
    getKitName(){
      return this.kit.Name
    }
  }
});

