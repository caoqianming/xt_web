<template>
    <el-collapse v-model="activeNames" style="padding-left: 2px; padding-right: 2px;">
        <el-collapse-item title="基本信息" name="1">
            <el-descriptions :column="1">
                <el-descriptions-item>
                    <span style="color:darkblue;margin-right: 4px;">({{ ticketDetail.sn }})</span>{{ ticketDetail.title
                    }}
                </el-descriptions-item>
                <el-descriptions-item label="当前:">
                    <el-tag type="info" effect="plain">{{ ticketDetail.state_.name }}</el-tag>
                    <el-tag :type="actStateEnum[ticketDetail.act_state]?.type" effect="plain">
                        {{ actStateEnum[ticketDetail.act_state]?.text }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="可处理人:"
                    v-if="ticketDetail.participant_type == 2 || ticketDetail.participant_type == 1">
                    <span v-for="item in ticketDetail.participant_" :key="item.id">{{ item.name }}/</span>
                </el-descriptions-item>
            </el-descriptions>
        </el-collapse-item>
        <el-collapse-item title="操作" name="2" v-if="actionShow">
            <el-input type="textarea" :rows="2" v-model="handleForm.suggestion" placeholder="处理意见" />
            <el-row>
                <el-col :xs="24" :md="12" style="padding: 1px">
                    <el-button :loading="submitLoading" :disabled="submitLoading" v-for="item in transitions"
                        :key="item.id" size="small" :type="item.attribute_type === 2 ? 'danger' : 'primary'
                            " @click="handleTransition(item.id)">
                        {{ item.name }}
                    </el-button>
                </el-col>
                <el-col :xs="24" :md="12" style="text-align: right;padding: 1px">
                    <el-button v-if="ticketDetail.state_.enable_retreat && isOwn" type="danger" size="small"
                        @click="handleRetreat">撤回</el-button>
                </el-col>
            </el-row>
        </el-collapse-item>
        <el-collapse-item title="审批历史" name="3">
            <div style="padding:1px"><el-timeline>
                    <el-timeline-item v-for="item in ticketLog" :key="item.id" :timestamp="item.create_time"
                        :color="getColor(item)">
                        <div>
                            <strong>{{ item.state_?.name || "未知状态" }}</strong>
                        </div>
                        <div>
                            <span v-if="item.intervene_type != 0"><el-tag
                                    :type="interveneTypeEnum[item.intervene_type]?.type" effect="plain">
                                    {{ interveneTypeEnum[item.intervene_type]?.text }}
                                </el-tag></span>
                            <span v-if="item.transition_"
                                :style="{ color: item.transition_.attribute_type === 1 ? '#67C23A' : '#F56C6C' }">
                                {{ item.transition_.name }}
                            </span>
                            <span v-if="item.participant_">-{{ item.participant_.name }}</span>
                        </div>
                        <div v-if="item.suggestion">
                            <el-tooltip v-if="item.suggestion.length > 20" class="box-item" effect="dark"
                                :content="item.suggestion" placement="top">
                                <span>{{ item.suggestion.slice(0, 20) + "..." }}</span>
                            </el-tooltip>
                            <span v-else>
                                {{ item.suggestion }}
                            </span>
                        </div>
                    </el-timeline-item>
                </el-timeline></div>

        </el-collapse-item>
    </el-collapse>
</template>
<script setup>
import { ref, defineProps, onMounted } from "vue";
import { actStateEnum, interveneTypeEnum } from "@/utils/enum.js";
import API from '@/api';
import TOOL from "@/utils/tool.js";
import { ElMessageBox } from 'element-plus'
const props = defineProps({
    ticketId: { type: String, required: true, default: null },
    ticket_data: { type: Object, default: null },
});
const currentUser = ref(TOOL.data.get("USER_INFO").id)
const actionShow = ref(false);
const isOwn = ref(false);
const activeNames = ref(['1', '3']);
const ticketDetail = ref({
    state_: {}
});
const ticketLog = ref([]);
const handleForm = ref({
    suggestion: ""
})
onMounted(() => {
    console.log(props)
    if (props.ticketId) {
        getTicketDetail();
        getTicketLog();
    }
});
const emit = defineEmits(['success']);
const refreshTicket = async () => {
    actionShow.value = false
    isOwn.value = false
    transitions.value = []
    handleForm.value.suggestion = ''
    ticketLog.value = []
    activeNames.value = ['1', '3'] // 根据需要恢复初始展开项
    getTicketDetail()
    getTicketLog()
    emit('success')
}

const getTicketDetail = () => {
    API.wf.ticket.ticketItem.req(props.ticketId).then(res => {
        ticketDetail.value = res;
        if (res.create_by === currentUser.value) {
            isOwn.value = true;
            actionShow.value = true;
            if (!activeNames.value.includes('2')) activeNames.value.push('2')
        }
        if (res.participant_type == 1 && res.participant === currentUser.value) {
            actionShow.value = true;
            if (!activeNames.value.includes('2')) activeNames.value.push('2')
            getTransitions();
        }
        if (res.participant_type == 2 && res.participant.includes(currentUser.value)) {
            actionShow.value = true;
            if (!activeNames.value.includes('2')) activeNames.value.push('2')
            getTransitions();
        }
    });
};

const getTransitions = () => {
    API.wf.ticket.ticketTransitions.req(props.ticketId).then(res => {
        transitions.value = res;
    });
}

const getTicketLog = () => {
    API.wf.ticket.ticketFlowlogs.req(props.ticketId).then(res => {
        ticketLog.value = res;
    })
}

function getColor(item) {
    if (item.transition_?.attribute_type === 1) return "#67C23A"; // 同意 绿色
    if (item.transition_?.attribute_type === 2) return "#F56C6C"; // 拒绝 红色
    return "#909399"; // 默认灰色
}

const handleRetreat = () => {
    ElMessageBox.confirm("确认撤回吗?", "温馨提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        API.wf.ticket.ticketRetreat
            .req(props.ticketId, handleForm.value)
            .then((res) => {
                refreshTicket();
            });
    })
}

const submitLoading = ref(false);
const transitions = ref([]);
const handleTransition = (transitionId) => {
    let params = new Object();
    params.transition = transitionId;
    if (props.ticket_data) {
        params.ticket_data = props.ticket_data;
    } else {
        params.ticket_data = {};
    }
    params.suggestion = handleForm.value.suggestion;
    submitLoading.value = true;
    API.wf.ticket.ticketHandle.req(props.ticketId, params).then((res) => {
        submitLoading.value = false;
        refreshTicket();
    }).catch((e) => {
        submitLoading.value = false;
    });
}
</script>