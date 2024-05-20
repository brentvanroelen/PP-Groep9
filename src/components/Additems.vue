<template>
    <div>
        <label for="instance">check for instances</label>
        <input type="checkbox" name="instance" id="instance" v-model="instance">
        <h1 v-if="!instance">Voeg items toe</h1>
        <form v-if="!instance">
            <label for="name">Name: </label>
            <input type="text" id="name" name="name"  v-model="docdata.Name">
            <label for="category">Category: </label>
            <input type="text" id="category" name="category" v-model="docdata.Category">
            <label for="brand">Brand:</label>
            <input type="text" id="brand" name="brand" v-model="docdata.Brand">
            <label for="description">Description</label>
            <input type="text" id="description" name="description" v-model="docdata.Description">
            <label for="image">Image</label>
            <input type="text" id="image" name="image" v-model="docdata.Image">
            <label for="image">Serialseries</label>
            <input type="text" id="Serial" name="Serial" v-model="docdata.SerialSeries">
            <button @click="Makenewdoc">Make new doc</button>
        </form>
    </div>
    <div>
        <h1 v-if="instance">Voeg instances toe</h1>
        <form v-if="instance">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" v-model="instancedata.Name">
            <label for="category">Serial</label>
            <input type="text" id="Serie" name="Serie" v-model="instancedata.Serial">
            <button @click="Makenewdoc">Make new instance</button>
        </form>
    </div>
</template>

<script setup>
    import {ref} from "../main.js"
    import {db,setDoc,updateDoc,doc,increment,getDoc} from "../Firebase/Index.js"

    let instance = ref(false);
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
    const Makenewdoc = async() => {
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
                let queryname = instancedata.value.Name
                await setDoc(doc(db, `Items/${queryname}/${queryname} items/`,`${instancedata.value.Serial.toString()}`), {
                    Name: instancedata.value.Name.toLowerCase(),
                    Serial: instancedata.value.Serial,
                    HasIssues: instancedata.value.HasIssues,
                    Issues: instancedata.value.Issues,
                    SubStrings: generateSubstrings(instancedata.value.Serial.toLowerCase()),
                    Reserved: instancedata.value.Reserved,
                    Image: await getImage()
                }).then(changeAmountAvailable)
                
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
    const changeAmountAvailable = async() => {
    const docRef = doc(db, `Items/${instancedata.value.Name}`);
    await updateDoc(docRef, {
        AvailableAmount: increment(1)
    });
    }

    const getImage = async() => {
        const docRef = doc(db, `Items/${instancedata.value.Name}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().Image;
        } else {
            console.log("No such document!");
        }
    }



</script>

<style scoped>
</style>
