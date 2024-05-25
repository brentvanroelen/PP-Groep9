<template>
 <nav class="navAdmin">
    <ul class="navAdminLinks">
      <li id='img'><router-link class="link" to="/HomeAdmin"><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
    <div id="links">
      <li><router-link class="link" to="/HomeAdmin">Home</router-link></li>
        <li><router-link class = "link" to="ManageItems">Manage items</router-link></li>
      
        
        <li><select @change="navigateToRoute">
          <option disabled selected>Select an option</option>
          <option value="/Users">Users</option>
          <option value="/Blacklist">Blacklist</option>
          <option value="/UserExtensions">User requests</option>
        </select></li>
      
        <li><router-link class="link" to="/options">Options</router-link></li>
    </div>
    </ul>
  </nav>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const navigateToRoute = (event) => {
    const selectedRoute = event.target.value;
    if (selectedRoute) {
      router.push(selectedRoute);
    }
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
  display: flex;
  flex-direction: row;
  align-items: center;
  width:100%;
  height:75px;
  list-style: none;
  justify-content: space-between;
}
.link{
  text-decoration: none;
  padding: 0 1em 0 1em;
}
#links{
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
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