<template>
    <div id="buttons">
    <button @click="handleReservation()">{{ buttonText }}</button>
   <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" /> </div>
    
</template>
<script setup>
import { useItemsToGet,useSelectedUser,useStore,useDates,useCart, useQuantity, useChoiceOfItems, useItemSelector, useUserIdentification } from '@/Pinia/Store';
import { computed,ref } from 'vue';
import { db, query,where,collection,getDocs,setDoc,doc,updateDoc, increment , getDoc} from "../Firebase/Index.js";
import AvailabilityHandler from "@/components/AvailabilityHandler.vue";
import { databaseFormatter } from '@/js/functions.js';import Popup from './Popup.vue';
import { arrayUnion } from 'firebase/firestore';
import { useRouter } from 'vue-router';




const data = ref([]);
const chosenitem = ref();
const store = useStore();
const dates = useDates();
const cart = useCart();
const router = useRouter();
const quantity = useQuantity();
const availableInstances = useChoiceOfItems();
const itemSelector = useItemSelector();
const user = useUserIdentification();
const selectedUser = useSelectedUser();
const itemsToGet = useItemsToGet();
const Warned = ref();
const popupVisible = ref(false);
const popupMessage = ref('');
const itemQuantity = ref(0);

let  items = []
let itemMaps = [];
let promises = [];
const {checkUserCart,buttonText,page,item} = defineProps({
    checkUserCart: Boolean,
    buttonText: String,
    page: String,
    item: Object
})
const emit = defineEmits(['reservationplaced']);
const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

const updateStore = (item) => {
    store.updateResults([item]);
}

const handleReservation = async() => {
    items = [];
    promises = [];
    itemMaps = [];
    if(!checkUserCart){
        let singleItem;
        if(store.results.length == 1){
            singleItem = store.results[0];
        }else{
            singleItem = item
        }
        if(page != "HomeAdmin"){
            selectedUser.selectUser({
            firstName: user.user.firstName,
            lastName: user.user.lastName,
            uid: user.user.id
            })
        }
        dates.updateDate(singleItem.Name, dates.general)
        itemSelector.setCollectionName(`${singleItem.Name}`);
        if(dates.dates[itemSelector.itemName] !== undefined){
            if(singleItem.isKit){
                if(!quantity.available[singleItem.Name]){
                    console.log("Kit is not available")
                    return
                }
                for(let i = 0; i < singleItem.Items.length; i++){
                    itemSelector.setCollectionName(`${singleItem.Items[i]}kit${singleItem.Id}`);
                    if(quantity.getQuantity(singleItem.Items[i]) == 0){
                        quantity.setQuantity(singleItem.Items[i], 1)
                    }
                    for (let k = 1; k <= quantity.getQuantity(singleItem.Items[i]); k++){
                        itemQuantity.value = k;
                    }
                    try{
                    console.log('we got here')
                        await changeAmountAvailable(singleItem.Items[i],itemQuantity.value)
                    }catch(e){
                        console.error(e)
                        throw e
                    }
                    for(let j = 0; j < quantity.getQuantity(singleItem.Items[i]); j++){
                        const promise = await getItem().then(() =>markInstancesAsUnavailable(singleItem.Items[i]))
                        promises.push(promise);
                    }
                }
            }else{
                if(quantity.getQuantity(itemSelector.itemName) == 0){
                    quantity.setQuantity(itemSelector.itemName, 1)
                }
                for (let k = 1; k <= quantity.getQuantity(itemSelector.itemName); k++){
                        itemQuantity.value = k;
                    }
                    try{
                        console.log('we got here')
                        await changeAmountAvailable(itemSelector.itemName,itemQuantity.value)
                    }catch(e){
                        console.error(e)
                        throw e
                    }
                for(let i = 0; i < quantity.getQuantity(itemSelector.itemName); i++){
                    const promise = getItem().then(markInstancesAsUnavailable(chosenitem.value.Name))
                    .then(() => writeToHistory(chosenitem.value.Serial,dates.dates[singleItem.Name],user.user.firstName,user.user.lastName));
                    promises.push(promise);
                }
            }
            Promise.all(promises)
            .then(() => {
                makeItemMap(items);
            })
            .then(() => MakeReservation(dates.dates[singleItem.Name]))
        }
    }else if(checkUserCart){
        if(cart.items.length == 0){
            console.log("No items in cart")
        }else{
            if(page != "HomeAdmin"){
                selectedUser.selectUser({
                firstName: user.user.firstName,
                lastName: user.user.lastName,
                uid: user.user.id
                })
            }
            if(typeof selectedUser.user != "object"){
                console.log("No user selected")
                return
            }
            filterUnnecessaryDates();
            orderCart();
            if(Object.keys(dates.dates).length != 0){
                for(let reservation of cart.items){
                    items = [];
                    promises = [];
                    itemMaps = [];
                    for (let item of reservation){
                        if(item.isKit){
                            for(let i = 0; i < item.Items.length; i++){
                                itemSelector.setCollectionName(`${item.Items[i]}kit${item.Id}`);
                                if(quantity.getQuantity(item.Items[i]) == 0){
                                    quantity.setQuantity(item.Items[i], 1)
                                }
                                for (let k = 1; k <= quantity.getQuantity(item.Items[i]); k++){
                                    itemQuantity.value = k;
                                }
                                try{
                                    await changeAmountAvailable(item.Items[i],itemQuantity.value)
                                }catch(e){
                                    console.error(e)
                                    throw e
                                }
                                for(let j = 0; j < quantity.getQuantity(item.Items[i]); j++){
                                    const promise = await getItem().then(() =>markInstancesAsUnavailable(item.Items[i]))
                                    .then(() => changeAmountAvailable(item.Items[i]))
                                    promises.push(promise);
                                }
                            }
                        }else{
                            if(quantity.getQuantity(item.Name) == 0){
                                quantity.setQuantity(item.Name, 1)
                            }
                            itemSelector.setCollectionName(`${item.Name}`);
                            for (let k = 1; k <= quantity.getQuantity(itemSelector.itemName); k++){
                                itemQuantity.value = k;
                            }
                            try{
                                console.log('we got here')
                                await changeAmountAvailable(item.Name,itemQuantity.value)
                            }catch(e){
                                console.error(e)
                                throw e
                            }
                            for(let i = 0; i < quantity.getQuantity(itemSelector.itemName); i++){
                                const promise = await getItem().then(() =>markInstancesAsUnavailable(item.Name))
                                .then(() => writeToHistory(chosenitem.value.Serial,dates.dates[item.Name],user.user.firstName,user.user.lastName));
                                promises.push(promise);
                            }
                        }
                    }
                    await Promise.all(promises)
                    .then(() => {
                        makeItemMap(items);
                    })
                    .then(() => MakeReservation(dates.dates[reservation[0].Name]))
                }
                availableInstances.resetAllItems()
                cart.emptyCart();
                quantity.resetQuantity();
            }
        }
    }

}

