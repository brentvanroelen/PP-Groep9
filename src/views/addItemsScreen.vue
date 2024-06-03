<template>
  <div>
    <h1 v-if="!instance">Add item</h1>
    <h1 v-else>Add instance</h1>
    <form @submit.prevent="Makenewdoc">
      <div v-if="!instance" class="form">
        <div class="form-group">
          <label for="name">Name: </label>
          <input type="text" id="name" name="name" v-model="docdata.Name" required>
        </div>
        <div class="form-group">
          <label for="category">Category: </label>
          <input type="text" id="category" name="category" v-model="docdata.Category" required>
        </div>
        <div class="form-group">
          <label for="brand">Brand:</label>
          <input type="text" id="brand" name="brand" v-model="docdata.Brand">
        </div>
        <div class="form-group">
          <label for="description">Description: </label>
          <input type="text" id="description" name="description" v-model="docdata.Description">
        </div>
        <div class="form-group">
          <label for="image">Image: </label>
          <input type="text" id="image" name="image" v-model="docdata.Image">
        </div>
       <!--  <div class="form-group">
          <label for="serial">Serial Series: </label>
          <input type="text" id="serial" name="serial" v-model="docdata.SerialSeries" placeholder="Two or three letters exapmle: MIC, CA, VR,...">
        </div> -->
      </div>
      <div v-else>
        <div class="form-group">
          <label for="name">Name: </label>
          <input type="text" id="name" name="name" v-model="instancedata.Name" required>
        </div>
       <!--  <div class="form-group">
          <label for="serial">Serial: </label>
          <input type="text" id="serial" name="serial" v-model="instancedata.Serial" required>
        </div> Dit wordt automatisch gedaan -->
      </div>
      <div class="button-group">
        <button type="button" class="btn" @click="setInstance(false)">Add New Item</button>
        <button type="button" class="btn" @click="setInstance(true)">Add Instance</button>
      </div>
      <button type="submit" class="btn">Add item</button>
      <button type="button" class="btn-close">
        <router-link class="link" to="/ManageItems">Close</router-link>
      </button>
    </form>
  </div>
  <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />
</template>

<script setup>


import { ref } from 'vue';
import { getDocs } from 'firebase/firestore';
import { db, doc, updateDoc, setDoc, collection, increment, getDoc , addDoc } from "../Firebase/Index.js";
import Popup from '@/components/Popup.vue';





const popupVisible = ref(false);
const popupMessage = ref('');




const showPopup = (message) => {
 
//window.location.reload();
popupMessage.value = message;
popupVisible.value = true;
};
let instance = ref(false);

const docdata = ref({
  Name: '',
  Category: '',
  Brand: '',
  Description: '',
  Image: '',
  DamagedItems: [],
  IsInKit: false,
  Quantity: 1,
  SubStrings: [],
  Available: true,
  AvailableAmount: 0,
  //SerialSeries: ''
});

const instancedata = ref({
  Name: '',
  Serial: '',
  HasIssues: false,
  Issues: {
    User: '',
    IssueType: '',
    Image: '',
    Description: ''
  },
  Reserved: false
});

const setInstance = (isInstance) => {
  instance.value = isInstance;
};

const Makenewdoc = async () => {
  if (!instance.value) {
    await addNewItem();
  } else {
    await addNewInstance();
  }
};



