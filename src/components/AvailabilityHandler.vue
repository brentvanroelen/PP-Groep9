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
let arraynumber = 1;
let Nonconflictingreserveditems = [];

watch(triggergetter, async() => {
    if(trigger.trigger){
        handleAvailability();
        trigger.fireTrigger()
    }
});

const handleAvailability = async() => {
    arraynumber = 1;
    availableInstances.resetAllItems();
    for (let item of store.results) {
        if(dates.startDate != "" && dates.endDate != ""){
            getAvailableItems(item.Name,item.SerialSeries);
            /* CALL RESERVATION HANDLER*/
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
const getAvailableItems = async(name,serial) => {
    const creference = collection(db, `Items/${name.charAt(0).toUpperCase() 
        + name.slice(1)}/${name.charAt(0).toUpperCase() 
        + name.slice(1)} items`);
    await getNonConflictingReservedItems(serial)
    const reservedSnapshot = await getDocs(creference);
    reservedSnapshot.forEach((doc) => {
        if(doc.data().Reserved == false || Nonconflictingreserveditems.includes(doc.data().Serial)){
            availableInstances.addInstance(arraynumber,doc.data());
        }else{
            availableInstances.getInstance(arraynumber);
        }
    });
    arraynumber++
}
const getNonConflictingReservedItems = async(serialseries) => {
    Nonconflictingreserveditems = [];
    let blacklist = []
    const Userdates = dateifierUser(dates.startDate, dates.startMonth, dates.endDate, dates.endMonth);
    const creference = collection(db, "Reservations");
    const reservedQuery = query(creference,where("ItemSerials", "array-contains" , serialseries));
    const reservedSnapshot = await getDocs(reservedQuery);
    reservedSnapshot.forEach((doc) => {
        const Resdates = dateifierRes(doc.data().StartDate, doc.data().StartMonth, doc.data().EndDate, doc.data().EndMonth);
        if( Userdates[1] <= Resdates[0] || Userdates[0] >= Resdates[1]){
            for(let i = 1; i <= 10; i++){
                if(doc.data()[`Item${i}`] != undefined){
                    if(doc.data()[`Item${i}`].Serial.split("-")[0] == serialseries && !Nonconflictingreserveditems.includes(doc.data()[`Item${i}`].Serial)){
                        Nonconflictingreserveditems.push(doc.data()[`Item${i}`].Serial)
                    };
                }else{
                    break;
                }
            }
        }else{
            for(let i = 1; i <= 10; i++){
                if(doc.data()[`Item${i}`] != undefined){
                    if(doc.data()[`Item${i}`].Serial.split("-")[0] == serialseries){
                        blacklist.push(doc.data()[`Item${i}`].Serial)
                    };
                }else{
                    break;
                }
            }
        }
        Nonconflictingreserveditems = Nonconflictingreserveditems.filter(item => !blacklist.includes(item));
    });
}


</script>