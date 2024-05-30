<template>
    <div @datesSelected="handleAvailability"></div>
</template>
<script setup>
import { useStore,useDates,useQuantity, useChoiceOfItems, useTrigger, useCart } from '@/Pinia/Store';
import { collection, getDocs, query, db, where} from '../Firebase/Index.js';
import { watch,ref, computed } from 'vue';
import { databaseFormatter } from '@/js/functions.js';

const store = useStore();
const dates = useDates();
const quantity = useQuantity();
const cart = useCart();
const availableInstances = useChoiceOfItems();
const trigger = useTrigger(); 
const triggergetter = computed(() => trigger.trigger);
let Nonconflictingreserveditems = [];


const {page,isKit} = defineProps({
    page: String,
    isKit: Boolean
})

watch(triggergetter, async() => {
    if(trigger.trigger){
        handleAvailability();
        trigger.fireTrigger()
    }
});

const handleAvailability = async() => {
    dates.resetDates()
    console.log(page)
    if(page == "UserHome"){
        if(store.results.length == 0){
            const snapshot =  await getDocs(collection(db, "Items"))
            snapshot.forEach((doc) => {
                store.results.push(doc.data());
            });
        }
        if(!isKit){
            availableInstances
            await itemAvailability();
        }else{
            await kitAvailability();
        }
    }else if(page == "HomeAdmin"){
        for (let item of cart.items) {
            if(Object.keys(dates.dates).length != 0){
                console.log(item)
                if(availableInstances.items[item.Name] !== undefined){
                    availableInstances.resetCollection(item.Name);
                }
                await getAvailableItems(item.Name,item.SerialSeries);
                console.log(availableInstances)
            }else{
                console.log("Please select a date range")
            }
        }
    }else{
        console.log("Please select a page")
    
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
const getAvailableItems = async(name,serial,kitId) => {
    let databaseSearch = databaseFormatter(name)
    if(availableInstances.getCollection(name + "kit" + `${kitId}`) == undefined && isKit==true){
        availableInstances.createCollection(name + "kit" + `${kitId}`);
    }else if (availableInstances.getCollection(name) == undefined && isKit==false ){
        availableInstances.createCollection(name);
    }
    console.log(name)
    console.log(databaseSearch)
    const creference = collection(db, `Items/${databaseSearch}/${databaseSearch} items`);
    await getNonConflictingReservedItems(name,serial)
    const reservedSnapshot = await getDocs(creference);
    reservedSnapshot.forEach((doc) => {
        if(doc.data().Reserved == false || Nonconflictingreserveditems.includes(doc.data().Serial)){
            if(kitId != 0){
                console.log(doc.data().Name)
                availableInstances.addKitInstance(`${doc.data().Name}kit${kitId}`, doc.data());
                console.log('kitrunning')
            }else{
                availableInstances.addInstance(doc.data().Name,doc.data());
            }
        }
    });
}
const getNonConflictingReservedItems = async(name,serialseries) => {
    Nonconflictingreserveditems = [];
    let blacklist = []
    const Userdates = dateifierUser(dates.general[0], dates.general[1], dates.general[2], dates.general[3]);
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
const itemAvailability = async() => {
for (let item of store.results) {
        if( availableInstances.items[`${item.Name}`] !== undefined){
            availableInstances.items[`${item.Name}`] = [];
        }
        if(Object.keys(dates.general).length != 0){
            console.log(item)
            await getAvailableItems(item.Name,item.SerialSeries,0);
            console.log(availableInstances)
            /* CALL RESERVATION HANDLER*/
        }else{
            console.log("Please select a date range")
        }
    }
}
const kitAvailability = async() => {
    for (let kit of store.results) {
        quantity.setavailable(kit.Name,'We raaaaaaaaviniiiing')
        for(let i = 1; i <= kit.Items.length; i++){
            console.log(kit.Items[i-1])
            console.log(availableInstances.items[`${kit.Items[i-1]}kit${kit.Id}`])
            if( availableInstances.items[`${kit.Items[i-1]}kit${kit.Id}`] !== undefined){
                availableInstances.items[`${kit.Items[i-1]}kit${kit.Id}`] = [];
            }
            if(Object.keys(dates.general).length != 0){
                await getAvailableItems(kit.Items[i-1],kit[`Item${i}`].SerialSeries,kit.Id);
                console.log(availableInstances.items[`${kit.Items[i-1]}kit${kit.Id}`] )
                if(availableInstances.items[`${kit.Items[i-1]}kit${kit.Id}`].length == 0){
                    console.log("Kit is not available")
                    quantity.setavailable(kit.Name,false)
                }
                /* CALL RESERVATION HANDLER*/
            }else{
                console.log("Please select a date range")
            }
        }
        if(quantity.available[kit.Name] !== false){
            quantity.setavailable(kit.Name,true)
        }
    }
}


</script>