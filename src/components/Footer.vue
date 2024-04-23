<template>
    <ul class="Footer">
        <li id="Logo"><img src="../assets/erasmuslogo.jpg" alt=""></li>
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
</template>

<script>
export default {
    name: 'Footer',
    components: {

    }
}
</script>

<style scoped>
    #Logo img{
        max-width: 75px;
        height: 75px;
        display: flex;
        justify-content: center;
    }
    .Footer{
        display: flex;
        flex-direction: row;
        align-items: center;
        width:100%;
        height:75px;
        background:crimson ;
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