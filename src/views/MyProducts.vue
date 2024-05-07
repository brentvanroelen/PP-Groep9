<template>
   

  <div class="product1">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
        <div class="kolom1">
        <button>
            <router-link class="link" to="/ExtensionPage">Request extension</router-link>
        </button>  
    </div>
        <button>Report issue</button>
        <div class="kolom4">
            <p>Start date: 12/05/2024</p>   
            <p>Deadline: 18/05/2024</p>
        </div>    
    </div>

    <div class="product2">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
        <div class="kolom1">
            <button>
                Request extension
            </button>  
        </div>      
        <button>Report issue</button>
        <div class="kolom4">
            <p>Start date: 12/05/2024</p>
            <p>Deadline: 18/05/2024</p>
        </div>    
    </div>

    <div class="product3">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
        <div class="kolom1">
            <button>
                Request extension
            </button>  
        </div>
        <button>Report issue</button>
        <div class="kolom4">
            <p>Start date: 12/05/2024</p>
            <p>Deadline: 18/05/2024</p>
        </div>    
    </div>

    <div class="product4">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
            <button  class="available">
                Request extension
            </button>  
        <button>Report issue</button>
        <div class="kolom4">
            <p>Start date: 12/05/2024</p>
            <p>Deadline: 18/05/2024</p>
        </div>    
    </div>

    <div class="product5">
        <div class="kolom1">
            <p></p>
            <p>Categorie: Audio</p>
        </div>
        <button>
            Cancel reservation
        </button>
        <div class="kolom4">
            <p>Reservation State</p>
        </div>    
    </div>
    
</template>
<script setup>
import SearchBar from "../components/Searchbar.vue"


let producten = ["Wireless GO II", "DMS USB PRO", "Google Glass", "TF-300A Flitser", "BR-2240"]

function namen(){
    for(let i = 0; i< producten.length; i++){
        let productDiv = document.querySelector(".product" + (i + 1));
        let naamParagraaf = productDiv.querySelector(".kolom1 p:first-child");
        naamParagraaf.textContent = producten[i];
    }
}
window.onload = namen;

</script>

<style scoped>
    div{
        display: flex;
        margin: 20px;
        background-color: #c1c1c1;
        padding: 20px;
    }

    p{
        margin: auto;
    }

    .kolom1{
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    .kolom4{
        margin: auto;
        display: flex;
        flex-direction: column;
    }
    button{
        margin: auto;
        border-radius: 50px;
        padding: 15px 10px 15px 10px;
        background-color: red;
        color: white;
        border: 0cap;
    }
    .available{
        background-color: lightgreen;
    }
</style>