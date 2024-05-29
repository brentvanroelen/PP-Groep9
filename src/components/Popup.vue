<template>
  <div class="centerx">
    <div v-if="isVisible" class="popupContainer">
      <div class="popUp">
        <slot>
          {{ message }}
        </slot>
        <button @click="closePopup" class="popupButton">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useItemsToGet } from '../Pinia/Store.js';

const props = defineProps({
  message: {
    type: String,
    default: 'Dit is een popup'
  }
});

const isVisible = ref(true);


const closePopup = () => {
  isVisible.value = false;
  
}
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

.popupButton {
  padding: 10px 20px;
  background-color: #d50000;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
}
</style>
