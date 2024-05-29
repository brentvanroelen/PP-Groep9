<template>

    <h1>options</h1>
    <section class="options">
        <div class="pickUp">
            <div class="availableDays">
            <h2>Edit available pickup time</h2>
            <div id="days">
            <h4>Available days: </h4>
                <div class="dayContainer">
                    <label for="switch" class="days">Monday</label><label class="switch">
                        <input type="checkbox" v-model="monday">
                        <span class="slider round"></span>
                    </label>
                    <br>
                    <label for="switch" class="days">Tuesday</label><label class="switch">
                        <input type="checkbox" v-model="tuesday">
                        <span class="slider round"></span>
                    </label>
                    <br>
                    <label for="switch" class="days">Wednesday</label><label class="switch">
                        <input type="checkbox" v-model="wednesday">
                        <span class="slider round"></span>
                    </label>
                    <br>
                    <label for="switch" class="days">Thursday</label><label class="switch">
                        <input type="checkbox" v-model="thursday">
                        <span class="slider round"></span>
                    </label>
                    <br>
                    <label for="switch" class="days">Friday</label><label class="switch">
                        <input type="checkbox" v-model="friday">
                        <span class="slider round"></span>
                    </label></div></div>

        </div>

        <div class="loanDuration">
            <h2>Edit loans</h2>
            <h4>Loan duration: </h4>
            <label for="student" class="student">Student: </label> 
            <select name="weken" id="wekenSelect" v-model="student">
                <option value=1>1 week</option>
                <option value=2>2 weeks</option>
                <option value=3>3 weeks</option>
                <option value=4>4 weeks</option>
            </select>
            <br>
            <label for="Teacher" class="teacher">Teacher: </label> 
            <select name="weken" id="wekenSelect" v-model="teacher">
                <option value=1>1 week</option>
                <option value=2>2 weeks</option>
                <option value=3>3 weeks</option>
                <option value=4>4 weeks</option>
            </select>
            <h4>Reservation duration</h4>
            <label for="studentReservation" class="student">Student: </label> 
            <select name="weken" id="wekenSelect" v-model="studentReservation">
                <option value=1>1 week</option>
                <option value=2>2 weeks</option>
                <option value=3>3 weeks</option>
                <option value=4>4 weeks</option>
            </select>
            <br>
            <label for="TeacherReservation" class="teacher">Teacher: </label> 
            <select name="weken" id="wekenSelect" v-model="teacherReservation">
                <option value=1>1 week</option>
                <option value=2>2 weeks</option>
                <option value=3>3 weeks</option>
                <option value=4>4 weeks</option>
            </select>
        </div>
            </div>
            
            
        <div class="warningSys">
            <h2>Edit blacklist system</h2>
            <div class="warningSystem">
                <label for="switch" class="days">Automatic warnings:</label><label class="switch">
                    <input type="checkbox" v-model="autoWarnings">
                    <span class="slider round"></span>
                </label>
            </div>
                <div class="blacklistWarnings">
                <h4>Required warnings to blacklist: </h4>
                <select name="" id="blacklistSelect" v-model="requiredWarningsToBlacklist">
                    <option value="1">1 warning</option>
                    <option value="2">2 warnings</option>
                    <option value="3">3 warnings</option>
                    <option value="4">4 warnings</option>
                    <option value="5">5 warnings</option></select>
                </div>
            </div>
            <div class="returns">
                    <div class="editLoaning">
                        <h2>Edit loaning</h2>
                            <h4>User loan limit</h4>
                            <select name="" id="loanLimit" v-model="userLoanLimit">
                                <option value="1" >1 item</option>
                                <option value="2">2 items</option>
                                <option value="3">3 items</option>
                                <option value="4">4 items</option>
                                <option value="5">5 items</option>
                                <option value="6">6 items</option>
                                <option value="7">7 items</option>
                                <option value="8">8 items</option>
                                <option value="9">9 items</option>
                                <option value="10">10 items</option></select>
                                
                            <h4>User kit limit</h4>
                            <select name="" id="kitLimit" v-model="userKitLimit">
                                <option value="1">1 kit</option>
                                <option value="2">2 kits</option>
                                <option value="3">3 kits</option>
                                <option value="4">4 kits</option>
                                <option value="5">5 kits</option>
                                <option value="6">6 kits</option>
                                <option value="7">7 kits</option>
                                <option value="8">8 kits</option>
                                <option value="9">9 kits</option>
                                <option value="10">10 kits</option></select>
                    </div>
            </div>
    </section>
    <button @click="update()">Update Options</button>
    <Popup v-if="popupVisible" :message="popupMessage" @close="popupVisible = false" />

    



