<template>
    <div class="card">
        <div class="card-body">
            <div v-if="scheduledReturn != undefined" class="card-content">
                <div>
                    <h5 class="card-title">{{ scheduledReturn.User }}</h5>
                    <p class="card-text"> Place for timeslot</p>
                    <details>
                        <summary>See Items</summary>
                        <ul>
                            <li v-for="(item, index) in scheduledReturn.allItemNames" :key="index">
                            {{ item }}: {{ scheduledReturn.allItemSerials[index] }}
                            </li>
                        </ul>
                    </details>
                </div>
                <div class="card-actions">
                    <button @click="markAsPickedUp(scheduledReturn.StartDate)" class="btn">Returned + check</button>
                    <button @click="markAsPickedUp(scheduledReturn.StartDate)" class="btn">Returned</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

const props = defineProps({
    scheduledReturn: Object
});

const markAsPickedUp = async (date) => {
    console.log("markAsPickedUp");
};

</script>