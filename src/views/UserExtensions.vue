<template>
    <div>
      <h1>Extension request</h1>
      <div class="info-container">
        <div class="info" v-for="(name, index) in names" :key="index">
          <div>Image</div>
          <div>
            <p>Student: {{ name }}</p>
            <p>Extension duration: </p>
          </div>
          <div class="tekst">
            <input type="text" class="input-text" placeholder="Enter reason here">
          </div>
          <div class="actions">
            <button class="action-btn1">V</button>
            <button class="action-btn2">X</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const names = ref(['Alice Johnson', 'Michael Smith', 'Charlie Brown']);
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #c1c1c1;
    font-size: large;
    width: 80%;
  }
  
  .actions {
    display: flex;
    align-items: center;
  }
  
  .action-btn1,
  .action-btn2 {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    color: white;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .action-btn1 {
    background-color: #4CAF50;
  }
  
  .action-btn2 {
    background-color: red;
  }
  
  .input-text {
    width: 400px;
    height: 100px;
    text-align: left;
    resize: none;
}
  
  .text {
    margin-right: 0px;
  }
  </style>
  