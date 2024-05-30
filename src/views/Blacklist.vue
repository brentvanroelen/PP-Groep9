  <template>
    <div>
      <h1 class="title">User blacklist</h1>
      <div class="actions">
        <label for="cijfer">Show</label>
        <select id="cijfer" name="cijfer" @change="handleSelectChange">
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
          <option value="7">7</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <br><br>
        <form action="/search" method="GET" @submit.prevent="searchUsers">
          <label for="search">Search:</label>
          <input type="text" id="search" name="search" @input="searchUsers" v-model="searchText">
          <button type="submit">Search</button>
        </form>
      </div>

      <table class="content">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Warnings</th>
            <th>Blacklisted</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="index">
              <td>{{ user.name }}</td>
              <td>{{ user.contact }}</td>
              <td>
                <button @click="increaseWarning(index)" class="button">+</button>
                <span class="warning-count">{{ user.warningCount }}</span>
                <button @click="decreaseWarning(index)" class="button">-</button>
              </td>
            <td :class="getBlacklistedClass(user.warningCount)">
              <div class="border">{{ user.blacklisted }}</div>
            </td>
            
          </tr>
        </tbody>
      </table>

      <div class="pagination-container">
        <p>Showing 1 to 10 of 100 entries</p>
        <div class="pagination">
          <a href="#">&laquo;</a> 
          <a href="#">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <span>...</span>
          <a href="#">10</a>
          <a href="#">&raquo;</a> 
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { onMounted, ref } from 'vue';
  import { doc, getDocs, collection, getDoc } from 'firebase/firestore'; 
  import { db, updateDoc } from '@/Firebase/Index.js';

  async function updateWarningCountInDatabase(userId, newWarningCount) {
  try {
    const userRef = doc(db, 'Users', userId); 
    await updateDoc(userRef, {
      warningCount: newWarningCount
    });
    console.log('Warning count updated in database:', userId, newWarningCount);
  } catch (error) {
    console.error('Error updating warning count in database:', error);
  }
}
  const users = ref([]);
  const filteredUsers = ref(users.value);
  const requiredWarningsToBlacklist = ref();
  const autoWarnings = ref();

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Users'));
      querySnapshot.forEach(doc => {
        const user = doc.data();
        const userId = doc.id
        if(user.type && user.type !== 'docent'){
        users.value.push({
          name: `${user.firstName} ${user.lastName}`,
          contact: user.email,
          warningCount: user.warningCount,
          blacklisted: user.blacklisted,
          userId: userId
        });
      }
    });
      applyColorsToAllRows();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  const fetchSettings = async () => {
    const docRef = doc(db, "Settings", "Options");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        requiredWarningsToBlacklist.value = data.requiredWarningsToBlacklist;;
        autoWarnings.value = data.autoWarnings;
    }else{
        console.log("There is no data");
    }
  }
  onMounted(fetchData);
  onMounted(fetchSettings);

  function updateBlacklistedStatus(index) {
      const warnings = users.value[index].warningCount;
      if(warnings == 0){
        users.value[index].blacklisted = 'no';
      } else if (warnings >= requiredWarningsToBlacklist.value) {
        users.value[index].blacklisted = 'yes';
      } else {
        users.value[index].blacklisted = 'no';
      }
    }

  function applyColorsToAllRows() {
      users.value.forEach((_, index) => {
        updateBlacklistedStatus(index);
      });
    }
    
    applyColorsToAllRows();
    
    function handleSelectChange(event) {
      const aantal = parseInt(event.target.value);
      filteredUsers.value = users.value.slice(0, aantal);
    }
    
    function increaseWarning(index) {
      console.log(requiredWarningsToBlacklist.value)
      if (users.value[index].warningCount < requiredWarningsToBlacklist.value) {
        users.value[index].warningCount++;
        updateBlacklistedStatus(index);
        const userId = users.value[index].userId; 
        console.log(userId)
        updateWarningCountInDatabase(userId, users.value[index].warningCount);
      }
    }

    function decreaseWarning(index) {
      if (users.value[index].warningCount > 0) {
        users.value[index].warningCount--;
        updateBlacklistedStatus(index);
        const userId = users.value[index].userId; 
        updateWarningCountInDatabase(userId, users.value[index].warningCount);
      }
    }
    
   
    
    function getBlacklistedClass(warningCount) {
      if (warningCount === 1 ) {
        return 'green';
      } else if (warningCount < requiredWarningsToBlacklist.value && warningCount > 1) {
        return 'orange';
      } else if (warningCount >= requiredWarningsToBlacklist.value) {
        return 'red';
      } else {
        return '';
      }
    }

    const searchText = ref('');

    function searchUsers() {
      const searchTerm = searchText.value.toLowerCase();
      filteredUsers.value = users.value.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
      console.log('test')
    }
    
  </script>

  <style scoped>
  body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      color: #333;
    }
    
    .title {
      text-align: center;
      font-size: 32px;
      color: #444;
      margin-bottom: 20px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
    
    .actions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 80%;
      max-width: 1200px;
      align-items: center;
      margin-bottom: 20px;
      margin-left: auto;
      margin-right: auto; /* border tussen actions en tabel */
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    
    .actions label {
      font-weight: bold;
      margin-right: 10px;
    }
    
    .actions form {
      display: flex;
      gap: 10px;
    }

    .actions input[type="text"] {
      padding: 8px; 
      border: 1px solid #ccc;
      border-radius: 20px; 
    }
  
    .actions button {
      padding: 8px 12px; 
      border: none;
      background-color: #5cb85c;
      color: white;
      border-radius: 20px; 
      cursor: pointer;
      transition: background-color 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    }
    .button{
      margin: 0.5em;
      padding: 0em 0.8em;
      background-color: #dfdfdf;
      border: none;
      border-radius: 10px;
    }
    .button:hover{
      background-color: #9a9a9a;
    }

    .actions button:hover {
      background-color: #4cae4c;
    }
    
    table {
      width: 80%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 10px;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .content {
    margin: 0 auto;
    transition: transform 0.3s ease;
    }

    th,
    td {
      padding: 12px; /*padding van cel */
      border: 1px solid #e9e9e9;
      text-align: center;
    }
  
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
  
    td {
      background-color: #fff;
    }
  
    tr:hover td {
      background-color: #f1f1f1; 
    }
  
   
     tr:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

     .content:hover {
    transform: translateY(-3px);
    }
    
    .pagination {
      display: flex;
      gap: 5px;
    }
    
    .pagination-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 20px 0;
    }
    
   .pagination a {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #337ab7;
    text-decoration: none;
    transition: background-color 0.3s;
    }
  
    .pagination a:hover {
      background-color: #eee;
    }
      
    .red div {
      background-color: #ffcccc;
      color: red;
      border-radius: 10px; 
      padding: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .green div {
      background-color: #ccffcc;
      color: green;
      border-radius: 10px; 
      padding: 8px; 
    }
    
    .orange div { 
    background-color: #ffd699;
    color: orange;
    border-radius: 10px;
    padding: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
  </style>


    
