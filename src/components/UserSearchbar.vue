<template>
    <div class="search-bar">
      <input type="text" v-model="querystring" @keyup.enter="confirmedSearch" placeholder="Voornaam + Achternaam student">
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from '../main.js'
import {collection,where,db,query,getDocs,getDoc,and} from '../Firebase/Index.js'
import { useSelectedUser } from '@/Pinia/Store.js';

const querystring = ref('');
let selectedUser = useSelectedUser()

if(querystring.value.length >= 3){
  /* Function to search on user substrings array still needs to happen*/
}

const confirmedSearch = async() => {
  let firstName = querystring.value.split(' ')[0];
  let lastName = querystring.value.split(' ')[1];
  console.log(firstName)
  console.log(lastName)
  if(firstName == undefined || lastName == undefined){
    selectedUser.selectUser(1)
  }else{
    const cref = collection(db, 'Users');
    const qref = query(cref, where('firstName', '==', firstName), where( 'lastName', '==', lastName));
    const querySnapshot = await getDocs(qref);
    console.log(querySnapshot.size)
    if(querySnapshot.size != 0){
      querySnapshot.forEach((doc) => {
        let user = {
        name: doc.data().firstName + ' ' + doc.data().lastName,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        uid: doc.data().uid,
      }
        selectedUser.selectUser(user) 

      });
      console.log(selectedUser.user)
    }else{
      selectedUser.selectUser(1)
    }
  }
}

</script>
