<template>
    <div id="quantity" v-if="item">
        <p><b>Quantity:</b></p>
        <select @change="setQuantity" v-model="selectedOption">
            <option v-for="value in options" :key="value"> {{ options[value-1] }}</option>
        </select>
    </div>
</template>
<script setup>
import { useQuantity, useChoiceOfItems } from '@/Pinia/Store';
import { computed,ref } from 'vue';

const selectedOption = ref(1);
const availableInstances = useChoiceOfItems();
const quantity = useQuantity();

const {item} = defineProps({
    item: Object
})

let options = computed(() => {
let amountAvailable = [];
if(availableInstances.getCollection(item.Name) !== undefined){
    for (let i = 1; i <= availableInstances.getCollection(item.Name).length ; i++) {
        amountAvailable.push(i);
    }
}else{
    amountAvailable.push(0);
}
return amountAvailable;
});

const setQuantity = () => {
quantity.setQuantity(item.Name,selectedOption.value);
}



</script>