const writeToHistory = async(serial,date,User,user) => {
  const docRef = doc(db, `Utility/History/Item History/${serial}`);
  
  // Haal de huidige staat van de Reservations-array op
  const docSnap = await getDoc(docRef);
  const currentReservations = docSnap.exists() ? docSnap.data().Reservations || [] : [];

  
  const newReservation = {
    StartDate: date[0],
    EndDate: date[2],
    StartMonth: date[1],
    EndMonth: date[3],
    firstName: User,
    lastName: user
  };

  // Voeg het nieuwe reserveringsobject toe aan de array
  const updatedReservations = [...currentReservations, newReservation];


  // Sla de bijgewerkte array op

  await setDoc(docRef, { Reservations: updatedReservations } , {merge: true});


}





const getItem = async() => {
    chosenitem.value = availableInstances.getInstance(itemSelector.itemName,[0]);
    availableInstances.getCollection(itemSelector.itemName).shift();
    console.log(availableInstances.getInstance(itemSelector.itemName,[0]));
    items.push(chosenitem.value);
    if(page == "HomeAdmin"){
        itemsToGet.addItem(chosenitem.value)
    }
}
const markInstancesAsUnavailable = async(name) => {
    let databaseName = databaseFormatter(name);
    const docRef = doc(db, `Items/${databaseName}/${databaseName} items/${chosenitem.value.Serial}`);
    await updateDoc(docRef, {
        Reserved: true
    });
}
const changeAmountAvailable = async(name,amount) => {
    let databaseName = databaseFormatter(name);
    const docRef = doc(db, `Items/${databaseName}`);
    await updateDoc(docRef, {
        AvailableAmount: increment(-amount)
    });
}
const makeItemMap = (items) =>{
    for (let item of cart.items){
        if(item.isKit){
            for(let i = 0; i < items.length; i++){
                let itemIndex = item.Items.indexOf(items[i].Name);
                if(item.Items.includes(items[i].Name)){
                    items[i].kitId = item.Id;
                    item.Items.splice(itemIndex, 1);
                }
            }
        }
    }
    itemMaps = items.map((item, index) => {
        let mappedItem = {
            [`Item${index + 1}`]: {
            id: index + 1,
            ItemName: item.Name,
            ItemImage: item.Image,
            Serial: item.Serial,
            issues:{
                User: "",
                Description: "",
                Image: "",
                IssueType: "",
            },
            ItemPrepared: false

        }
    };
    if(item.kitId){
        mappedItem[`Item${index + 1}`].belongsToKit = true;
        mappedItem[`Item${index + 1}`].KitId = item.kitId;
        
    }
    return mappedItem;
    });
}
const MakeReservation = async(date) => {
    const docRefUserReservation = doc(collection(db, `Users/${selectedUser.user.uid}/Reservations`));
    const docRefGeneralReservation = doc(db, `Reservations/${docRefUserReservation.id}`);
    const docRefAdminReservation = doc(db, `/Utility/Reservations/All Reservations/${docRefUserReservation.id}`);
    try{
        await setDoc(docRefUserReservation,{
            id: docRefUserReservation.id, 
            ItemSerials: items.map(item => item.Serial.split("-")[0]).filter((serial, index, self) => self.indexOf(serial) === index),
            allItemSerials: items.map(item => item.Serial),
            allItemNames: items.map(item => item.Name),
            StartDate: date[0],
            EndDate: date[2],
            StartMonth: date[1],
            EndMonth: date[3],
            User: selectedUser.user.uid,
            UserFirstName: selectedUser.user.firstName,
            UserLastName: selectedUser.user.lastName,
            ForProject: false,
            Extended: false,
            CurrentlyWithUser: false,
            ReservationPrepared: false,
            Warned: false,
            ...Object.assign({}, ...itemMaps)
        });
        await setDoc(docRefGeneralReservation,{
            id: docRefUserReservation.id, 
            ItemSerials: items.map(item => item.Serial.split("-")[0]).filter((serial, index, self) => self.indexOf(serial) === index),
            allItemSerials: items.map(item => item.Serial),
            StartDate: date[0],
            EndDate: date[2],
            StartMonth: date[1],
            EndMonth: date[3],
            ...Object.assign({}, ...itemMaps)
        });
        
        await setDoc(docRefAdminReservation,{
            id: docRefUserReservation.id, 
            ItemSerials: items.map(item => item.Serial.split("-")[0]).filter((serial, index, self) => self.indexOf(serial) === index),
            allItemSerials: items.map(item => item.Serial),
            allItemNames: items.map(item => item.Name),
            StartDate: date[0],
            EndDate: date[2],
            StartMonth: date[1],
            EndMonth: date[3],
            User: selectedUser.user.uid,
            UserFirstName: selectedUser.user.firstName,
            UserLastName: selectedUser.user.lastName,
            ForProject: false,
            Extended: false,
            CurrentlyWithUser: false,
            ReservationPrepared: false,
            Warned: false,
            ...Object.assign({}, ...itemMaps)
        });
        showPopup('The loan is succesfull!'); 
        itemSelector.resetCollectionName();
        dates.resetDates(true)

    }catch(e){
        console.error(e)
    
    }
}
const groupByDates = (itemsObject) => {
    let matchingArrays = [];
    let usedKeys = new Set();
    Object.keys(itemsObject).forEach((key1, index, arr) => {
        if (!usedKeys.has(key1)) {
            let arr1 = itemsObject[key1];
            let matchingGroup = [key1];

            arr.slice(index + 1).forEach((key2) => {
                if (!usedKeys.has(key2)) {
                    let arr2 = itemsObject[key2];
                    if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
                        matchingGroup.push(key2);
                        usedKeys.add(key2);
                    }
                }
            });

            if (matchingGroup.length > 1) {
                matchingArrays.push(matchingGroup);
                matchingGroup.forEach(key => usedKeys.add(key));
            }
        }
    });
    Object.keys(itemsObject).forEach(key => {
        if (!usedKeys.has(key)) {
            matchingArrays.push([key]);
        }
    });
    return matchingArrays;
}
const orderCart = () => {
    let correctOrder = groupByDates(dates.dates);
    let orderedCart = correctOrder.map(group => {
        return group.map(name => {
            return cart.items.find(obj => obj.Name === name);
        });
    });
    cart.items = orderedCart;
    return orderedCart;
}
const filterUnnecessaryDates = () => {    
    dates.dates = Object.fromEntries(
        Object.entries(dates.dates).filter(([key, value]) => cart.itemNames.includes(key))
    );
}
</script>
<style scoped>
 button{
    background-color: #dc3545;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin: 1em;
    color: white;
    border-radius: 20px;
    width: 300px;
    height: 50px;
  }
  button:hover{
    background-color: #c82333;
  }
  #buttons{
    width: 500px;
    display: flex;
    justify-content: center;
    margin: auto;
  }
  </style>