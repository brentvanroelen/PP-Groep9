<template>
  <div class="info-container">
    <div class="info" v-for="(userData, userIndex) in userExtensions" :key="userIndex">
      <div class="info" v-for="(extension, extensionIndex) in userData.extensions" :key="extensionIndex">
        <div>
          <p>Student: {{ extension.studentName }}</p>
          <p>Extension duration: {{ extension.extensionDuration }} days</p>
        </div>
        <div>
          Product: {{ extension.productName }}
        </div>
        <div class="tekst">
          {{ extension.reason }}
        </div>
        <div class="actions">
          <button class="action-btn1">V</button>
          <button class="action-btn2">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';

const userExtensions = ref([]);

const fetchUserExtensionsData = async () => {
  try {
    const usersQuerySnapshot = await getDocs(collection(db, 'Users'));
    const allExtensionsData = [];

    for (const userDoc of usersQuerySnapshot.docs) {
      const userId = userDoc.id;
      const userExtensionsQuerySnapshot = await getDocs(collection(db, `Users/${userId}/ExtensionRequests`));

      const userExtensions = [];

      for (const extensionDoc of userExtensionsQuerySnapshot.docs) {
        const extensionData = extensionDoc.data();

        userExtensions.push({
          extensionId: extensionDoc.id,
          studentName: extensionData.studentName,
          extensionDuration: extensionData.extensionDuration,
          status: extensionData.status,
          reason: extensionData.reason,
          reservationId: extensionData.reservationId,
          productName: await getProductByReservatieId(userId, extensionData.reservationId)
          
        });
      }

      if (userExtensions.length > 0) {
        allExtensionsData.push({
          userId: userId,
          extensions: userExtensions
        });
      }
    }

    userExtensions.value = allExtensionsData;
  } catch (error) {
    console.error('Error fetching user extensions:', error);
  }
}

const getProductByReservatieId = async (userId, reservationId) => {
  try {
    const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
    const reservationDoc = await getDoc(reservationDocRef);
    const reservationData = reservationDoc.data();


    const item1 = reservationData?.Item1;


    if (item1) {
      return item1.ItemName || 'Product not found';
    } else {
      return 'Product not found';
    }
  } catch (error) {
    console.error('Error fetching product name:', error);
    return 'Product not found';
  }
}



onMounted(() => {
  fetchUserExtensionsData();
});



</script>




    
    <style scoped>
    .info-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px;
      background-color: #c1c1c1;
      font-size: large;
      width: 80%;
    }
    
    .actions {
      display: flex;
      align-items: center;
    }
    
    .action-btn1,
    .action-btn2 {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      color: white;
      cursor: pointer;
      margin-right: 10px;
    }
    
    .action-btn1 {
      background-color: #4CAF50;
    }
    
    .action-btn2 {
      background-color: red;
    }
    
    .input-text {
      width: 400px;
      height: 100px;
      text-align: left;
      resize: none;
  }
    
    .text {
      margin-right: 0px;
    }
    .tekst{
      font-size: small;
    }
    </style>
    