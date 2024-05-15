<template>
    <div class="footercontainer">
        <ul class="Footer">
            <li id="Logo"><img src="../assets/EhB-logo-transparant.png" alt=""></li>
        <div id="Info">
            <div id="Contacts">
            <li>Contacts:</li>
            <li>Phone: 02 523 37 37</li>
            <li>Email:info@ehb.be</li>
            </div>
            <div id="Adres">
            <li>Adres:</li>
            <li>Nijverheidkaai 170, 1070 Anderlecht</li>
            </div>
        </div>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    components: {

    }
}
</script>

<style scoped>
    .footercontainer{
        position: relative;
        bottom: 0;
        width: 100%;	
    }
    #Logo img{
        width: 80px;
        height: auto;
        display: flex;
        justify-content: center;
        margin-left: 0.5em;
    }
    .Footer{
        display: flex;
        flex-direction: row;
        align-items: center;
        width:100%;
        height:75px;
        background:#D9D9D9 ;
        list-style: none;
        justify-content: space-between;
    }
    #Info{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width: 80%;
    }
</style>
