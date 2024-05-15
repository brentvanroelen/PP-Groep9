<template>


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
                    <td>John Doe</td>
                    <td>john.doe@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td class="orange"><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Jane Smith</td>
                    <td>jane.smith@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td class="green"><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Michael Johnson</td>
                    <td>michael.johnson@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td class="red"><div class="border">yes</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Emily Brown</td>
                    <td>emily.brown@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>David Lee</td>
                    <td>david.lee@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">yes</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Sarah Taylor</td>
                    <td>sarah.taylor@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>James Wilson</td>
                    <td>james.wilson@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Olivia Martinez</td>
                    <td>olivia.martinez@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>William Garcia</td>
                    <td>william.garcia@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">no</div></td>
                    <td>...</td>
                </tr>
                <tr>
                    <td><input type="checkbox"></td>
                    <td>Emma Rodriguez</td>
                    <td>emma.rodriguez@example.com</td>
                    <td>
                        <button class="increase-warning-btn">+</button>
                        <span class="warning-count">3</span>
                        <button class="decrease-warning-btn">-</button>
                    </td>
                    <td><div class="border">yes</div></td>
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

<script setup>
document.addEventListener("DOMContentLoaded", function() {
    function updateBlacklistedStatus(row) {
        let warnings = parseInt(row.querySelector(".warning-count").textContent);
        let blacklistedCell = row.querySelector("td:nth-child(5)");

        if (warnings === 1) {
            blacklistedCell.innerHTML = '<div class="border">no</div>';
            blacklistedCell.classList.remove("orange", "red");
            blacklistedCell.classList.add("green");
        } else if (warnings === 2) {
            blacklistedCell.innerHTML = '<div class="border">no</div>';
            blacklistedCell.classList.remove("green", "red");
            blacklistedCell.classList.add("orange");
        } else if (warnings >= 3) {
            blacklistedCell.innerHTML = '<div class="border">yes</div>';
            blacklistedCell.classList.remove("green", "orange");
            blacklistedCell.classList.add("red");
        } else {
            blacklistedCell.innerHTML = '<div class="border">no</div>';
            blacklistedCell.classList.remove("orange", "red");
            blacklistedCell.classList.add("green");
        }
    }

    function applyColorsToAllRows() {
        let rows = document.querySelectorAll(".content tbody tr");
        rows.forEach(function(row) {
            updateBlacklistedStatus(row);
        });
    }

    applyColorsToAllRows();

    let select = document.getElementById("cijfer");
    select.addEventListener("change", function() {
        let aantal = parseInt(select.value);
        let rows = document.querySelectorAll(".content tbody tr");

        rows.forEach(function(row, index) {
            if (index < aantal) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        });

        applyColorsToAllRows();
    });

    let increaseButtons = document.querySelectorAll(".increase-warning-btn");
    increaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            let warningCountElement = button.parentElement.querySelector(".warning-count");
            let currentCount = parseInt(warningCountElement.textContent);
            if (currentCount < 3) {
                warningCountElement.textContent = currentCount + 1;
                updateBlacklistedStatus(button.parentElement.parentElement);
            }
        });
    });

    let decreaseButtons = document.querySelectorAll(".decrease-warning-btn");
    decreaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            let warningCountElement = button.parentElement.querySelector(".warning-count");
            let currentCount = parseInt(warningCountElement.textContent);
            if (currentCount > 0) {
                warningCountElement.textContent = currentCount - 1;
                updateBlacklistedStatus(button.parentElement.parentElement);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var searchInput = document.getElementById("search");

    searchInput.addEventListener("input", function() {
        var searchText = searchInput.value.toLowerCase(); 
        var rows = document.querySelectorAll(".content tbody tr");

        rows.forEach(function(row) {
            var nameCell = row.querySelector("td:nth-child(2)"); 

            if (nameCell.textContent.toLowerCase().includes(searchText)) {
                row.style.display = ""; 
            } else {
                row.style.display = "none"; 
            }
        });
    });
});
</script>

<style scoped>

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


.border {
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    padding: 5px;
    width: 50px;
    padding-top: 10px; 
    padding-bottom: 10px; 

}
.red div {
    background-color: #ffcccc;  
    color: red;
}

.green div {
    background-color: #ccffcc; 
    color: green;
}

.orange div{
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