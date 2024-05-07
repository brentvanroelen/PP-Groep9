<template>
    <div class="addKitScreen">
        <div class="inputKits">
            <label for="kitName" class="labels">Kit name: </label><input type="text" name="" id="kitNameInput">
            <label for="number" class="labels">Number (optional): </label> <input type="number" name="" id="numberInput">
            <label for="kitDescription" class="labels">Kit description: </label><input type="text" name="" id="descriptionInput">
        </div>
        
        <div class="buttons">   
            <button class="buttonsClass">Add more items</button>
            <div class="fileInputWrapper">
                <input type="file" name="file" id="file">
                <button class="buttonsClass">Upload IMG</button>
            </div>
        </div>
        
        <div class="items highlighted">
            Data uit database
        </div>
        
        <button class="buttonsClass largerButton">Add Kit</button>
    </div>
</template>



<script setup>

</script>

<style scoped>


.addKitScreen {
    width: 100%;
    height: 100%;
    background-attachment: fixed;
    background-size: cover;
    margin: 0; 
    padding: 0; 
}

.buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    margin-bottom: 20px;
}

.buttonsClass {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    display: flex;
    justify-content: space-around;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
}

.inputKits {
    margin-left: 40px;
    margin-top: 20px;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: left;
    margin-top: 20px;
    margin-bottom: 20px;
}

.labels {
    margin: 10px;
}

.items {
    background-color: red; /* Tijdelijke opvallende kleur */
    width: auto; 
    height: 200px; 
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}

.fileInputWrapper {
    display: flex;
    align-items: center;
}

.fileInputWrapper input[type="file"] {
    margin-right: 10px;
    
}

.largerButton {
    padding: 15px 25px; 
}


</style>