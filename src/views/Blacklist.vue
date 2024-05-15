<template>
    <div>
      <h1 class="title">User blacklist</h1>
      <div class="actions">
        <label for="cijfer">Show</label>
        <select id="cijfer" name="cijfer" @change="handleSelectChange">
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
          <option value="7">7</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <br><br>
        <form action="/search" method="GET">
          <label for="search">Search:</label>
          <input type="text" id="search" name="q" @input="handleSearchInput">
          <button type="submit">Search</button>
        </form>
      </div>
  
      <table class="content">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Warnings</th>
            <th>Blacklisted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td><input type="checkbox"></td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="increaseWarning(index)">+</button>
              <span class="warning-count">{{ user.warningCount }}</span>
              <button @click="decreaseWarning(index)">-</button>
            </td>
            <td :class="getBlacklistedClass(user.warningCount)">
              <div class="border">{{ user.blacklisted }}</div>
            </td>
            <td>...</td>
          </tr>
        </tbody>
      </table>
  
      <div class="pagination-container">
        <p>Showing 1 to 10 of 100 entries</p>
        <div class="pagination">
          <a href="#">&laquo;</a> 
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <span>...</span>
          <a href="#">10</a>
          <a href="#">&raquo;</a> 
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const users = ref([
    { name: 'John Doe', email: 'john.doe@example.com', warningCount: 3, blacklisted: 'no' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', warningCount: 3, blacklisted: 'no' },
    { name: 'Michael Johnson', email: 'michael.johnson@example.com', warningCount: 3, blacklisted: 'yes' },
  { name: 'Emily Brown', email: 'emily.brown@example.com', warningCount: 3, blacklisted: 'no' },
  { name: 'David Lee', email: 'david.lee@example.com', warningCount: 3, blacklisted: 'yes' },
  { name: 'Sarah Taylor', email: 'sarah.taylor@example.com', warningCount: 3, blacklisted: 'no' },
  { name: 'James Wilson', email: 'james.wilson@example.com', warningCount: 3, blacklisted: 'no' },
  { name: 'Olivia Martinez', email: 'olivia.martinez@example.com', warningCount: 3, blacklisted: 'no' },
  { name: 'William Garcia', email: 'william.garcia@example.com', warningCount: 3, blacklisted: 'no' },
  { name: 'Emma Rodriguez', email: 'emma.rodriguez@example.com', warningCount: 3, blacklisted: 'yes' },
  ]);
  
  const filteredUsers = ref(users.value);
  
  function updateBlacklistedStatus(index) {
    const warnings = users.value[index].warningCount;
    if (warnings === 1) {
      users.value[index].blacklisted = 'no';
    } else if (warnings === 2) {
      users.value[index].blacklisted = 'no';
    } else if (warnings >= 3) {
      users.value[index].blacklisted = 'yes';
    } else {
      users.value[index].blacklisted = 'no';
    }
  }
  
  function applyColorsToAllRows() {
    users.value.forEach((_, index) => {
      updateBlacklistedStatus(index);
    });
  }
  
  applyColorsToAllRows();
  
  function handleSelectChange(event) {
    const aantal = parseInt(event.target.value);
    filteredUsers.value = users.value.slice(0, aantal);
  }
  
  function increaseWarning(index) {
    if (users.value[index].warningCount < 3) {
      users.value[index].warningCount++;
      updateBlacklistedStatus(index);
    }
  }
  
  function decreaseWarning(index) {
    if (users.value[index].warningCount > 0) {
      users.value[index].warningCount--;
      updateBlacklistedStatus(index);
    }
  }
  
  function handleSearchInput(event) {
    const searchText = event.target.value.toLowerCase();
    filteredUsers.value = users.value.filter(user => user.name.toLowerCase().includes(searchText));
  }
  
  function getBlacklistedClass(warningCount) {
    if (warningCount === 1) {
      return 'green';
    } else if (warningCount === 2) {
      return 'orange';
    } else if (warningCount >= 3) {
      return 'red';
    } else {
      return '';
    }
  }
  </script>
  
  <style scoped>
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .title {
    text-align: center;
  }
  
  .actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .actions label {
    margin-right: 10px;
  }
  
  .actions form {
    margin-left: auto;
  }
  
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 5px;
    border: 1px solid #000;
  }
  
  .pagination {
    display: flex;
    gap: 5px;
  }
  
  .pagination-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  th,
  td {
    padding: 10px;
    border: 1px solid #f2f2f2;
  }
  
  .border {
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    padding: 5px;
    width: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  
  .red div {
    background-color: #ffcccc;
    color: red;
  }
  
  .green div {
    background-color: #ccffcc;
    color: green;
  }
  
  .orange div {
    background-color: #ffd699;
    color: orange;
  }
  
  .content {
    width: 100%;
    border-collapse: collapse;
  }
  
  .content th,
  .content td {
    padding: 10px;
    vertical-align: top;
    text-align: center;
  }
  </style>
  