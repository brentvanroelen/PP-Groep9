<template>
    <div @datesSelected="handleAvailability"></div>
</template>
<script setup>
import { useStore,useDates,useQuantity, useChoiceOfItems, useTrigger } from '@/Pinia/Store';
import { collection, getDocs, query, db, where} from '../Firebase/Index.js';
import { watch,ref, computed } from 'vue';

const store = useStore();
const dates = useDates();
const quantity = useQuantity();
const availableInstances = useChoiceOfItems();
const trigger = useTrigger(); 
const triggergetter = computed(() => trigger.trigger);

watch(triggergetter, async() => {
    if(trigger.trigger){
        handleAvailability();
        trigger.fireTrigger()
    }
});

const handleAvailability = async() => {
    availableInstances.items = [];
    for (let item of store.results) {
        if(dates.startDate != "" && dates.endDate != ""){
            if(quantity.quantity != 0){
                await getAvailableItems(item.Name);
                console.log(availableInstances.items);
                if(availableInstances.items.length < quantity.quantity){
                    await getNonConflictingReservedItems(item.SerialSeries);
                    /* CALL RESERVATION HANDLER*/ 

                }else{

                    /* CALL RESERVATION HANDLER*/
                }
            }else{
                getAvailableItems(item.Name).then(() => getNonConflictingReservedItems(item.SerialSeries));
                console.log(availableInstances.items);
               
                /* CALL RESERVATION HANDLER*/
            }
        }else{
            console.log("Please select a date range")

        }
    }
}
const dateifierUser = (startdateuser, startmonthuser, enddateuser, endmonthuser) => {
    let startuser = new Date();
    let enduser = new Date();
    startuser.setDate(startdateuser);
    startuser.setMonth(startmonthuser - 1);
    enduser.setDate(enddateuser);
    enduser.setMonth(endmonthuser - 1);
    return [startuser, enduser];
}
const dateifierRes = (startdateres,startmonthres,enddateres,endmonthres) => {
    let startres = new Date();
    let endres = new Date();
    startres.setDate(startdateres);
    startres.setMonth(startmonthres - 1);
    endres.setDate(enddateres);
    endres.setMonth(endmonthres - 1);
    return [startres, endres];
}
const getAvailableItems = async(name) => {
    const creference = collection(db, `Items/${name.charAt(0).toUpperCase() 
        + name.slice(1)}/${name.charAt(0).toUpperCase() 
        + name.slice(1)} items`);
    console.log(creference);
    const reservedQuery = query(creference,where("Reserved", "==", false));
    const reservedSnapshot = await getDocs(reservedQuery);
    reservedSnapshot.forEach((doc) => {
        availableInstances.items.push(doc.data());
    });
}
const getNonConflictingReservedItems = async(serialseries) => {
    const Userdates = dateifierUser(dates.startDate, dates.startMonth, dates.endDate, dates.endMonth);
    const creference = collection(db, "Reservations");
    const reservedQuery = query(creference,where("ItemSerials", "array-contains" , serialseries));
    const reservedSnapshot = await getDocs(reservedQuery);
    console.log(reservedSnapshot.size);
    reservedSnapshot.forEach((doc) => {
        const Resdates = dateifierRes(doc.data().StartDate, doc.data().StartMonth, doc.data().EndDate, doc.data().EndMonth);
        console.log(Userdates);
        console.log(Resdates);
        if( Userdates[1] <= Resdates[0] || Userdates[0] >= Resdates[1]){
            console.log("No conflicts");
            availableInstances.items.push(doc.data());
            console.log(availableInstances.items);
        }else{
            console.log("No items available");
            console.log(availableInstances.items);
        }
    });
}


</script>