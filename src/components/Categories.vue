<template>
    <h2>Categories</h2>
    <ul id="Categories" >
        <li><router-link to="/productscreen"><img src="../assets/Audio.jpg" alt=""></router-link></li>
        <li><router-link to="/productscreen"><img src="../assets/Lighting.jpg" alt=""></router-link></li>
        <li><router-link to="/productscreen"><img src="../assets/Varia.jpg" alt=""></router-link></li>
        <li><router-link to="/productscreen"><img src="../assets/video.png" alt=""></router-link></li>
        <li><router-link to="/productscreen"><img src="../assets/XR.jpg" alt=""></router-link></li>
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
        list-style-type: none;
        align-items: center;
        padding: 0.5em;
    }
    
</style>