const addNewItem = async () => {
  const itemName = docdata.value.Name.toLowerCase();
  const capitalizedItemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  const currentDate = new Date().toLocaleDateString('en-GB'); 

  let serialSeries = capitalizedItemName.substring(0, 3).toUpperCase();

  const itemRef = collection(db, 'Items');
  const querySnapshot = await getDocs(itemRef);
  querySnapshot.forEach((doc) => {
    const existingItem = doc.data();
    if (existingItem.SerialSeries === serialSeries) {
  
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); 
      serialSeries += randomLetter;
    }
  });

  await setDoc(doc(db, 'Items', capitalizedItemName), {
    Name: capitalizedItemName.toLowerCase(),
    Category: docdata.value.Category,
    Brand: docdata.value.Brand,
    Description: docdata.value.Description,
    DamagedItems: docdata.value.DamagedItems,
    IsInKit: docdata.value.IsInKit,
    Quantity: docdata.value.Quantity,
    SubStrings: generateSubstrings(itemName),
    Available: docdata.value.Available,
    AvailableAmount: docdata.value.AvailableAmount +1,
    SerialSeries: serialSeries,
    Image: docdata.value.Image,
    DateAdded: currentDate,
    isKit: false
  });

  const itemDocRef = doc(db, 'Items', capitalizedItemName);
  const itemItemsCollectionRef = collection(itemDocRef, capitalizedItemName + ' items');

  // Voegt het eerste serienummer toe
  const firstSerialRef = doc(itemItemsCollectionRef, `${serialSeries}-01`);
  await setDoc(firstSerialRef, {
    Name: capitalizedItemName.toLowerCase(),
    Serial: `${serialSeries}-01`,
    HasIssues: false, 
    Issues: {}, 
    Reserved: false, 
    Image: docdata.value.Image,
    DateAdded: currentDate 
  });
   
  // Write directly to ItemHistory

   const itemHistoryRef = doc(db, 'Utility/History/Item History', `${serialSeries}-01`);


      await setDoc(itemHistoryRef, {
      
        Name: capitalizedItemName.toLowerCase(),
        Serial: `${serialSeries}-01`,
        HasIssues: false, 
        Issues: {}, 
        Reservations: [],
        Image: docdata.value.Image,
        DateAdded: currentDate
      
    });
  showPopup('Item added successfully!');
};

const addNewInstance = async () => {

  const instanceName = instancedata.value.Name.charAt(0).toUpperCase() + instancedata.value.Name.slice(1);
  const itemRef = doc(db, 'Items', instanceName);
  const itemDoc = await getDoc(itemRef);

  if (itemDoc.exists()) {
    const serialSeries = itemDoc.data().SerialSeries;
    const currentDate = new Date().toLocaleDateString('en-GB'); 

    const lastInstanceRef = collection(db, `Items/${instanceName}/${instanceName} items`);
    const querySnapshot = await getDocs(lastInstanceRef);
    const nextSerialNumber = querySnapshot.docs.length + 1;
    const formattedSerialNumber = nextSerialNumber.toString().padStart(2,'0');
    const serial = serialSeries + "-" + formattedSerialNumber;

    const itemSerialsRef = doc(db, `Items/${instanceName}/${instanceName} items/${serial}`);
    await setDoc(itemSerialsRef, {
      Name: instanceName.toLowerCase(),
      Serial: serial,
      HasIssues: instancedata.value.HasIssues,
      //Issues: instancedata.value.Issues,
      Reserved: instancedata.value.Reserved,
      Image: await getImage(instanceName),
      DateAdded: currentDate 
    });
  
    const itemHistoryRef = doc(db, `Utility/History/Item History/${serial}`);


    await setDoc(itemHistoryRef, {

    Name: instanceName.toLowerCase(),
    Serial: serial,
    HasIssues: false, 
    Issues: {}, 
    Reservations: [],
    DateAdded: currentDate

});

    showPopup('Instance added successfully!');
    await changeAmountAvailable(instanceName);
    return serial;
  } 
 
};


const generateSubstrings = (str) => {
  const substrings = [];
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      substrings.push(str.substring(i, j));
    }
  }
  return substrings;
};

const changeAmountAvailable = async (instanceName) => {
  const itemRef = doc(db, 'Items', instanceName);
  const itemDoc = await getDoc(itemRef);

  if (itemDoc.exists()) {
    const currentAvailableAmount = itemDoc.data().AvailableAmount || 0;
    const updatedAmount = currentAvailableAmount + 1;
    
    await updateDoc(itemRef, {
      AvailableAmount: updatedAmount
    });

    
  } else {
    console.log(`Item with name ${instanceName} does not exist.`);
  }
};


const getImage = async (queryname) => {
  const docRef = doc(db, `Items/${queryname}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().Image;
  } else {
    console.log('No such document!');
    return '';
  }
};
</script>

  
  
  <style scoped>
  .label{
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}
  
  h1 {
    color: #444;
    text-align: center;
    margin-top:5px;
  }
  
  .form {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ccc;
    max-width: 500px;
    margin: 20px auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .form:hover {
  transform: translateY(-5px);
}
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: calc(100% - 10px);
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .btn {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #4caf50;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
  }
  .btn:hover {
    background-color: #45a049;
  }
  .btn-close {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #dc3545;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-close:hover {
  background-color: #c82333;
}

.link {
  color: #fff;
  text-decoration: none;
}

.form-group:last-of-type {
  margin-bottom: 20px;
}
  </style>
  