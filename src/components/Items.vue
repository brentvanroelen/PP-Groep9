<template>
    <div class="item" v-if="item" :class="{available: item.Available === true}">
      <div id="itemMain">
        <h3>{{item.Name}}</h3>
        <br>
        <img :src="item.Image" alt="" id="img">
      </div>
      <div id="itemInfo">
        <p><b>Brand: </b>{{ item.Brand }}</p>
        <p><b>Item description: </b>{{item.Description}}</p>
        <p><b>Categorie:</b> {{item.Category}}</p>
        <p v-if="item.Available"><b>Beschikbaarheid: </b>Available 
        </p>
        <p v-else><b>Beschikbaarheid:</b> Item niet beschikbaar</p>
      </div>
     </div>
</template>

<script setup>

const {item} = defineProps({
    item: Object
    
})

</script>
 
<style scoped>
.item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
#itemInfo{
    display: flex;
    flex-direction: column;
    align-items:start;
}
p{
    padding: 0.3em;
}
#img{
  min-width: 200px;
}
#itemMain{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}
.itemInfo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}
h3{
    font-size: 2em;
   
}
.item{
    width: 100%;
    height: auto;
    padding: 2em;

  }
  #img{
    max-width: 200px;
    max-height: 200px;
  }
</style>