<template>
<NavigationAdmin></NavigationAdmin>

        <h1 class="title">User blacklist</h1>
        <div class="actions">
            <label for="cijfer">Show</label>
<select id="cijfer" name="cijfer">
    <option value="10">10</option>
    <option value="9">9</option>
    <option value="8">8</option>
    <option value="7">7</option>
    <option value="6">6</option>
    <option value="5">5</option>
    <option value="4">4</option>
    <option value="3">3</option>
    <option value="2">2</option>
    <option value="1">1</option>
</select>
<br>
<br>    
        <form action="/search" method="GET">
            <label for="search">Search:</label>
            <input type="text" id="search" name="q">
            <button type="submit">Search</button>
        </form>
        </div>
        

        <table class="content">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Waarschuwingen</th>
                    <th>Blacklisted</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>2</td>
                    <td class="orange">no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>1</td>
                    <td class="green">no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>3</td>
                    <td class="red">yes</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>1</td>
                    <td>no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>3</td>
                    <td>yes</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>1</td>
                    <td>no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>1</td>
                    <td>no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>2</td>
                    <td>no</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>3</td>
                    <td>yes</td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Naam</td>
                    <td>@student.ehb.be</td>
                    <td>2</td>
                    <td>no</td>
                    <td>...</td>
                </tr>
                
            </tbody>
        </table>
        <div class="pagination-container">
            <p>Showing 1 to 10 of 100 entries</p>
            <div class="pagination">
                <a href="#">&laquo;</a> <!-- Linker pijltje -->
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <span>...</span>
                <a href="#">10</a>
                <a href="#">&raquo;</a> <!-- Rechter pijltje -->
            </div>
        </div>



</template>
<script>
</script>

<style>
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px; 
}

.title {
    text-align: center;
}

.actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
}

.actions label {
    margin-right: 10px;
}

.actions form {
    margin-left: auto;
}
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 5px; 
    border: 1px solid #000;
}

.pagination {
    display: flex;
    gap: 5px; 
}

.pagination-container {
    display: flex;
    align-items: center;
    gap: 10px; 
    margin-left: auto;
}



th {
    background-color: #f2f2f2; 
}

th,
td {
    padding: 10px; 
    border: 1px solid #f2f2f2; 

}

.red {
    background-color: #ffcccc; 
    color: red;
}

.green {
    background-color: #ccffcc; 
    color: green;
}

.orange{
    background-color: #ffd699;
    color: orange;
}


.content {
    width: 100%; 
    border-collapse: collapse; 
}

.content th,
.content td {
    padding: 10px; 
    vertical-align: top; 
    text-align: center;
}

</style>