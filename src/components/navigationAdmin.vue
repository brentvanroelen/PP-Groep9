<template>
 <nav class="navAdmin">
    <ul class="navAdminLinks">
      <li id='img'><router-link class="link" to="/HomeAdmin"><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
    <div id="links">
      <li><router-link class="link" to="/HomeAdmin">Home</router-link></li>
        <li><router-link class = "link" to="ManageItems">Manage items</router-link></li>
      
        
        <li><select @change="navigateToRoute">
          <option disabled selected>Select an option</option>
          <option value="/Blacklist">Blacklist</option>
          <option value="/UserExtensions">User requests</option>
        </select></li>
      
        <li><router-link class="link" to="/options">Options</router-link></li>
        <li><button class="loginPageBtn" @click="logOut"> log out</button></li>
    </div>
    </ul>
  </nav>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useUserIdentification } from '@/Pinia/Store';

  const userIdentification = useUserIdentification();
  const router = useRouter();

  const navigateToRoute = (event) => {
    const selectedRoute = event.target.value;
    if (selectedRoute) {
      router.push(selectedRoute);
    }
  }
  const logOut = () => {
    userIdentification.logOut();
}
</script>


<style scoped>
.navAdmin{
  background-color: #c1c1c1;
}
.navAdminLinks li img{
  max-width: 80px;
  height: auto;
  margin-left: 0.5em;
}
.navAdminLinks{
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  width:100%  !important;
  height:75px !important;
  list-style: none !important;
  justify-content: space-between !important;
}
.link{
  text-decoration: none !important;
  padding: 0 1em 0 1em !important;
}
.loginPageBtn{
  background-color: #c1c1c1;
  border: none;
  color: black;
  padding: 15px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
#links{
  display: flex !important;
  flex-direction: row !important;
  justify-content: end !important;
  align-items: center !important;
  width: 80%;
}
.img{
  width: 20px;
  height: 20px;
}
.img{
  width: 20px;
  height: 20px;
}</style>