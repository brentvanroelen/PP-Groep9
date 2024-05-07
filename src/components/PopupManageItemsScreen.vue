<template>
  <div class="centerx">
    <div v-if="isVisible" class="popupContainer">
      <div class="popUp">
        <div class="contentWrapper">
          <div class="itemInfo">
            <label for="name">Name: </label><input type="text" name="name" id="name">
            <label for="serie">Serie: </label><input type="text" name="serie" id="serie">          
            <label for="quantity">Quantity: </label> <input type="number" name="Quantity" id="quantity">          
            <label for="category">Category: </label><input type="text" name="category" id="category">      
            <label for="description">Description: </label><input type="text" name="description" id="description">        
            <label for="location">Location</label><input type="text" name="location" id="location">
          </div>
          <div class="imgInput">
            <label for="img">Image: </label>
            <input type="file" name="img" id="img">
          </div>
        </div>
        <br>
        <button @click="closePopup" class="popupButton"> <router-link class="link" to="/ManageItems">Add item </router-link></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true, 
    };
  },
  methods: {
    closePopup() {
      this.isVisible = false;
    }
  }
};
</script>

<style scoped>
.centerx {
  text-align: center;
}

.popupContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popUp {
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  text-align: center;
  border: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.popupText {
  margin-bottom: 20px;
}

.popupButton {
  padding: 10px 20px;
  background-color: #d50000;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
}

.contentWrapper {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.itemInfo {
  width: 45%; /* Adjust width as needed */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.imgInput {
  width: 45%; /* Adjust width as needed */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.itemInfo label,
.imgInput label {
  margin-bottom: 5px; /* Extra ruimte tussen labels toevoegen */
}
</style>
