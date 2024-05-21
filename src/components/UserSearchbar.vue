<template>
    <div class="search-bar">
      <input type="text" v-model="querystring" @keyup.enter="confirmedSearch" placeholder="Search">
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from '../main.js'
import {collection,where,db,query,getDocs,getDoc} from '../Firebase/Index.js'
import { useSelectedUser } from '@/Pinia/Store.js';

const querystring = ref('');
let selectedUser = useSelectedUser()

if(querystring.value.length >= 3){
  /* Function to search on user substrings array still needs to happen*/
}

const confirmedSearch = async() => {
  const cref = collection(db, 'users');
  const qref = query(cref, where('firstName', '==', querystring.value));
  const querySnapshot = await getDoc(qref);
  let user = {
    name: querySnapshot.data().firstName + ' ' + querySnapshot.data().lastName,
    uid: querySnapshot.data().uid,
    type: querySnapshot.data().type
  }
  if(querySnapshot.exists){
    selectedUser.selectUser(user) 
  }
}

</script>
