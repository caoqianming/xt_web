<template>
    <el-button
            v-for="item in transitions"
            :key="item.id"
            type="primary"
            :loading="isSaveing"
            :disabled="isSaveing"
            @click="submit(item.id)"
            style="margin-right: 2px"
        >{{ item.name }}</el-button>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import API from '@/api';


const props = defineProps({
    workflow_key: {type: String, default: null, required: false},
    ticketId: {type: String, default: null, required: false},
    t_id: {type: String, default: null, required: true},
    title: {type: String, default: null, required: false},
    submit_b_func: {type: Function, default: null, required: false},
    ticket_data: {type: Object, default: null, required: false},
})

const workflow = ref(null);
const transitions = ref([]);
onMounted(async () => {
    if (props.ticketId) {
        API.wf.ticket.ticketTransitions.req(props.ticketId).then(res => {
            transitions.value = res;
        });
    }else if (props.workflow_key) {
        let res = await API.wf.workflow.initkey.req(props.workflow_key);
        transitions.value = res.transitions;
        workflow.value = res.workflow
    }else{
        ElMessage.error("缺少workflow_key或ticketId");
    }
    
})

const isSaveing = ref(false);

const emit = defineEmits(["success"]);
const submit = async (transition_id) => {
    isSaveing.value = true;
        if (props.submit_b_func) {
            await props.submit_b_func();
        }
    if (props.ticketId != null) {
        let params = new Object();
        params.transition = transition_id;
        if (props.ticket_data) {
            params.ticket_data = props.ticket_data;
        }else{
            params.ticket_data = {};
        }
        try{
            let res = await API.wf.ticket.ticketHandle.req(props.ticketId, params);
            isSaveing.value = false;
            ElMessage.success("提交成功");
            emit("success", props.ticketId)
        } catch (e) {
            isSaveing.value = false;
            return;
        }
    } else {
        let ticket = {};
        ticket.title = props.title;
        ticket.workflow = workflow.value;
        if (props.t_id != null && props.t_id != undefined) {
            ticket.ticket_data = {
                t_id: props.t_id,
            };
        } else {
            ElMessage.error("缺少t_id");
            isSaveing.value = false;
            return;
        }
        
        ticket.transition = transition_id;
        try {
            let res = await API.wf.ticket.create.req(ticket);
            isSaveing.value = false;
            ElMessage.success("提交成功");
            emit("success", res.id)
        } catch (e) {
            isSaveing.value = false;
            return;
        }
    }
}
</script>