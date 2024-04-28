<template>
    <div class="searchcontainer">
        <div class="searchbar-overlay"></div>
        <div class="searchbar">
          <SearchBar @search="handleSearch" />
        </div>
    </div>
    
    <h1>DT-770 PRO</h1>
    <div id="pfotoDiv"><img src="../assets/Audio.jpg" alt="" id="photo"></div>
    <div class="itemDescription"><h3>Item description: </h3><br>
    <p>The Rode Wireless Go II is a wireless lavalier microphone system consisting of a dual receiver and two transmitters with built-in microphones. Ideal for vlogs and interviews. The receiver has a mini-jack output for direct connection to the audio input of your smartphone, tablet, or computer. Even better is the USB-C connection</p>
    <br><h3>Category: </h3><br>
    <h3>Brand:</h3><br>
        <label for="dropDown">Quantity:</label>
        <select name="dropDown" id="dropDownMenu">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select><br>

        <label for="endProject" class="forProject">For Project: </label>
        <input type="checkbox" class="forProject"></div><br>
   
        
        
        
        
        
        
        <Footer></Footer>
  </template>
  
  
  <script setup>
  import SearchBar from "../components/Searchbar.vue"
  import Footer from "../components/Footer.vue"
  import { onMounted, useStore } from "../main.js";
  import { computed } from "../main.js";
  import { useRouter } from 'vue-router';
  
  const store = useStore();
  const results = computed(() => store.results);
  const router = useRouter();
  const params = router.currentRoute.value.params;

  
  onMounted(() => {
    const foundItem = results.value.find(item => item.Name === params);
    results.value.forEach(item => {
      if (item.Name === params) {
        console.log(item);
      }
    });
  });

  console.log(params);


  

  </script>
  <style scoped>
  #photo {
    max-width: 200px;
    max-height: 200px;
  }
  
  #pfotoDiv {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .searchcontainer {
    position: relative;
    margin-bottom: 20px;
  }
  
  .searchbar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black overlay */
  }
  
  .searchbar {
    position: relative;
    z-index: 1; /* Ensure searchbar stays on top of overlay */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h1 {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
  }
  
  .itemDescription {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .forProject {
    margin-top: 10px;
  }
  
  /* Adjustments for mobile devices */
  @media (max-width: 768px) {
    #pfotoDiv {
      margin-left: 10%;
      margin-right: 10%;
    }
  }
  </style>
  
  <!-- <style scoped>

  #photo {
    max-width: 200px;
    max-height: 200px;
  }

  #pfotoDiv {
    display: flex;
    justify-content: right;
    margin-left: 70%;
    margin-right: 30%;

  }

  .searchbar{
    display: flex;
    align-items: center;
    margin-bottom: 100%;
    
    
  }

  h1 {
    text-align: center;
    font-size: 30px;
    margin-top: 5%;
  }

    .itemDescription {
       display: flex;
       justify-content: center;
    }
  
  
  </style>  -->