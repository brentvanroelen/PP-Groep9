<template>

    <h1>options</h1>
    <section class="options">
        <div class="pickUp">
            <div class="availableDays">
            <h3>Edit available pickup time</h3>
            <h5>Start time: </h5><input type="time" name="" id=""> <h5>End time: </h5><input type="time" name="" id="">
            <h5>Available days: </h5>
                <div class="dayContainer">
                    <label for="switch" class="days">Monday</label><label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <label for="switch" class="days">Tuesday</label><label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <label for="switch" class="days">Wednesday</label><label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <label for="switch" class="days">Thursday</label><label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <label for="switch" class="days">Friday</label><label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label></div>
        </div>

        <div class="loanDuration">
            <h3>Edit loan duration</h3>
            <h4>Loan duration: </h4>
            <label for="student">Student: </label> <select name="weken" id="wekenSelect">
                <option value="1">1 week</option>
                <option value="2">2 weeks</option>
                <option value="3">3 weeks</option>
                <option value="4">4 weeks</option>

            </select>
            <label for="Teacher">Teacher: </label> <select name="weken" id="wekenSelect">
                <option value="1">1 week</option>
                <option value="2">2 weeks</option>
                <option value="3">3 weeks</option>
                <option value="4">4 weeks</option>
                
            </select>
            </div></div>
            
            
        <div class="warningSys">
            <div class="warningSystem">
                <h3>Edit warning system</h3>
                    <h5>Overdue time till warning?</h5>
                        <select name="" id="minutesOvertime">
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
                <select name="" id="blacklistSelect">
                    <option value="1">1 warning</option>
                    <option value="2">2 warnings</option>
                    <option value="3">3 warnings</option>
                    <option value="4">4 warnings</option>
                    <option value="5">5 warnings</option></select>
                </div>

                <h5>Project requests: </h5>
                <div class="dayContainer">
                    <label for="switch" class="days">Allow</label><label class="switch">
                        <input type="checkbox">
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
                                <input type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    <h5> Return start time: </h5><input type="time" name="" id=""> <h5>Return end time: </h5><input type="time" name="" id="">
                    <div class="editLoaning">
                        <h3>Edit loaning</h3>
                            <h5>User loan limit</h5>
                            <select name="" id="loanLimit">
                                <option value="1">1 item</option>
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
                            <select name="" id="kitLimit">
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



</template>


<style>
 .options{
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;


}
 .pickUp {
        
        
        width: 400px;
        height: 800px;
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .pickUp h3 {
        margin-top: 0;
    }

    .availableDays label,
    .availableDays select {
        display: block;
        margin-bottom: 10px;
    }
    .availableDays label {
    display: inline-block;
    margin-right: 10px; 
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
  background-color: #ccc;
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
    
    align-items: center;
    margin-right: 400px;
    margin-left: 400px;
    width: 400px;
    height: 800px;
    margin-top: 0px;
    margin-bottom: 0px;
}

.returns{
    
    width: 400px;
    height: 800px;
    margin-top: 0px;
    margin-bottom: 0px;
}





</style>