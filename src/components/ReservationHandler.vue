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




const data = ref([]);
const chosenitem = ref();
const store = useStore();
const dates = useDates();
const cart = useCart();
const quantity = useQuantity();
const availableInstances = useChoiceOfItems();
const itemSelector = useItemSelector();
const user = useUserIdentification();
const selectedUser = useSelectedUser();
const itemsToGet = useItemsToGet();
const Warned = ref();
const popupVisible = ref(false);
const popupMessage = ref('');

let  items = []
let itemMaps = [];
let promises = [];
const {checkUserCart,buttonText,page} = defineProps({
    checkUserCart: Boolean,
    buttonText: String,
    page: String
})
const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};


const handleReservation = async() => {
    items = [];
    promises = [];
    itemMaps = [];
    if(!checkUserCart){
        let singleItem = store.results[0];
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
                console.log(singleItem)
                if(!quantity.available[singleItem.Name]){
                    console.log("Kit is not available")
                    return
                }
                for(let i = 0; i < singleItem.Items.length; i++){
                    itemSelector.setCollectionName(`${singleItem.Items[i]}kit${singleItem.Id}`);
                    console.log(itemSelector.itemName)
                    if(quantity.getQuantity(singleItem.Items[i]) == 0){
                        quantity.setQuantity(singleItem.Items[i], 1)
                    }
                    for(let j = 0; j < quantity.getQuantity(singleItem.Items[i]); j++){
                        const promise = await getItem().then(() =>markInstancesAsUnavailable(singleItem.Items[i]))
                        .then(() => changeAmountAvailable(singleItem.Items[i])).then(() => writeToHistory(chosenitem.value.Serial));
                        promises.push(promise);
                    }
                }
            }else{
                if(quantity.getQuantity(itemSelector.itemName) == 0){
                    quantity.setQuantity(itemSelector.itemName, 1)
                }
                for(let i = 0; i < quantity.getQuantity(itemSelector.itemName); i++){
                    const promise = getItem().then(markInstancesAsUnavailable(chosenitem.value.Name))
                    .then(changeAmountAvailable(chosenitem.value.Name)).then(() => writeToHistory(chosenitem.value.Serial,dates.dates[singleItem.Name]));
                    promises.push(promise);
                }
            }
            console.log(items)
            console.log(promises)
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
                    console.log(reservation)
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
                                for(let j = 0; j < quantity.getQuantity(item.Items[i]); j++){
                                    const promise = await getItem().then(() =>markInstancesAsUnavailable(item.Items[i]))
                                    .then(() => changeAmountAvailable(item.Items[i])).then(() => writeToHistory(chosenitem.value.Serial));
                                    promises.push(promise);
                                }
                            }
                        }else{
                            if(quantity.getQuantity(item.Name) == 0){
                                quantity.setQuantity(item.Name, 1)
                            }
                            console.log(item)
                            console.log(reservation)
                            itemSelector.setCollectionName(`${item.Name}`);
                            console.log(quantity.getQuantity(itemSelector.itemName))
                            for(let i = 0; i < quantity.getQuantity(itemSelector.itemName); i++){
                                const promise = await getItem().then(() =>markInstancesAsUnavailable(item.Name))
                                .then(() => changeAmountAvailable(item.Name)).then(() => writeToHistory(chosenitem.value.Serial));
                                promises.push(promise);
                            }
                        }
                    }
                    console.log(items)
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

const writeToHistory = async(serial,date) => {
  const docRef = doc(db, `Utility/History/Item History/${serial}`);
  
  // Haal de huidige staat van de Reservations-array op
  const docSnap = await getDoc(docRef);
  const currentReservations = docSnap.exists() ? docSnap.data().Reservations || [] : [];

  
  const newReservation = {
    StartDate: date[0],
    EndDate: date[2],
    StartMonth: date[1],
    EndMonth: date[3],
    User: selectedUser.user.uid,
  };

  // Voeg het nieuwe reserveringsobject toe aan de array
  const updatedReservations = [...currentReservations, newReservation];


  // Sla de bijgewerkte array op

  await setDoc(docRef, { Reservations: updatedReservations } , {merge: true});


}





const getItem = async() => {
    console.log(availableInstances)
    chosenitem.value = availableInstances.getInstance(itemSelector.itemName,[0]);
    console.log(chosenitem.value)
    availableInstances.getCollection(itemSelector.itemName).shift();
    console.log(availableInstances.getInstance(itemSelector.itemName,[0]));
    items.push(chosenitem.value);
    if(page == "HomeAdmin"){
        itemsToGet.addItem(chosenitem.value)
    }
    console.log(items)
    console.log(chosenitem.value)
}
const markInstancesAsUnavailable = async(name) => {
    let databaseName = databaseFormatter(name);
    const docRef = doc(db, `Items/${databaseName}/${databaseName} items/${chosenitem.value.Serial}`);
    await updateDoc(docRef, {
        Reserved: true
    });
}
const changeAmountAvailable = async(name) => {
    let databaseName = databaseFormatter(name);
    const docRef = doc(db, `Items/${databaseName}`);
    await updateDoc(docRef, {
        AvailableAmount: increment(-1)
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
    console.log(matchingArrays);
    return matchingArrays;
}
const orderCart = () => {
    let correctOrder = groupByDates(dates.dates);
    let orderedCart = correctOrder.map(group => {
        return group.map(name => {
            return cart.items.find(obj => obj.Name === name);
        });
    });
    console.log(orderedCart);
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