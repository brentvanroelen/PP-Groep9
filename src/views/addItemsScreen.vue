<template>
  <div>
    <h1 v-if="!instance">Add item</h1>
    <h1 v-else>Add instance</h1>
    <form @submit.prevent="Makenewdoc">
      <div v-if="!instance">
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
        <div class="form-group">
          <label for="serial">Serial Series: </label>
          <input type="text" id="serial" name="serial" v-model="docdata.SerialSeries">
        </div>
      </div>
      <div v-else>
        <div class="form-group">
          <label for="name">Name: </label>
          <input type="text" id="name" name="name" v-model="instancedata.Name" required>
        </div>
        <div class="form-group">
          <label for="serial">Serial: </label>
          <input type="text" id="serial" name="serial" v-model="instancedata.Serial" required>
        </div>
      </div>
      <div class="button-group">
        <button type="button" class="btn" @click="setInstance(false)">Add New Item</button>
        <button type="button" class="btn" @click="setInstance(true)">Add Instance</button>
      </div>
      <button type="submit" class="btn">Add item</button>
      <button type="button" class="btn">
        <router-link class="link" to="/ManageItems">Close</router-link>
      </button>
    </form>
  </div>
</template>

<script setup>


import { ref } from 'vue';

import { db, doc, updateDoc, setDoc, collection, increment, getDoc,  } from "../Firebase/Index.js";




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
  SerialSeries: ''
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
  const itemName = docdata.value.Name.charAt(0).toUpperCase() + docdata.value.Name.slice(1);
  const serialSeries = docdata.value.SerialSeries.substring(0, 3).toUpperCase(); // Neem alleen de eerste twee tekens en maak deze hoofdletters

  // Voegt item toe aan de 'Items'-verzameling
  await setDoc(doc(db, 'Items', itemName), {
    Name: docdata.value.Name,
    Category: docdata.value.Category,
    Brand: docdata.value.Brand,
    Description: docdata.value.Description,
    DamagedItems: docdata.value.DamagedItems,
    IsInKit: docdata.value.IsInKit,
    Quantity: docdata.value.Quantity,
    SubStrings: generateSubstrings(docdata.value.Name.toLowerCase()),
    Available: docdata.value.Available,
    AvailableAmount: docdata.value.AvailableAmount,
    SerialSeries: serialSeries, // Gebruik alleen de eerste twee tekens en maak ze hoofdletters
    Image: docdata.value.Image
  });

  // Maak een subverzameling aan voor de serienummers van dit item
  const itemDocRef = doc(db, 'Items', itemName);
  const itemItemsCollectionRef = collection(itemDocRef, itemName + ' items');

  // Voegt het eerste serienummer toe
  const firstSerialRef = doc(itemItemsCollectionRef, `${serialSeries}-01`);
  await setDoc(firstSerialRef, {
    Name: itemName,
    Serial: `${serialSeries}-01`,
    HasIssues: false, 
    Issues: {}, 
    Reserved: false, 
    Image: docdata.value.Image 
  });
};

const addNewInstance = async () => {
  const instanceName = instancedata.value.Name.charAt(0).toUpperCase() + instancedata.value.Name.slice(1);
  const serial = instancedata.value.Serial.toUpperCase();
  const itemRef = doc(db, 'Items', instanceName);
  const itemDoc = await getDoc(itemRef);

  if (itemDoc.exists()) {
    const itemSerialsRef = doc(db, 'Items', instanceName, instanceName + ' items', serial);
    await setDoc(itemSerialsRef, {
      Name: instanceName,
      Serial: serial,
      HasIssues: instancedata.value.HasIssues,
      Issues: instancedata.value.Issues,
      Reserved: instancedata.value.Reserved,
      Image: await getImage(instanceName)
    });
    await changeAmountAvailable(instanceName);
  } else {
    console.log(`Item with name ${instanceName} does not exist.`);
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

const changeAmountAvailable = async (queryname) => {
  const docRef = doc(db, `Items/${queryname}`);
  await updateDoc(docRef, {
    AvailableAmount: increment(1)
  });
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

  
  
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    color: #333;
    margin: 0;
    padding: 0;
  }
  
  h1 {
    color: #444;
    text-align: center;
  }
  
  form {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    margin: 20px auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 4px;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  </style>
  