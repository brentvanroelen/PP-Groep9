<template>
    <button @click="handleReservation(itemObject)">submit</button>
</template>
<script setup>
import { useStore,useDates,useCart } from '@/Pinia/Store';
import { computed,ref } from 'vue';
import { db, query,where,collection,getDocs,setDoc,doc,updateDoc, increment} from "../Firebase/Index.js";

const data = ref([]);
const chosenitem = ref();

defineProps({
    itemObject: Object
})

const store = useStore();
const dates = useDates();
const cart = useCart();
let  items = []
let itemMaps = [];
let promises = [];
let checkUserCart = false


const handleReservation = async(itemObject = 0) => {
    store.updateResults(itemObject);
    if(!checkUserCart){
        if(dates.startDate != "" && dates.endDate != ""){
            if(itemObject.Available){
                const promise = getItems(itemObject.Name).then(() =>markInstanceAsUnavailable(itemObject.Name))
                .then(() => changeAmountAvailable(itemObject.Name));
                promises.push(promise);
            }else{
                console.log("Hoo boy i'm not looking forward to this")
            }
        }
    }else if(checkUserCart){
        if(dates.startDate != "" && dates.endDate != ""){
            for(let item of cart.items){
                console.log(item)
                if(item.Available){
                    const promise = getItems(item.Name).then(() =>markInstanceAsUnavailable(item.Name))
                    .then(() => changeAmountAvailable(item.Name));
                    promises.push(promise);
                }else{
                    console.log("Hoo boy i'm not looking forward to this")
                }
            }
        }
        Promise.all(promises)
        .then(() => {
            makeItemMap(items);
        })
        .then(() => MakeReservation())
    }else{
        alert("Please select a date range")
    }
   
}
const getItems = async(name) => {
    const creference = collection(db, `Items/${name.charAt(0).toUpperCase() 
                    + name.slice(1)}/${name.charAt(0).toUpperCase() 
                    + name.slice(1)} items`);
            console.log(creference);
            const reservedQuery = query(creference,where("Reserved", "==", false));
            const reservedSnapshot = await getDocs(reservedQuery);
            reservedSnapshot.forEach((doc) => {
                data.value.push(doc.data());
            });
            chosenitem.value = data.value[0];
            console.log(chosenitem.value.Serial);
            items.push(chosenitem.value);
            console.log(items);
}
const markInstanceAsUnavailable = async(name) => {
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
            Serial: item.Serial,
            issues:{
                User: "",
                Description: "",
                Image: "",
                IssueType: "",
            }
        }
    }));


}
const MakeReservation = async() => {
    const docRef = doc(db, "Reservations", "Tester" + " " + dates.startDate + " " + dates.endDate);
    await setDoc(docRef, {
        StartDate: dates.startDate,
        EndDate: dates.endDate,
        User: "Tester",
        ForProject: false,
        Extended: false,
        CurrentlyWithUser: false,
        ...Object.assign({}, ...itemMaps)
    });
}
</script>