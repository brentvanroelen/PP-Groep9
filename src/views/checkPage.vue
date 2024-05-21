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
import { db, setDoc, updateDoc, doc, increment, getDoc } from "../Firebase/Index.js"
import { useSearchedItems } from '@/Pinia/Store.js';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const serialNumber = ref(route.query.serialNumber || ''); // Als de queryparameter niet wordt ontvangen, zal het leeg zijn

console.log(serialNumber.value); // Controleer of de serialNumber correct wordt ontvangen

const store = useStore();

// Haal de prefix uit het serienummer
const serialNumberValue = serialNumber.value;
const serialPrefix = serialNumberValue.substring(0, 2); // de prefix altijd 2 tekens lang 

const itemId = serialPrefix + serialNumberValue;

let description = '';
let selectedIssue = '';
let image = '';

const submitFindings = () => {
    const issueData = {
        description,
        image,
        type: selectedIssue
    };
    reportIssueToDatabase(issueData, itemId);
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        image = reader.result;
    };
    reader.readAsDataURL(file);
};

const reportIssueToDatabase = async (issueData, itemId) => {
    try {
        const itemDocRef = doc(db, 'Camera items', itemId);
        
        const itemSnapshot = await getDoc(itemDocRef);
        if (!itemSnapshot.exists()) {
            console.error('Document does not exist:', itemId);
            return;
        }

        await updateDoc(itemDocRef, {
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
