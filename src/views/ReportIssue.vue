<template>
  <div class="report-page">
    <div class="item-info">
      <div class="item-details">

        <h1>{{ report.itemName}}</h1>
        <p>Serial Number: {{ report.itemSerial }}</p>
      </div>
     <div class="item-image">
         <img :src="report.itemImage" alt="Item Image">
    </div>
    </div>

    <div class="issue-description">
      <label>Please clearly explain what the issue is:</label>
      <br>
      <textarea v-model="issueDescription" rows="6"></textarea>
    </div>

    <div class="upload-section">
      <p>Feel free to add an image of the damage if necessary</p>
      <input type="file" @change="handleFileUpload">
    </div>

    <div class="submit-button">
      <button @click="submitReport">Confirm Issue Report</button>
    </div>
  </div>
</template>

<script setup>
import { useReportedItems } from '@/Pinia/Store';

const report = useReportedItems();
</script>

<style scoped>

body{
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
}
.report-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.report-page:hover{
  transform: translateY(-5px);
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin-bottom: 30px;
}

.item-details {
  flex: 2;
  margin-right: 20px;
  display:flex;
  flex-direction: column;
  justify-content: center;
}

.item-details h1 {
  margin: 0;
  font-size: 26px; 
  color: #333;
}

.item-details p {
  margin: 5px 0;
  color: #333;
}

.item-image{
  flex:1;
  text-align: right;
}
.item-image img {
  max-width: 100%; 
  height: auto;
  border-radius: 10px; 
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.issue-description{
  margin-bottom: 20px;
}

.issue-description label {
  font-weight: bold;
  color: #333;
}

.issue-description textarea {
  width: 100%; 
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  resize: vertical;
  box-sizing: border-box;
}

.issue-description textarea:hover,
.issue-description textarea:focus {
  border-color: #900; 
}

.upload-section{
  text-align: center;
  margin-bottom: 20px;
}
.upload-section p {
  margin-bottom: 10px;
  color: #333;
}

.upload-section input[type="file"] {
  margin-top: 10px;
  margin-left: 250px;
  margin-right: auto;
  display: block; 
}


.submit-button {
  text-align: center;
  margin-top: 20px;
}

.submit-button button {
  padding: 10px 20px;
  background-color: #f00;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.submit-button button:hover {
  background-color: #900; 
}
</style>
