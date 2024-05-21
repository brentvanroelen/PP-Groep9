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
    h2 {
        margin-top: 20px;
    }
    
    #Categories{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        list-style-type: none;
        align-items: center;
        padding: 20px 0;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    #Categories li {
        margin: 10px;
        text-align: center;
        cursor: pointer;
        position: relative;
    }

    #Categories li img {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    #Categories li:hover {
        transform: translateY(-5px);
    }

    #Names {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        list-style-type: none;
        padding: 10px 0;
        margin-top: 10px;
    }

    #Names li {
        margin: 0 10px;
        font-weight: bold;
        color: #444;
        cursor: pointer;
        text-align: center;
        transition: color 0.3s ease;
    }

    #Names li:hover {
        color: #ff0000; 
    }
    
</style>
