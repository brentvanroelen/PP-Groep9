<template>
    <div class="Container">
        <div class="kitSetup" v-if="kitToBeMade.kit != ''">
            <label for="name">Kitname</label>
            <input type="text" v-if="kitToBeMade != ''" v-model="kitName">
            <label for="description">Kit description:</label>
            <textarea name="description" id="description" rows="10" cols="50" v-model="kitDescription">
            </textarea>
        </div>
        <div class="existingItemsInKit" v-if="kitId != 10000 && kitId != undefined">
          <ExistingKitItems />
        </div>
        <div class="selectedItems">
            <div class="items-highlighted">
                <div v-for="(item, index) in selectedItems" :key="index" class="item">
                <div class="itemPanel"><h2>{{ item.Name }}</h2>
                <img :src="item.loadedImage" alt="Selected Item Image">
                <p>{{ item.Description }}</p>
                <button @click="removeItem(index)">Remove</button></div>
                </div>
            </div>
            <button class="buttonsClass largerButton" @click="addKit">
                <p v-if="kitToBeMade.kit.Id == 10000">Add new Kit</p>
                <p v-else>Add new kit</p>
            </button>
            <button @click="log">test</button>
        </div>
    </div>
    <Popup v-if="popupVisible" :message="popupMessage" @closepopup="popupVisible = false"></Popup>
</template>
<script setup>
import { ref, onMounted,computed,watch } from 'vue';
import { useRouter } from 'vue-router';
import { collection, query, getDocs,db, where, setDoc,doc } from '../Firebase/Index.js';
import { useKitItems,useKitToBeMade } from '@/Pinia/Store';
import { imageGetter } from '@/js/functions.js';
import SearchBarAdmin from '@/components/SearchBarAdmin.vue';
import NewKitHandler from '@/components/NewKitHandler.vue';
import { generateSubstrings } from '@/js/functions.js';
import ExistingKitItems from '@/components/ExistingKitItems.vue';
import Popup from './Popup.vue';

const popupVisible = ref(false);
const popupMessage = ref('');
const showPopup = (message) => {
  popupMessage.value = message;
  popupVisible.value = true;
};

const kitItems = useKitItems();
const kitToBeMade = useKitToBeMade();
const router = useRouter();
const selectedItems = ref(kitItems.selectedItems);
let kitDescription = ref('');
let kitId = computed(() => {
  return kitToBeMade.kit.Id;
})
let kitName = computed(() =>{
 return kitToBeMade.getKitName()
})



  

const log = () => {
  console.log(selectedItems.value);
  console.log(kitToBeMade.kit.Name);
};
const removeItem = (index) => {
  selectedItems.value.splice(index, 1);
};
  
 
const route = router.currentRoute.value;
if (route.query.items) {
  selectedItems.value = route.query.items;
}
const addKit = async () => {
  let kitId = 1
  if(kitName.value == '' || kitDescription.value == '' || selectedItems.value.length == 0){
    alert('Please fill in all fields');
    return;
  }
  /*allkits = await getDocs(collection(db, 'Kits'));
  for(let kit of allkits.docs){
    if(kit.data().Id >= kitId){
      kitId = kit.data().Id + 1;
    }
  }
  if(kitToBeMade.kit.Id != 10000){
    const query = query(collection(db, 'Kits'),where('Name', '==', kitName));
    const querySnapshot = await getDocs(query);
    console.log('we got here')
    if(querySnapshot.size > 0){
        
    } 
    Code om bestaande kits aan te passen. Nog niet functioneel.*/
  else{
    const kit = {
      Name: kitName.value,
      Description: kitDescription.value,
      Items: [],
      SubStrings: [],
      KitImage: 'test',
      Id: kitId,
      isKit: true
    };
    for(let item of selectedItems.value){
        generateSubstrings(item.Name).forEach((substring) => {
            kit.SubStrings.push(substring);
        })
    }
    generateSubstrings(kitName.value).forEach((substring) => {
        kit.SubStrings.push(substring);
    })
    selectedItems.value.forEach((item, index) => {
        kit.Items.push(item.Name.toLowerCase())
        let changeableItem = Object.assign({}, item);
        delete changeableItem.loadedImage;
        delete changeableItem.SubStrings;
        changeableItem = {
            ...changeableItem,
            Quantity: 1
        }
        kit[`Item${index + 1}`] = changeableItem;
    });
    setDoc(doc(collection(db, 'Kits')),{
      ...kit
    })
    showPopup('Kit added successfully');
  }
  
};
onMounted(() => {
  kitToBeMade.kit = '';
  for (let item of selectedItems.value){
    imageGetter(`ItemImages/${item.Image}`).then((res) => {
      item.loadedImage = res;
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