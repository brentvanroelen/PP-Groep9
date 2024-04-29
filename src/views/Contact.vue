<template>
  <div class="contacts">
    <ul class="contactlist">
        <h1>Hier komen alle contacten</h1>
        <br>
        <li v-for="contact in contacts" :key="contact.id">
            {{ contact.name }} - {{ contact.email }} - {{ contact.phone }}
        </li>
    </ul>
  </div>
</template>

<script>
export default {
    data() {
      return {
          contacts: [
            {name: "medialab", email: "medialab@ehb.be", phone:"02 523 37 37", id: 1}
          ]
      }
    }
}

</script>

<style>

</style>