<template>
  <div class="search-bar">
    <input type="text" :class="props.page" v-model="querystring" @keyup.enter="search" :placeholder="placeholder">
    <button @click="search" v-if="props.page != 'AddKit'">Search</button>
  </div>

  <div v-if="results.length > 0" class="items-grid">
    <div v-for="(item, index) in results" :key="index" class="item">
      <div class="icons">
        <router-link :to="{ path: '/checkPage', query: { item: JSON.stringify(item) } }" class="link">
          <img src="/src/assets/552871.png" alt="" class="icon">
        </router-link>
        <router-link :to="{ path: '/historyPage', query: { item: JSON.stringify(item) } }" class="link">
          <img src="/src/assets/book.png" alt="" class="icon">
        </router-link>

        <!-- <router-link :to="{ path: '/changeItemInfo', query: { item: JSON.stringify(item) } }" class="link">
          <img src="/src/assets/edit-icon-2048x2048-6svwfwto.png" alt="" class="icon">
        </router-link> -->
        
        <img src="/src/assets/trash.png" alt="" class="icon trash-icon" @click="deleteItem(index)">
      </div>
      <h2>{{ item.Name }}</h2>
      <h3>{{ item.Serial }}</h3>
      <img :src="item.Image" alt="Item Image" id="img">
      <p>{{ item.Description }}</p>
    </div>
  </div>
  <div class="search-results" v-if="showResults">
    <div v-for="result in store.results" :key="result.id">
      <div class="iteminfo" @click="setPage(result)">
        <img v-if="getImage(result)" :src="result.loadedImage" alt="item">
        <p v-if="result.id != 10000 ">{{ result.Name }}</p>
        <p v-else> Make a new kit with name: {{ result.Name }}</p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useKitToBeMade, useStore, useEarlyReturnsReservations, useSearchedItems as useSearchedItemsFunction } from '@/Pinia/Store.js';
import { db, getDocs, query, where, collection, deleteDoc, doc } from '../Firebase/Index.js';
import { imageGetter } from '@/js/functions.js';

const useSearchedItems = useSearchedItemsFunction();
const kitToBeMade = useKitToBeMade();
const querystring = ref('');
const store = useStore();
const results = ref([]);
const reservationsAdmin = useEarlyReturnsReservations();
let generalItem;
const showResults = ref(false);
const placeholder = ref('Search');

const props = defineProps({
  page: String,
  class: String,
});

const log = () => {
  console.log(querystring.value);
};

watch(querystring, async (newVal, oldVal) => {
  if (props.page == 'AddKit') {
    if (newVal.length >= 3) {
      await searchKit();
      store.results.push({ id: 10000, Name: querystring.value, loadedImage: '/src/assets/plus.jpg' });
      showResults.value = store.results.length > 0;
    } else {
      showResults.value = false;
    }
  }
});

const search = async () => {
  if (props.page === 'HomeAdmin') {
    searchAdmin();
  } else {
    console.log(querystring.value);
    store.updateResults([]);
    await querySnapshot1().then(() => {
      querySnapshot2();
      querySnapshotByName();
    });

    store.updateResults(results.value);
    console.log(results.value);
  }
};

const querySnapshotByName = async () => {
  const nameQuery = query(
    collection(db, 'Items'),
    where('Name', '==', querystring.value)
  );
  const snapshot = await getDocs(nameQuery);
  snapshot.forEach((doc) => {
    results.value.push({ id: doc.id, ...doc.data() });
  });
  console.log(results.value);
};



const deleteItem = async (index) => {
  const itemToDelete = results.value[index];
  console.log('Item to delete:', itemToDelete);
  try {
    const collectionName = generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1);
    const docRef = doc(db, `Items/${collectionName}/${collectionName} items`, itemToDelete.id);
    await deleteDoc(docRef);
    results.value.splice(index, 1);
    console.log('Item deleted successfully');
  } catch (error) {
    console.error('Error removing document: ', error);
  }
};

