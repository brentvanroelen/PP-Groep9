<template>
    <div>
        <h1>Voeg items toe</h1>
        <form>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" v-model="docdata.Name">
            <label for="category">Category</label>
            <input type="text" id="category" name="category" v-model="docdata.Category">
            <label for="brand">Brand</label>
            <input type="text" id="brand" name="brand" v-model="docdata.Brand">
            <label for="description">Description</label>
            <input type="text" id="description" name="description" v-model="docdata.Description">
            <label for="image">Image</label>
            <input type="text" id="image" name="image" v-model="docdata.Image">
            <label for="image">Serialseries</label>
            <input type="text" id="Serial" name="Serial" v-model="docdata.SerialSeries">
            <button @click="UpdateDoc">Update doc</button>
            <button @click="Makenewdoc">Make new doc</button>
        </form>
    </div>
    <div>
        <h1>Voeg instances toe</h1>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" v-model="instancedata.Name">
            <label for="category">Serial</label>
            <input type="text" id="Serie" name="Serie" v-model="instancedata.Serial">
            <label for="brand">Brand</label>
            <input type="text" id="brand" name="brand" v-model="instancedata.Brand">
            <input type="text" id="image" name="image" v-model="docdata.Image">
            <label for="image">Serialseries</label>
            <input type="text" id="Serial" name="Serial" v-model="docdata.SerialSeries">
            <button @click="UpdateDoc, instance = true">Update instance</button>
            <button @click="Makenewdoc, instance = true">Make new instance</button>
    </div>
</template>

<script setup>
    import {ref} from "../main.js"
    import {Firestore,db,addDoc,setDoc,updateDoc,doc} from "../Firebase/Index.js"

    let instance = false;
    const docdata = ref({
        Name: '',
        Category: '',
        Brand: '',
        Description: "",
        Image: '',
        DamagedItems: [],
        IsInKit: false,
        Quantity: 1,
        SubStrings: [],
        Available: true,
        AvailableAmount: 0,
        SerialSeries: ""
    })
    const instancedata = ref({
        Name: '',
        Serial: '',
        HasIssues: false,
        Issues: {
            User: '',
            IssueType: '',
            Image: '',
            Description: '',
        },
        Reserved: false,
    })
    const UpdateDoc = async() => {
            event.preventDefault();
            if(!instance){
                await setDoc(doc(db, "Items",`${docdata.value.Name.toString()}`), {
                    Name: docdata.value.Name.toLowerCase(),
                    Category: docdata.value.Category,
                    Brand: docdata.value.Brand,
                    Description: docdata.value.Description,
                    DamagedItems: docdata.value.DamagedItems,
                    IsInKit: docdata.value.IsInKit,
                    Quantity: docdata.value.Quantity,
                    SubStrings: generateSubstrings(docdata.value.Name.toLowerCase()),
                    Available: docdata.value.Available,
                    AvailableAmount: docdata.value.AvailableAmount,
                    SerialSeries: docdata.value.SerialSeries
                });
            }else{
                
            }
            
        };
    
    const Makenewdoc = async() => {
                event.preventDefault();
                if(!instance){ 
                await setDoc(doc(db, "Items",`${docdata.value.Name}`), {
                Name: docdata.value.Name.toLowerCase(),
                Category: docdata.value.Category,
                Brand: docdata.value.Brand,
                Description: docdata.value.Description,
                Image: docdata.value.Image,
                DamagedItems: docdata.value.DamagedItems,
                IsInKit: docdata.value.IsInKit,
                Quantity: docdata.value.Quantity,
                SubStrings: generateSubstrings(docdata.value.Name.toLowerCase())
            });
        }else{

        }
    }
    const generateSubstrings = (str) => {
        const substrings = [];
        for (let i = 0; i < str.length; i++) {
            for (let j = i + 1; j <= str.length; j++) {
                substrings.push(str.substring(i, j));
            }
        }
        return substrings;
    };



</script>

<style>
</style>