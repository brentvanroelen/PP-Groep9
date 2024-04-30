<template>
    <button @click="handleReservation(item)">submit</button>
</template>
<script setup>
import { useStore,useDates,useCart } from '@/Pinia/Store';
import { computed,ref } from 'vue';
import { db, query,where,collection,getDocs,setDoc,doc,updateDoc, increment} from "../Firebase/Index.js";

const data = ref([]);
const chosenitem = ref();

defineProps({
    item: Object
})

const store = useStore();
const dates = useDates();
const cart = useCart();


const handleReservation = async(item) => {
    store.updateResults(item);
    cart.emptyCart();
    cart.addItem(item)
    console.log(cart.items)
    if(dates.startDate != "" && dates.endDate != ""){
        for(item of cart.items){
            console.log(item)
            if(item.Available){
                getItems(item.Name)
                .then(() =>MakeReservation(item.Name))
                .then(() =>markInstanceAsUnavailable(item.Name))
                .then(() => changeAmountAvailable(item.Name));
            }else{
                console.log("Hoo boy i'm not looking forward to this")
            }
        }
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
const MakeReservation = async(name) => {
    const docRef = doc(db, "Reservations", name + " " + "Tester" + " " + dates.startDate + " " + dates.endDate);
    await setDoc(docRef, {
        ItemName: name,
        StartDate: dates.startDate,
        EndDate: dates.endDate,
        User: "Tester",
        Serial: chosenitem.value.Serial,
        ForProject: false,
        Extended: false,
        CurrentlyWithUser: false
    });
}
</script>