</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useOptions } from '@/Pinia/Store.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';
import Popup from '@/components/Popup.vue';

const fetchData = async () => {
 const docRef = doc(db, "Settings", "Options");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        monday.value = data.monday;
        tuesday.value = data.tuesday;
        wednesday.value = data.wednesday;
        thursday.value = data.thursday;
        friday.value = data.friday;
        student.value = data.student;
        teacher.value = data.teacher;
        requiredWarningsToBlacklist.value = data.requiredWarningsToBlacklist;
        userLoanLimit.value = data.userLoanLimit;
        userKitLimit.value = data.userKitLimit;
        studentReservation.value = data.studentReservation;
        teacherReservation.value = data.teacherReservation;
        autoWarnings.value = data.autoWarnings;
    }else{
        console.log("There is no data");
    }
}
onMounted(fetchData);

const studentReservation = ref();
const teacherReservation = ref();
const monday = ref();
const tuesday = ref();
const wednesday = ref();
const thursday = ref();
const friday = ref();
const student = ref();
const teacher = ref();
const requiredWarningsToBlacklist = ref();
const userLoanLimit = ref();
const userKitLimit = ref();
const autoWarnings = ref();
const popupVisible = ref(false);
const popupMessage = ref('');




const showPopup = (message) => {
popupMessage.value = message;
popupVisible.value = true;
};

const update = () => {
    const options = useOptions();
    const optionsdata = {
        monday: monday.value,
        tuesday: tuesday.value,
        wednesday: wednesday.value,
        thursday: thursday.value,
        friday: friday.value,
        student: parseInt(student.value),
        teacher: parseInt(teacher.value),
        studentReservation: parseInt(studentReservation.value),
        teacherReservation: parseInt(teacherReservation.value),
        requiredWarningsToBlacklist: parseInt(requiredWarningsToBlacklist.value),
        userLoanLimit: parseInt(userLoanLimit.value),
        userKitLimit: parseInt(userKitLimit.value),
        autoWarnings: autoWarnings.value
    };
    //update pinia
    options.updateOptions(optionsdata);

    //update firebase databank
    const docRef = doc(db, "Settings", "Options");
    setDoc(docRef, optionsdata);

    //test
    console.log(options.options);
    showPopup('Options are updated!');
}



</script>

<style scoped>
h1 {
    text-align: center;
    margin-bottom: 40px;
}

/* Style voor sections container */
.options {
    display: flex;
    justify-content: space-between;
}

/* Styling voor aparte sections */
.options > div {
    flex: 1;
    margin-right: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease; 
}

/* Hover effect op option sections */
.options > div:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.options h2 {
    margin-bottom: 20px;
}
.warningSystem{
    margin: 1em;
}

.options label {
    margin-right: 10px;
    font-weight: bold;
}
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #28a745;
}

input:focus + .slider {
    box-shadow: 0 0 1px #28a745;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* Style for select dropdowns */
.options select {
    padding: 8px 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
    margin-bottom: 10px;
}

.options input[type="time"] {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
    margin-bottom: 5px;
}

button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background-color: #dc3545;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
    background-color: #c82333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

</style>
