<template>
    <p>test</p>
    <div v-if="existingItems != []">
        <Teleport to="selectedItems">
            <div class="existing-items">
                <div v-for="(item, index) in existingItems" :key="index" class="item">
                <div class="itemPanel"><h2>{{ item.Name }}</h2>
                <img :src="item.loadedImage" alt="Selected Item Image">
                <p>{{ item.Description }}</p>
                <button @click="removeItem(index)">Remove</button></div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script setup>
import { ref, onMounted,computed,watch } from 'vue';
import { useKitItems,useKitToBeMade } from '@/Pinia/Store';

const kitToBeMade = useKitToBeMade();
let existingItems = [];

onMounted(() => {
    for(let i = 1; i <= kitToBeMade.kit.Items.length; i++){
        existingItems.push(kitToBeMade.kit[`Item${i}`]);
        console.log(kitToBeMade.kit[`Item${i}`]);
    }
});


</script>