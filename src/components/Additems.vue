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
            <button @click="UpdateDoc">Update doc</button>
            <button @click="Makenewdoc">Make new doc</button>
        </form>
    </div>
</template>

<script setup>
    import {ref} from "../main.js"
    import {Firestore,db,addDoc,setDoc,updateDoc,doc} from "../Firebase/Index.js"
    const docdata = ref({
        Name: '',
        Category: '',
        Brand: '',
        Description: "",
        Image: '',
        DamagedItems: [],
        IsInKit: false,
        Quantity: 1,
        SubStrings: []
    })
    const UpdateDoc = async() => {
            await updateDoc(doc(db, "Items",`${docdata.value.Name.toString()}`), {
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
    }
    const Makenewdoc = async() => {
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