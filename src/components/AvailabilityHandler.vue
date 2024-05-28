<template>
    <div @datesSelected="handleAvailability"></div>
</template>
<script setup>
import { useStore,useDates,useQuantity, useChoiceOfItems, useTrigger, useCart } from '@/Pinia/Store';
import { collection, getDocs, query, db, where} from '../Firebase/Index.js';
import { watch,ref, computed } from 'vue';

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
    console.log(page)
    if(page == "UserHome"){
        if(store.results.length == 0){
            const snapshot =  await getDocs(collection(db, "Items"))
            snapshot.forEach((doc) => {
                store.results.push(doc.data());
            });
        }
        if(!isKit){
            console.log('nay')
            await itemAvailability();
        }else{
            console.log('yay')
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
    let databaseSearch;
    if(name.includes(" ")){
        let correctNameArray = []
        let namearray = name.split(" ")
        for (let partOfName of namearray){
            correctNameArray.push(partOfName.charAt(0).toUpperCase() + partOfName.slice(1))
        }
        databaseSearch = correctNameArray.join(" ")
        console.log(databaseSearch)
    }else{
        databaseSearch = name.charAt(0).toUpperCase() + name.slice(1)
    }
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
    console.log(reservedSnapshot.size)
    reservedSnapshot.forEach((doc) => {
        if(doc.data().Reserved == false || Nonconflictingreserveditems.includes(doc.data().Serial)){
            if(kitId != 0){
                console.log(doc.data().Name)
                availableInstances.addKitInstance(`${doc.data().Name}kit${kitId}`, doc.data());
                console.log('kitrunning')
            }else{
                console.log('why')
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
        console.log(availableInstances.items[item.Name])
        if(availableInstances.items[item.Name] !== undefined){
            availableInstances.items[item.Name] = [];
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
    let available = true
    for (let kit of store.results) {
        for(let i = 1; i <= kit.Items.length; i++){
            if(availableInstances.items[kit.Items[i-1] + "kit" + `${kit.Id}`] !== undefined){
                availableInstances.items[kit.Items[i-1] + "kit" + `${kit.Id}`] = [];
            }
            if(Object.keys(dates.general).length != 0){
                console.log(kit.Items[i-1])
                console.log(kit[`Item${i}`].SerialSeries)
                console.log(kit.Id)
                console.log(kit.Items.length)
                await getAvailableItems(kit.Items[i-1],kit[`Item${i}`].SerialSeries,kit.Id);
                if(availableInstances.items[kit.Items[i-1] + "kit" + `${kit.Id}`].length == 0){
                    available = false
                }
            }else{
                console.log("Please select a date range")
            }
        }
        if(!available){
            alert("Kit is not available for these dates");
        }else{
            console.log(availableInstances)
            /* CALL RESERVATION HANDLER*/
            console.log("Kit is available for these dates");
        }
    }
}


</script>