const searchAdmin = async () => {
  reservationsAdmin.Reservations = [];
  const cref = collection(db, 'Utility/Reservations/All Reservations');
  const qref = query(cref, where('allItemSerials', 'array-contains-any', [querystring.value]));
  const docs = await getDocs(qref);
  docs.forEach((doc) => {
    let reservation = {
      id: doc.id,
      User: doc.data().User,
      UserFirstName: doc.data().UserFirstName,
      UserLastName: doc.data().UserLastName,
      allItemSerials: doc.data().allItemSerials,
      ItemSerials: doc.data().ItemSerials,
      allItemNames: doc.data().allItemNames,
      EndDate: doc.data().EndDate,
      EndMonth: doc.data().EndMonth,
      ReservationPrepared: doc.data().ReservationPrepared,
      StartMonth: doc.data().StartMonth,
      StartDate: doc.data().StartDate,
      showItems: false,
      Items: [],
    };
    for (let i = 1; i <= doc.data().allItemSerials.length; i++) {
      reservation.Items.push(doc.data()[`Item${i}`]);
    }

    reservationsAdmin.addReservation(reservation);
  });
  console.log(reservationsAdmin.Reservations);
};

const searchKit = async () => {
  let kits = [];
  store.updateResults([]);
  const itemQuery = query(
    collection(db, 'Kits'),
    where('SubStrings', 'array-contains', querystring.value.toLowerCase())
  );
  const docs = await getDocs(itemQuery);
  if (docs.empty) {
    console.log('No matching documents.');
    return;
  }
  docs.forEach((doc) => {
    kits.push(doc.data());
    store.updateResults(kits);
  });
  console.log(store.results);
};

const setPage = (result) => {
  kitToBeMade.addKit(result);
  console.log(kitToBeMade.kit);
  querystring.value = '';
};

const querySnapshot1 = async () => {
  const itemQuery1 = query(
    collection(db, 'Items'),
    where('SerialSeries', '==', querystring.value.split('-')[0])
  );
  const doc = await getDocs(itemQuery1);
  doc.forEach((doc) => {
    generalItem = doc.data();
  });
  return generalItem;
};

const querySnapshot2 = async () => {
  if (!generalItem) return; // Ensure generalItem is defined
  console.log(generalItem);
  const itemQuery2 = query(
    collection(
      db,
      `Items/${
        generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)
      }/${generalItem.Name.charAt(0).toUpperCase() + generalItem.Name.slice(1)} items`
    ),
    where('Serial', '==', querystring.value)
  );
  const snapshot = await getDocs(itemQuery2);
  snapshot.forEach((doc) => {
    results.value.push({ id: doc.id, ...doc.data() });
  });
  console.log(results.value);
};

const getImage = async (result) => {
  console.log(result);
  if (result != undefined && result.id != 10000) {
    await imageGetter(`KitImages/${result.KitImage}`).then((res) => {
      result.loadedImage = res;
    });
    console.log(result);
    return true;
  } else {
    return false;
  }
};

onMounted(() => {
  placeholder.value = props.page == 'AddKit' ? 'Type name of Kit you want to add items to' : 'Search for items';
});
</script>

<style scoped>
.AddKit {
  width: 60%;
}
.icon-img {
  width: 20px;
  height: 20px;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
}

#icon1 {
  width: 20px;
  height: 20px;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
}

.search-bar {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

.search-bar button {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 20px;
}
button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#img {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.items-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  min-height: 200px;
}

.item {
  border: 1px solid #ccc;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.item h2 {
  font-size: 1.5em;
}

.item p {
  font-size: 1.1em;
}

.icons {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
}

.icons ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.icons .link img,
.icons .trash-icon {
  width: 20px;
  height: 20px;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
}

.icons ul img,
.icons .link img {
  width: 20px;
  height: 20px;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
