<template>
 <nav class="navAdmin">
    <ul class="navAdminLinks">
      <li id='img'><router-link  to=""><img src="../assets/EhB-logo-transparant.png" alt="" ></router-link></li>
    <div id="links">
      <li><router-link class="link" to="">Home</router-link></li>
        <li><select name="dropdownNav" id="dropdownNav">
            <option value="Manage items">Manage items</option>
             <router-link class="link" to="/ItemPreparationScreen"> <option value="Item preparation">Item preparation</option></router-link>
            <option value="Scheduled items">Scheduled items</option>
        </select></li>
      
        
        <li><select>
            <option value="Users">Users</option>
            <option value="Blacklist">Blacklist</option>
            <option value="User requests ">User requests</option>

            
        </select></li>
      
        <li><router-link class="link" to="">Options</router-link></li>
    </div>
    </ul>
  </nav>
</template>
<script>

export default {
  name: 'NavigationAdmin',
  components: {

  }
}

</script>

<style>
.Main_nav{
  background-color: #c1c1c1;
}
.Main_nav_links li img{
  max-width: 80px;
  height: auto;
  margin-left: 0.5em;
}
.Main_nav_links{
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