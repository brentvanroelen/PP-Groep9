<template>


    
        <div class="ItemsToPrepare">
            <h2>Items to prepare:</h2>
            <div class="studentInfo"><!--Dit komt per student 1x voor-->
                <label for="Student">Student: </label> <!--Data uit database-->
                <label for="PickUpDate">Pick-up date: </label><!--Data uit database--> <input type="time" name="" id="">  <button>X</button> 
            
            <div class="items"> <!--Dit kan voor meerdere keren tergkomen per student, indien meerdere orders-->
                <label for="Item">Name: </label><br> <!--Data uit database (vb camera)-->
                <label for="Serie">Serie: </label> <br><!--Data uit database(serienmr)-->
                <label for="Location">Location: </label><br><!--Data uit database(schap...)-->
                <label for="Satus">Status: </label><br><!--Data uit database(als het nog is uitgeleend ofzo)--> <button>Ready</button> <button>X</button>
            </div></div>



        </div>
   




   
</template>

<script>
</script>


<style>



</style>