<template>
    <el-container>
        <el-main class="nopadding">

        </el-main>
        <el-aside width="30%">
            <ticketd :ticketId="props.ticketId"></ticketd>
        </el-aside>
    </el-container>
</template>
<script setup>
import { ref, defineProps, onMounted} from "vue";
import ticketd from './ticketd.vue'
import API from '@/api'
const props = defineProps({
    ticketId: { type: String, required: false, default: null }
});
onMounted(() => {
    
})
</script>