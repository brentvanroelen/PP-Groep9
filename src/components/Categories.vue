<template>
    <h2>Categories</h2>
    <ul id="Categories">
        <li><router-link to="#"></router-link><img src="../assets/Audio.jpg" alt=""></li>
        <li><router-link to="#"></router-link><img src="../assets/Lighting.jpg" alt=""></li>
        <li><router-link to="#"></router-link><img src="../assets/Varia.jpg" alt=""></li>
        <li><router-link to="#"></router-link><img src="../assets/video.png" alt=""></li>
        <li><router-link to="#"></router-link><img src="../assets/XR.jpg" alt=""></li>
    </ul>
    <ul id="Names">
        <li>Audio</li>
        <li>Lighting</li>
        <li>Varia</li>
        <li>Video</li>
        <li>XR</li>
    </ul>
</template>

<script>
export default {
    name: 'Categories',
    components: {
  
    }
  }
</script>

<style scoped>
    #Categories{
        display: flex;
        justify-content: space-around;
        list-style-type: none;
        align-items: center;
        padding: 0.5em;
        
    }
    
    img{
        width: 8em;
        background-color: white;
    }
    #Names{
        display: flex;
        justify-content: space-around;
        list-style: none;
    }
</style>