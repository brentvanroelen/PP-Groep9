<template>
   <Calendar></Calendar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {collection, getDocs} from  'firebase/firestore'
import {db} from "../Firebase/Index.js"
import Calendar from "../components/Calendar.vue"
</script>