<template>
    <div class="Container">
        <div class="kitSetup" v-if="kitToBeMade.kit != ''">
            <label for="name">Kitname</label>
            <input type="text" v-model="kitName">
            <label for="description">Kit description:</label>
            <textarea name="description" id="description" rows="10" cols="50" v-model="kitDescription">
            </textarea>
        </div>
        <div class="existingItemsInKit" v-if="kitToBeMade.kit.id != 10000">
        
        </div>
        <div class="selectedItems">
            <div class="items-highlighted">
                <div v-for="(item, index) in selectedItems" :key="index" class="item">
                <div class="itemPanel"><h2>{{ item.Name }}</h2>
                <img :src="item.Image" alt="Selected Item Image">
                <p>{{ item.Description }}</p>
                <button @click="removeItem(index)">Remove</button></div>
                </div>
            </div>
            <button class="buttonsClass largerButton" @click="log">
                <p v-if="kitToBeMade.kit.id == 10000">Add new Kit</p>
                <p v-else>Add to existing Kit</p>
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, getDocs,db, where } from '../Firebase/Index.js';
import { useKitItems,useKitToBeMade } from '@/Pinia/Store';
import { imageGetter } from '@/js/functions.js';
import SearchBarAdmin from '@/components/SearchBarAdmin.vue';
import NewKitHandler from '@/components/NewKitHandler.vue';

const kitItems = useKitItems();
const kitToBeMade = useKitToBeMade();
const router = useRouter();
const selectedItems = ref(kitItems.selectedItems);
let kitName = ref(kitToBeMade.kit.Name);
let kitDescription = ref('');
  
  

const log = () => {
  console.log(selectedItems.value);
};
const removeItem = (index) => {
  selectedItems.value.splice(index, 1);
};
  
 
const route = router.currentRoute.value;
if (route.query.items) {
  selectedItems.value = route.query.items;
}
const addKit = async () => {
  const kitsCollection = collection(db, 'Kits');
  if(kitToBeMade.kit.id != 10000){
    const query = query(collection(db, 'Kits'),where('Name', '==', kitName));
    const querySnapshot = await getDocs(query);
    if(querySnapshot.size > 0){
      
    }
  }else{
    const kit = {
      Name: kitName.value,
      Description: kitDescription.value,
      Items: selectedItems.value,
    };
    console.log()
  }
  const query = query(collection(db, 'Kits'),where('Name', '==', kitName));
  const querySnapshot = await getDocs(query);
  if(querySnapshot.size > 0){
    
  }
  const kitDescription = document.getElementById('descriptionInput').value;
  const number = document.getElementById('numberInput').value;
  const items = selectedItems.value;
  const kit = {
    Name: kitName,
    Description: kitDescription,
    Number: number,
    Items: items,
  };
  await kitsCollection.add(kit);
  router.push('/kits');
};
onMounted(() => {
  for (let item of selectedItems.value){
    imageGetter(`ItemImages/${item.Image}`).then((res) => {
      item.Image = res;
    })
  }
});


</script>
<style scoped>
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}
.items-highlighted{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
#description{
    resize: none;
}
.kitSetup{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>