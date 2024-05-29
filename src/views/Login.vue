<template>
    <div class="login">
        <div class="options">
            <ul class="RegisterPageUl">
                <li :class="{isActive: loginActive}" @click="makeActive('login')">Login</li>
                <li :class="{isActive: registerActive}" @click="makeActive('register')">Register</li>
                <button class="logOutBtn" @click="logOut">Log out</button>
            </ul>
        </div>
        <div class="loginContainer">
            <div class="loginContent">
                <div class="Content">
                    <h1>{{formTitle}}</h1>
                    <form class='Content' @submit.prevent="onSubmit">
                        <fieldset v-if="registerActive">
                            <label for="firstName">First name</label>
                            <input v-model="credentials.firstName" type="text" id="firstName" placeholder="First name" />
                        </fieldset>
                        <fieldset v-if="registerActive">
                            <label for="lastName">Last name</label>
                            <input v-model="credentials.lastName" type="text" id="lastName" placeholder="Last name" />
                        </fieldset>
                        <fieldset>
                            <label for="email">Email</label>
                            <input v-model="credentials.email" type="text" id="email" placeholder="Email" />
                        </fieldset>
                        <fieldset>
                            <label for="password">Password</label>
                            <input v-model="credentials.password" type="password" id="password" placeholder="Password" />
                        </fieldset>
                        <button class="loginPageBtn" type="submit">{{formTitle}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref ,onMounted} from 'vue';
import { useUserIdentification } from '@/Pinia/Store';

const userIdentification = useUserIdentification();
let loginActive = ref(true);
let registerActive = ref(false);
const credentials = reactive({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
});

onMounted(() => {
  useUserIdentification().initialize()
})

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

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f2f5;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    padding: 20px;
    box-sizing: border-box;
}

.options {
    display: flex;
    margin-left: auto;
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    margin-bottom: 30px;
}

.RegisterPageUl {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0;
    margin: 0;
}

li, .logOutBtn {
    padding: 10px 20px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
    border-radius: 5px;
    flex: 1;
    margin: 0 5px;
}

li:hover, .logOutBtn:hover {
    transform: scale(1.05);
}

li.isActive {
    background-color: #007bff;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

li.isActive:hover {
    background-color: #0056b3;
}

.logOutBtn {
    background-color: #ff0000;
    border: none;
    color: white;
    transition: background-color 0.3s;
}

.logOutBtn:hover {
    background-color: #cc0000;
}

.loginContainer {
    display: flex;
    justify-content: center;
    width: 100%;
}

.loginContent {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    text-align: center; /* Centering content horizontally */
}

.Content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    text-align: center;
}

h1 {
    font-size: 2em;
    color: #333;
}

.loginPageBtn {
    background-color: #ff0000;
    border: none;
    padding: 10px;
    cursor: pointer;
    color: white;
    border-radius: 50px;
    width: 100%;
    font-size: 1em;
    transition: background-color 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.loginPageBtn:hover {
    background-color: #cc0000;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.loginPageBtn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background-color: rgba(255, 255, 255, 0.15);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: width 0.3s, height 0.3s;
    border-radius: 50%;
    z-index: -1;
}

.loginPageBtn:hover::before {
    width: 0;
    height: 0;
}

fieldset {
    display: flex;
    flex-direction: column;
    border: none;
    width: 100%;
    margin: 0;
    padding: 0;
}

label {
    font-size: 1em;
    margin-bottom: 5px;
    color: #555;
    text-align: left;
    width: 100%;
}

input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s;
}

input:focus {
    border-color: #007bff;
    outline: none;
}

input::placeholder {
    color: #bbb;
}

form.Content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>

