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
        <button class="action-btn1">Accept</button>
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

          if (extensionData.ForProject) {
            allExtensionsData.push({
              extensionId: extensionDoc.id,
              userId: userId,
              studentName: extensionData.studentName,
              extensionDuration: extensionData.extensionDuration,
              status: extensionData.status,
              reason: extensionData.reason,
              reservationId: extensionData.reservationId,
              productName: await getProductByReservatieId(userId, extensionData.reservationId)
            });
          }
          console.log('All Extensions Data:', allExtensionsData);
 
        }
      }

      allExtensions.value = allExtensionsData;
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
        EndMonth
      });

      await deleteDoc(doc(db, `Users/${userId}/ExtensionRequests/${extensionId}`));
      allExtensions.value.splice(index, 1);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  }

  const denyRequest = async (userId, extensionId, index) => {
    try {
      await deleteDoc(doc(db, `Users/${userId}/ExtensionRequests/${extensionId}`));
      allExtensions.value.splice(index, 1);
    } catch (error) {
      console.error('Error denying request:', error);
    }
  }

  onMounted(() => {
  fetchUserExtensionsData();
});
  </script>


<style scoped>
/* General styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

/* Container */
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
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 80%;
  max-width: 600px;
}

.info:hover {
  transform: translateY(-5px);
}

/* Details */
.details, .tekst, .actions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

/* Action buttons */
.actions {
  align-items: flex-end;
}

.action-btn1,
.action-btn2 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn1 {
  background-color: #4CAF50;
  margin-bottom: 5px;
}

.action-btn2 {
  background-color: #FF5733;
}

.action-btn1:hover,
.action-btn2:hover {
  transform: scale(1.1);
}

/* Text styles */
.details p {
  margin: 5px 0;
  font-size: 14px;
  text-align: start;
}

.tekst {
  font-size: 12px;
  color: #5d5d5d;
}
</style>