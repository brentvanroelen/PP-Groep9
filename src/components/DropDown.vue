<template>
  <div id="dropdown">
    <select name="" id="" v-model="selectedOption">
      <option value="" disabled selected>{{ dropdownName }}</option>
      <option v-for="(option, index) in dropdownOptions" :key="index" >{{ option }}</option>
    </select>
  </div>
</template>
  
<script setup>
import { ref, defineProps } from 'vue';

const selectedOption = ref(null);



const props = defineProps({
  dropdownName: String,
  dropdownOptions: {
    type: Array,
    required: true
  },
});


</script>

<style scoped>

select{
  width: auto;
  height: 5%;
  font-size: medium;
  margin: 0.5em;
}

</style>