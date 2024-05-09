<template>
    <button @click="handleReservation()">Loan now</button>
</template>
<script setup>
import { useStore,useDates,useCart, useQuantity, useChoiceOfItems, useItemSelector } from '@/Pinia/Store';
import { computed,ref } from 'vue';
import { db, query,where,collection,getDocs,setDoc,doc,updateDoc, increment} from "../Firebase/Index.js";
import AvailabilityHandler from "@/components/AvailabilityHandler.vue";


const data = ref([]);
const chosenitem = ref();
const store = useStore();
const dates = useDates();
const cart = useCart();
const quantity = useQuantity();
const availableInstances = useChoiceOfItems();
const itemSelector = useItemSelector();

let  items = []
let itemMaps = [];
let promises = [];
let checkUserCart = false


const handleReservation = async() => {

    items = [];
    promises = [];
    itemMaps = [];
    if(!checkUserCart){
        itemSelector.setCollectionName(`${store.results[0].Name}`);
        if(dates.startDate != "" && dates.endDate != ""){
            for(let i = 0; i < quantity.getQuantity(itemSelector.itemName); i++){
                const promise = getItem().then(markInstancesAsUnavailable(chosenitem.value.Name))
                .then(changeAmountAvailable(chosenitem.value.Name));
                promises.push(promise);
            }
            console.log(items)
            console.log(promises)
        }
    }else if(checkUserCart){
        if(dates.startDate != "" && dates.endDate != ""){
            for(let item of cart.items){
                console.log(item)
                if(item.Available){
                    const promise = getItem(item.Name).then(() =>markInstancesAsUnavailable(item.Name))
                    .then(() => changeAmountAvailable(item.Name));
                    promises.push(promise);
                }else{
                    console.log("Hoo boy i'm not looking forward to this")
                }
            }
        }
    }
    console.log("We got here")
    Promise.all(promises)
    .then(() => {
        makeItemMap(items);
    })
    .then(() => MakeReservation())
}
const getItem = async() => {
    chosenitem.value = availableInstances.getInstance(itemSelector.itemName,[0]);
    console.log(chosenitem.value)
    availableInstances.getCollection(itemSelector.itemName).shift();
    console.log(availableInstances.getInstance(itemSelector.itemName,[0]));
    items.push(chosenitem.value);
    console.log(items)
    console.log(chosenitem.value)
}
const markInstancesAsUnavailable = async(name) => {
    const docRef = doc(db, `Items/${name.charAt(0).toUpperCase() 
                    + name.slice(1)}/${name.charAt(0).toUpperCase() 
                    + name.slice(1)} items/${chosenitem.value.Serial}`);
    await updateDoc(docRef, {
        Reserved: true
    });
}
const changeAmountAvailable = async(name) => {
    const docRef = doc(db, `Items/${name.charAt(0).toUpperCase() 
                    + name.slice(1)}`);
    await updateDoc(docRef, {
        AvailableAmount: increment(-1)
    });
}
const makeItemMap = (items) =>{
    console.log(items)
    itemMaps = items.map((item, index) => ({
        [`Item${index + 1}`]: {
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
    }));


}
const MakeReservation = async() => {
    const docRef = doc(db, "Reservations", "Tester" + " " + dates.startDate + " " + dates.endDate);
    await setDoc(docRef, {
        ItemSerials: items.map(item => item.Serial.split("-")[0]).filter((serial, index, self) => self.indexOf(serial) === index),
        allItemSerials: items.map(item => item.Serial),
        allItemNames: items.map(item => item.Name),
        StartDate: dates.startDate,
        EndDate: dates.endDate,
        StartMonth: dates.startMonth,
        EndMonth: dates.endMonth,
        User: "Tester",
        ForProject: false,
        Extended: false,
        CurrentlyWithUser: false,
        ReservationPrepared: false,
        ...Object.assign({}, ...itemMaps)
    });
}
</script>