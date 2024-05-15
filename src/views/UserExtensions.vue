<template>

<h1>Extension request</h1>
 <div id="infoContainer"></div>

</template>

<script>

const names = ['Alice Johnson', 'Michael Smith', 'Charlie Brown'];

function generateInfoDiv(name) {
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    infoDiv.innerHTML = `
        <div>Image</div>
        <div>
            <p>Student: ${name}</p>
            <p>Extension duration: </p>
        </div>
        
        <div class="tekst">
            <input type="text" class="input-text" placeholder="Enter reason here">
        </div>

        <div class="actions">
            <button class="action-btn1">V</button>
            <button class="action-btn2">X</button>
        </div>
    `;

    return infoDiv;
}

const infoContainer = document.getElementById('infoContainer');

names.forEach(name => {
    const infoDiv = generateInfoDiv(name);
    infoContainer.appendChild(infoDiv);
});

</script>

<style>

h1{
    text-align: center;
}

.info {
    display: flex;
    align-items: center; 
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #c1c1c1;
    font-size: large;
}

.actions {
    display: flex;
    align-items: center; 
    margin-right: 45px;
}

.action-btn1 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #4CAF50;
    border: none;
    color: white;
    cursor: pointer;
    margin-right: 10px;
}

.action-btn2 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: red;
    border: none;
    color: white;
    cursor: pointer;
    margin-right: 10px;
}

.input-text {
    width: 400px;
    height: 100px;
    text-align: left; 
    resize: none;
}

.tekst{
    margin-right: 0px;
}






</style>