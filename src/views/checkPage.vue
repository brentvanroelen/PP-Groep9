<template>
    <h1>Report issue</h1><br>  
    <textarea v-model="description" placeholder="Description:" ></textarea><br>
    <hr>
    <input type="file" @change="onFileChange" accept="image/*"><br>
    <select v-model="selectedIssue" id="issuesdrop">
        <option disabled selected>Select an option</option>
        <option value="Item malfunction">Item malfunction</option>
        <option value="Item lost">Item lost</option>
        <option value="Damaged">Damaged</option>
        <option value="Other">Other</option>
    </select><br>
    <button @click="submitFindings">Submit findings</button>
</template>

<script setup>
import { useStore } from '@/Pinia/Store.js'; 
import {db,setDoc,updateDoc,doc,increment,getDoc} from "../Firebase/Index.js"
import { useSearchedItems } from '@/Pinia/Store.js';

import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const serialNumber = ref(route.query.serialNumber);
console.log(serialNumber.value);

const searchedItem = useSearchedItems.searchedItem;

let description = '';
let selectedIssue = '';
let image = '';



const submitFindings = () => {
    const issueData = {
        description,
        image,
        type: selectedIssue
    };
    reportIssueToDatabase(issueData);
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        image = reader.result;
    };
    reader.readAsDataURL(file);
};

const reportIssueToDatabase = async (issueData) => {
    try {
        const itemRef = doc(db, `Items/${serialNumber.value.charAt(0)}/${serialNumber.value} items/${serialNumber.value}`);
        
        
        const itemSnapshot = await getDoc(itemRef);
        if (!itemSnapshot.exists()) {
            console.error('Document does not exist:', serialNumber.value);
            return;
        }

       
        await updateDoc(itemRef, {
            Issues: {
                Description: issueData.description,
                IssueType: issueData.type,
                Image: issueData.image
            }
        });
        
        store.addReportedIssue(issueData);
        console.log('Issue reported successfully.');
    } catch (error) {
        console.error('Error reporting issue:', error);
    }
};




</script>
