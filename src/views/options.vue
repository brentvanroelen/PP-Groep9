<template>

    <h1>options</h1>
    <section class="options">
        <div class="pickUp">
            <div class="availableDays">
            <h3>Edit available pickup time</h3>
            <h5>Start time: </h5><input type="time" name="" id="" v-model="startPickupTime"> <h5>End time: </h5><input type="time" name="" id="" v-model="endPickupTime">
            <div id="days">
            <h5>Available days: </h5>
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
            <h3>Edit loans</h3>
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
            <div class="warningSystem">
                <h3>Edit warning system</h3>
                    <h5>Overdue time till warning?</h5>
                        <select name="" id="minutesOvertime" v-model="overdueTimeTillWarning">
                            <option value="5">5 minutes</option>
                            <option value="10">10 minutes</option>
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="25">25 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="35">35 minutes</option>
                            <option value="40">40 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="50">50 minutes</option>
                            <option value="55">55 minutes</option>
                            <option value="60">60 minutes</option>
                        </select>
            
                </div>


                <div class="blacklistWarnings">
                <h5>Required warnings to blacklist: </h5>
                <select name="" id="blacklistSelect" v-model="requiredWarningsToBlacklist">
                    <option value="1">1 warning</option>
                    <option value="2">2 warnings</option>
                    <option value="3">3 warnings</option>
                    <option value="4">4 warnings</option>
                    <option value="5">5 warnings</option></select>
                </div>
                <div class="dayContainer">
                <h5>Project requests: </h5>
                
                    <label for="switch" class="days">Allow</label><label class="switch">
                        <input type="checkbox" v-model="allowRequests">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
            <div class="returns">
                <div class="editReturns">
                    <h3>Edit returns</h3>
                    <h5>Sudden returns: </h5>
                        <div class="dayContainer">
                            <label for="switch" class="days">Allow</label><label class="switch">
                                <input type="checkbox" v-model="allowSuddenReturns">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    <h5> Return start time: </h5><input type="time" name="" id="" v-model="returnStartTime"> <h5>Return end time: </h5><input type="time" name="" id="" v-model="returnEndTime">
                    <div class="editLoaning">
                        <h3>Edit loaning</h3>
                            <h5>User loan limit</h5>
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
                                
                            <h5>User kit limit</h5>
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
            </div>
    </section>
    <button @click="update()">Update Options</button>

    



</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useOptions } from '@/Pinia/Store.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Index.js';

const fetchData = async () => {
 const docRef = doc(db, "Settings", "Options");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        startPickupTime.value = data.startPickupTime;
        endPickupTime.value = data.endPickupTime;
        monday.value = data.monday;
        tuesday.value = data.tuesday;
        wednesday.value = data.wednesday;
        thursday.value = data.thursday;
        friday.value = data.friday;
        student.value = data.student;
        teacher.value = data.teacher;
        overdueTimeTillWarning.value = data.overdueTimeTillWarning;
        requiredWarningsToBlacklist.value = data.requiredWarningsToBlacklist;
        allowRequests.value = data.allowRequests;
        allowSuddenReturns.value = data.allowSuddenReturns;
        returnStartTime.value = data.returnStartTime;
        returnEndTime.value = data.returnEndTime;
        userLoanLimit.value = data.userLoanLimit;
        userKitLimit.value = data.userKitLimit;
        studentReservation.value = data.studentReservation;
        teacherReservation.value = data.teacherReservation;
    }else{
        console.log("There is no data");
    }
}
onMounted(fetchData);

const studentReservation = ref();
const teacherReservation = ref();
const startPickupTime = ref();
const endPickupTime = ref();
const monday = ref();
const tuesday = ref();
const wednesday = ref();
const thursday = ref();
const friday = ref();
const student = ref();
const teacher = ref();
const overdueTimeTillWarning = ref();
const requiredWarningsToBlacklist = ref();
const allowRequests = ref();
const allowSuddenReturns = ref();
const returnStartTime = ref();
const returnEndTime = ref();
const userLoanLimit = ref();
const userKitLimit = ref();

const update = () => {
    const options = useOptions();
    const optionsdata = {
        startPickupTime: startPickupTime.value,
        endPickupTime: endPickupTime.value,
        monday: monday.value,
        tuesday: tuesday.value,
        wednesday: wednesday.value,
        thursday: thursday.value,
        friday: friday.value,
        student: parseInt(student.value),
        teacher: parseInt(teacher.value),
        studentReservation: parseInt(studentReservation.value),
        teacherReservation: parseInt(teacherReservation.value),
        overdueTimeTillWarning: parseInt(overdueTimeTillWarning.value),
        requiredWarningsToBlacklist: parseInt(requiredWarningsToBlacklist.value),
        allowRequests: allowRequests.value,
        allowSuddenReturns: allowSuddenReturns.value,
        returnStartTime: returnStartTime.value,
        returnEndTime: returnEndTime.value,
        userLoanLimit: parseInt(userLoanLimit.value),
        userKitLimit: parseInt(userKitLimit.value)
    };
    //update pinia
    options.updateOptions(optionsdata);

    //update firebase databank
    const docRef = doc(db, "Settings", "Options");
    setDoc(docRef, optionsdata);

    //test
    console.log(options.options);
}



</script>


<style scoped>
h1{
    padding: 2em;
}
 .options{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 50px;
        margin: auto;
        width: 1500px;
}

button{
    background-color: #FF0000;
    padding: 10px;
    cursor: pointer;
    margin: 2em;
    color: white;
    border-radius: 1em;
    width: 300px;
    height: 50px;
    border: none;
}
 .pickUp {
        padding-top: 1em;
        height: 500px;
        width: 300px;
        background-color: #c1c1c1;
        border-radius: 1em;
    }
#days{
    margin: 1em;
}
.editLoaning{
    margin: 1em;
}

    .availableDays label,
    .availableDays select  {
        display: block;
        margin-bottom: 5px;
    }
    .availableDays label {
    display: inline-block;
    margin-right: 5px; 
}

.availableDays .switch {
    display: inline-block;
    vertical-align: middle; 
}

/* W³ School */
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
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
  background-color:#909090;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 17px;
}

.slider.round:before {
  border-radius: 50%;
}

.warningSys {
    width: 300px;
    height: 500px;
    background-color: #c1c1c1;
    padding-top: 1em;
    border-radius: 1em;
}

.returns{
    width: 300px;
    height: 500px;
    background-color: #c1c1c1;
    padding-top: 1em;
    border-radius: 1em;
}





</style>