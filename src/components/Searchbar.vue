<template>
    <div class="search-bar">
    <input type="text" v-model="query" @keyup.enter="search" placeholder="Search">
    <button @click="search">Search</button>
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        query: '' // Het zoekquery-gegeven binden aan het inputveld
      };
    },
    methods: {
      search() {
       alert('Joo de mannen')
        this.$emit('search', this.query);
      }
    }
  };
  </script>
  

  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    margin-top: 0%;
    
  }
  
  .search-bar input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 5px;
  }
  
  .search-bar button {
     padding: 8px 12px; 
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    
  }
  
  
  </style>
  