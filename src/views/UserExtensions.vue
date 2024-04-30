<template>



        <!--Navigation  => is gemaakt binnen components enkel nog op de pagina's zetten en linken-->
        <NavigationAdmin></NavigationAdmin>

        <div class ="title1">
            <h2>User extension requests</h2>
        </div>

        <div class="UserExtension1">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

        <div class="UserExtension2">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

        <div class="UserExtension3">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

        <div class="title2">
            <h2>User Project requests requests</h2>
        </div>

        <div class="UserProject1">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
                <p>Active reservation : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension for their project</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

        <div class="UserProject2">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
                <p>Active reservation : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension for their project</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

        <div class="UserProject3">
            <!--Foto-->
            <img>
            <div class="paragraph">
                <p>Student : </p>
                <p>Extension Duration : </p>
                <p>Active reservation : </p>
            </div>
            <div class="description">
                <textarea class="description">Description about why the user wants the extension for their project</textarea>
            </div>
            <button class="greenbutton">V</button>
            <button class="redbutton">X</button>

            
        </div>

</template>

<script></script>

<style>body {
    font-family: Arial, Helvetica, sans-serif;
}

.title1 {
    text-align: center;
}

.UserExtension1 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserExtension1 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserExtension1 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserExtension1 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserExtension1 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}


.UserExtension2 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    margin-bottom: 20px;
    margin-top: 20px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserExtension2 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserExtension2 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserExtension2 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserExtension2 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}

.UserExtension3 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserExtension3 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserExtension3 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserExtension3 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserExtension3 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}

.title2 {
    text-align: center;
    margin-top: 100px
}


.UserProject1 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserProject1 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserProject1 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserProject1 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserProject1 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}

.UserProject2 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserProject2 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserProject2 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserProject2 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserProject2 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}

.UserProject3 {
    border: 2px solid blue;
    padding: 10px;
    margin-left: 250px;
    background-color: blue;
    color: white;
    width: 1300px;
    height: 100px;
    display: flex;
    
}

.UserProject3 .otherElements > * {
    margin-right: 20px;
    margin-left: 20px;
}

.UserProject3 .description {
    height: 80px;
    width: 800px;
    margin-left: 20px;
    margin-right: 100px;
}

.UserProject3 .greenbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: green;
    width: 50px;
    height: 50px;
    
}

.UserProject3 .redbutton {
    margin-left: 20px;
    align-content: center;
    border-radius: 50%;
    margin-top: 30px;
    background-color: red;
    width: 50px;
    height: 50px;
    
}






</style>