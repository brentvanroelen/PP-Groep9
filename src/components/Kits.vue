<template>
    <section>
    <h2>Kits</h2>
    <br>
    <ul id = "KitsTags">
        <li>Audio Kit</li>
        <li >Video Kit</li>
        <li >Vr Kit</li>
    </ul><br>
    
    
    
    <ul id="KitsComponents">
        <li>DT 770 PRO + Wireless GO II + DMX USB PRO</li>
        <li id="canonCam">Canon camera S50 + BR-2240</li>
        <li>Google glass + DT 770 PRO </li>
        
    </ul><br>
   
   
   
    <ul id="Kits">
        <li><router-link to="#"><img src="../assets/depositphotos_9985366-stock-illustration-computer-audio-icons.jpg" alt=""></router-link></li>
        <li><router-link to="#"><img src="../assets/images.png" alt=""></router-link></li>
        <li><router-link to="#"><img src="../assets/images2.png" alt=""></router-link></li>

    </ul>
   
</section>
</template>

<script>
export default {
    name: 'Kits',
    components: {
  
    }
  }
</script>

<style scoped>
    #Kits{
        display: flex;
        justify-content: space-around;
        list-style-type: none;
        align-items: center;
        
        
    }
    
    img{
        width: 8em;
        background-color: white;
    }
    #KitsTags{
        display: flex;
        justify-content: space-around;
        list-style: none;
    }
     
    #KitsComponents{
        display: flex;
        justify-content: space-around;
        list-style: none;
        font-size: smaller;
        margin-right: 40px;
    }
    #canonCam{
        margin-right: 60px;
    }
</style>