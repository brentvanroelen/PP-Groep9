<template>
  <div class="report-page">
    <div class="item-info">
      <div class="item-details">
        <h1>{{ report.itemName }}</h1>
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
  h1{
  font-size: 24px
}
  
.report-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}


.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center; 
}

.item-details {
  flex: 1;
  margin-right: 20px;
}

.item-details h1 {
  margin: 0;
  font-size: 24px; 
}

.item-details p {
  margin: 5px 0;
}

.item-image img {
  max-width: 100px; 
  height: auto;
  border-radius: 5px; 
}


.issue-description textarea {
  width: calc(100% - 20px); 
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.issue-description textarea:hover,
.issue-description textarea:focus {
  border-color: #900; 
}


.upload-section input[type="file"] {
  margin-top: 10px;
  margin-left: 50%;
  margin-right: 50%;
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
