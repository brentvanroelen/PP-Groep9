<template>

    <header>
        <h1 class="cart-title">CART</h1>
    </header>
    
    <main>
        <div v-for="(item, index) in items" :key="index">
    <div class="item-box">
        <img :src="item.Image" alt="" id="itemImg">
        <div id="itemInfo-box">
        <h2>{{ item.Name }}</h2>
        <p><b>Description: </b> {{ item.Description }}</p>
        <p><b>Serial Series: </b> {{  item.SerialSeries }}</p>
    </div>
        <p><b>Start date: </b> {{ itemDate.general[0] + "/" + itemDate.general[1]  }}</p>
        <VueDatePicker class="datepicker" v-model="beginDate" 
          :min-date="new Date()" 
          :teleport="true"
          :max-date="maxDate"
          :enable-time-picker="false"
          :disabled-week-days="[6,0]"
          @update:model-value="updateBeginDate">
          <template #trigger>
            <img src="../assets/calendar.png" alt="">
          </template>
        </VueDatePicker>
        <p><b>End date:</b> {{ itemDate.general[2] + "/" + itemDate.general[3] }}</p>
        <VueDatePicker class="datepicker" v-model="endDate" 
          :min-date="new Date()" 
          :teleport="true"
          :max-date="maxDate"
          :enable-time-picker="false"
          :disabled-week-days="[6,0]"
          @update:model-value="updateEndDate">
          <template #trigger>
            <img src="../assets/calendar.png" alt="">
          </template>
        </VueDatePicker>
        <div class="item-trash" @click="removeItem()">
            <img src="../assets/trash.png" alt="">
        </div>
      </div>
        
    </div>
    

        <section class="selected-items-container">
            <div class="selected-items">
                <strong>Selected items:</strong>
                <span id="item-count">{{ itemCount }}</span>
            </div>
            <ReservationHandler :check-user-cart="true"></ReservationHandler>
        </section>
    </main>

</template>

<script setup>
    import { useCart, useUserIdentification, useDates } from '@/Pinia/Store';
    import { onMounted, ref, computed } from 'vue';
    import ReservationHandler from "@/components/ReservationHandler.vue";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { db } from '@/Firebase/Index.js';

    

    const beginDate = ref();
    const endDate = ref();
    let showPopup = ref(false);
    const cart = useCart();
    const items = cart.items;
    const itemCount = ref(0);
    let length = ref();
    const student = ref();
    const teacher = ref();
    const userType = useUserIdentification();
    const studentReservation = ref();
    const teacherReservation = ref();
    const currentDate = new Date();
    const itemDate = useDates();
    let maxSelect = ref(7);




  
    const fetchData = async () => {
  const docRef = doc(db, "Settings", "Options");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()){
    const data = docSnap.data();
    student.value = data.student;
    teacher.value = data.teacher;
    studentReservation.value = data.studentReservation;
    teacherReservation.value = data.teacherReservation;
  }}
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + length);

    const maxDate = computed(() => {
    let length = ref();
    if(userType.user.type === "student" ){
      length = studentReservation.value * 7 ;
      maxSelect = student.value * 7;
    }else if(userType.user.type === "docent"){
      length = teacherReservation.value * 7 ;
      maxSelect = teacher.value * 7;
    }else if(userType.user.type === "admin"){
      length = 365;
    }
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + length);
    return futureDate;
  });

    for (let i = 0; i < items.length; i++) {
        itemCount.value += 1;
    }

    const removeItem = (index) => {
        cart.removeItem(index);
        itemCount.value -= 1;
    }
    
    const updateBeginDate = (newDate) => {
        if (newDate > endDate.value) {
            alert('Start date cannot be after end date');
            return;
        }
        itemDate.general[0] = newDate.getDate();
        itemDate.general[1] = newDate.getMonth() + 1;
    }
    const updateEndDate = (newDate) => {
        if (newDate < beginDate.value) {
            alert('End date cannot be before start date');
            return;
        }
        itemDate.general[2] = newDate.getDate();
        itemDate.general[3] = newDate.getMonth() + 1;
    }

    onMounted(() => {
    fetchData();
  });
</script>

<style scoped>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        main {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .cart-title {
            font-size: 24px;
            margin-top: 20px;
            text-align: center;
        }
        .datepicker{
            width: 50px;
        }
        hr {
            margin: 20px 0;
            width: 80%;
            border: 0;
            border-top: 1px solid #ccc;
        }

        .selected-items-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        #item-count {
            margin-left: 10px;
            font-weight: bold;
        }

        .confirm-button {
            background-color: red;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
        }

        .confirm-button:hover {
            background-color: darkred;
        }
        .item-box {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background-color: #D9D9D9;
            border-radius: 2em;
            margin: 1em 0 1em 0;
            width: 1500px;
            padding: 1em 0em 1em 0em;
        }
        #itemImg {
            width: 200px;
            border: 2px white solid;
            border-radius: 1em;
        }
        .item-box img {
            width: 40px;
        }
        #itemInfo-box {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 300px;
            height: 150px;
        }
        button{
            padding: 10px 20px;
            background-color: #d50000;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            outline: none;
            margin: 1em;
        }
</style>
