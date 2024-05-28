<template>
  <div class="info-container">
    <div class="info" v-for="(extension, index) in allExtensions" :key="index">
      <div class="details">
        <p>Student: {{ extension.studentName }}</p>
        <p>Extension duration: {{ extension.extensionDuration }} days</p>
      </div>
      <div class="details">
        Product: {{ extension.productName }}
      </div>
      <div class="tekst">
        {{ extension.reason }}
      </div>
      <div class="actions">
        <button class="action-btn1" @click="approveRequest(extension.userId, extension.extensionId, index, extension.extensionDuration, extension.reservationId)">Accept</button>
        <button class="action-btn2" @click="denyRequest(extension.userId, extension.extensionId, index)">Deny</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getDocs, getDoc, doc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';

const allExtensions = ref([]);

const fetchUserExtensionsData = async () => {
  try {
    const usersQuerySnapshot = await getDocs(collection(db, 'Users'));
    const allExtensionsData = [];

    for (const userDoc of usersQuerySnapshot.docs) {
      const userId = userDoc.id;
      const userExtensionsQuerySnapshot = await getDocs(collection(db, `Users/${userId}/ExtensionRequests`));

      for (const extensionDoc of userExtensionsQuerySnapshot.docs) {
        const extensionData = extensionDoc.data();

        allExtensionsData.push({
          extensionId: extensionDoc.id,
          userId: userId,
          studentName: extensionData.studentName,
          extensionDuration: extensionData.extensionDuration,
          reason: extensionData.reason,
          reservationId: extensionData.reservationId,
          productName: await getProductByReservationId(userId, extensionData.reservationId)
        });
      }
    }

    allExtensions.value = allExtensionsData;
  } catch (error) {
    console.error('Error fetching user extensions:', error);
  }
};

const getProductByReservationId = async (userId, reservationId) => {
  try {
    const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
    const reservationDoc = await getDoc(reservationDocRef);
    const reservationData = reservationDoc.data();

    return reservationData?.Item1?.ItemName || 'Product not found';
  } catch (error) {
    console.error('Error fetching product name:', error);
    return 'Product not found';
  }
};

const approveRequest = async (userId, extensionId, index, extensionDuration, reservationId) => {
  try {
    const reservationDocRef = doc(db, `Users/${userId}/Reservations/${reservationId}`);
    const reservationDoc = await getDoc(reservationDocRef);
    const reservationData = reservationDoc.data();

    let { EndDate, EndMonth, StartMonth, StartDate } = reservationData;
    let year = new Date().getFullYear();

    EndDate += extensionDuration;

    while (EndDate > 28) {
      let daysInMonth;
      switch (EndMonth) {
        case 2:
          daysInMonth = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
          break;
        case 4: case 6: case 9: case 11:
          daysInMonth = 30;
          break;
        default:
          daysInMonth = 31;
      }

      if (EndDate > daysInMonth) {
        EndDate -= daysInMonth;
        EndMonth++;
        if (EndMonth > 12) {
          EndMonth = 1;
          year++;
        }
      } else {
        break;
      }
    }

    await updateDoc(reservationDocRef, {
      EndDate,
      EndMonth,
    });

    await deleteDoc(doc(db, `Users/${userId}/ExtensionRequests/${extensionId}`));
    allExtensions.value.splice(index, 1);
  } catch (error) {
    console.error('Error approving request:', error);
  }
};

const denyRequest = async (userId, extensionId, index) => {
  try {
    await deleteDoc(doc(db, `Users/${userId}/ExtensionRequests/${extensionId}`));
    allExtensions.value.splice(index, 1);
  } catch (error) {
    console.error('Error denying request:', error);
  }
};

onMounted(() => {
  fetchUserExtensionsData();
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}
.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: auto;
}

/* Individual extension info */
.info {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 90%;
  max-width: 1200px;
}

.info:hover {
  transform: translateY(-5px);
}

.details, .tekst, .actions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.actions {
  align-items: flex-end;
}

.action-btn1,
.action-btn2 {
  font-size: 14px;
  margin-bottom: 5px;
  width:100px;
  padding: 10px 0;
  width: 120px;
  height: 40px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn1 {
  background-color: #4caf50;
}

.action-btn1:hover{
  background-color: #45a049;
}

.action-btn2 {
  background-color: #f44336;
}

.action-btn2:hover{
  background-color:#d32f2f ;
}

.action-btn1:hover,
.action-btn2:hover {
  transform: scale(1.1);
}

.details p {
  margin: 5px 0;
  font-size: 16px;
  text-align: start;
}

.tekst {
  font-size: 16px;
  color: #000;
}
</style>

