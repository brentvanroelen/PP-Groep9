<template>
    <div class="login">
        <div class="options">
            <ul class="RegisterPageUl">
                <li :class="{isActive: loginActive}" @click="makeActive('login')">Login</li>
                <li :class="{isActive: registerActive}" @click="makeActive('register')">Register</li>
                <button class="loginPageBtn" @click="logOut"> log out</button>
            </ul>
        </div>
        <div class="loginContainer" >
            <div class="loginContent">
                <div class="Content">
                    <h1>{{formTitle}}</h1>
                    <form class='Content' @submit.prevent="onSubmit">
                        <fieldset>
                        <label for="email">Email</label>
                        <input v-model="credentials.email" type="text" placeholder="Username" />
                        </fieldset>
                        <fieldset>
                        <label for="password">Password</label>
                        <input v-model="credentials.password" type="password" placeholder="Password" />
                        </fieldset>
                        <button class="loginPageBtn" type="submit">{{formTitle}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useUserIdentification } from '@/Pinia/Store';

const userIdentification = useUserIdentification();
let loginActive = ref(true);
let registerActive = ref(false);
const credentials = reactive({
    email: '',
    password: ''
});


const makeActive = (name) => {
    if(name === 'login') {
        loginActive.value = true;
        registerActive.value = false;
    } else {
        loginActive.value = false;
        registerActive.value = true;
    }
}

const formTitle = computed(() => {
    return loginActive.value ? 'Login' : 'Register';
});

const logOut = () => {
    userIdentification.logOut();
}
const onSubmit = () => {
    if(credentials.email === '' || credentials.password === '') {
        alert('Please fill in all fields');
        return;
    }else{
        if(loginActive.value){
            userIdentification.login(credentials);
        }else{
            userIdentification.register(credentials)
        }
    }
    console.log('Form submitted');
}
</script>

<style>

.options {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 50%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
}

.RegisterPageUl {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    
}

li {
    padding: 10px;
    text-align: center;
    cursor: pointer;
}

li:hover {
    background-color: #f5f5f5;
}
li.isActive:hover{
    background-color: #007bff;
    color: white;
}

.isActive {
    background-color: #007bff;
    color: white;
}

.loginContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
.loginContent{
    width: 400px;
    padding: 20px;
    background-color: rgb(228, 186, 186);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.Content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
}
.loginPageBtn{
    background-color: #FF0000;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: white;
    border-radius: 1em;
    width: 100%;
    height: 3.8em;
  
}
fieldset{
    display: flex;
    flex-direction: column;
    border: none;
    width: 100%;
}
label{
    font-size: 1.2em;
    margin-bottom: 5px;
    align-self: start;
}
input{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;

}
form.Content{
    width: 100%;
}
</style>