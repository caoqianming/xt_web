<template>
	<div>
		<el-input ref="inputRef" v-model="selectLabel" :readonly="true" :placeholder="placeholder">
			<template #prefix v-if="edit">
				<el-button
					text
					size="small"
					circle
					icon="el-icon-search"
					@click="showPopover = true"
				></el-button>
			</template>
			<template #suffix v-if="edit">
				<el-button
					text
					size="small"
					circle
					icon="el-icon-close"
					v-show="selectLabel && edit"
					@click="handleClear"
				></el-button>
			</template>
		</el-input>
		<el-popover
			v-model:visible="showPopover"
			trigger="manual"
			virtual-triggering
			:virtual-ref="inputRef"
			:width="tableWidth"
		>
			<el-input
				v-if="!isFixOptions"
				v-model="keyword"
				placeholder="关键词查找"
				@keyup.enter="handleQuery"
			></el-input>
			<div style="height: 2px"></div>
			<scTable
				v-if="showPopover"
				ref="table"
				:apiObj="apiObj"
				:data="tableData"
				:params="params"
				:query="query"
				:height="tableHeight"
				row-key="id"
				stripe
				@row-click="rowClick"
				:hidePagination="hidePagination"
				paginationLayout="prev, pager, next"
				hideDo
				@dataChange="tdChange"
				@selection-change="selectionChange"
			>
				<el-table-column
					v-if="multiple"
					type="selection"
					width="40"
					:reserve-selection="true"
				></el-table-column>
				<slot v-if="!isFixOptions"></slot>
				<template v-else>
					<el-table-column :prop="props.labelField"></el-table-column>
				</template>
			</scTable>
		</el-popover>
	</div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";

const props = defineProps({
	multiple: { type: Boolean, default: false },
	placeholder: { type: String, default: "请选择" },
	edit: { type: Boolean, default: true },
	hidePagination: { type: Boolean, default: false },
	tableWidth: { type: Number, default: 600 },
	tableHeight: { type: Number, default: 300 },
	apiObj: { type: Object, default: null },
	params: { type: Object, default: () => {} },
	label: { type: [String, Number, Array], default: "" },
	obj: { type: Object, default: () => {} },
	modelValue: { type: [String, Number, Array], default: null },
	labelField: { type: String, default: "name" },
	valueField: { type: String, default: "id" },
	splitField: { type: String, default: ";" },
	options: { type: Array, default: null },
});

const emit = defineEmits(["update:modelValue", "update:obj", "update:label"]);

// 控制 popover 显示与隐藏的状态
const showPopover = ref(false);
const inputRef = ref();
const table = ref();
const hidePagination = ref(props.hidePagination);

onMounted(() => {
	if (props.options != null) {
		isFixOptions.value = true;
		tableData.value = props.options;
		hidePagination.value = true;
	}

	if (props.label) {
		selectLabel.value = props.label;
	} else {
		if (props.multiple) {
			if (isFixOptions.value) {
				selectLabel.value = props.options
					.filter((item) =>
						props.modelValue.includes(item[props.valueField])
					)
					.map((item) => item[props.labelField])
					.join(props.splitField);
			} else if (props.obj && props.obj.length > 0) {
				selectLabel.value = props.obj
					.map((item) => item[props.labelField])
					.join(props.splitField);
			}
		} else {
			if (isFixOptions.value) {
				const selectedOption = props.options.find(
					(item) => item[props.valueField] === props.modelValue
				);
				selectLabel.value = selectedOption
					? selectedOption[props.labelField]
					: "";
			} else if (props.obj) {
				selectLabel.value = props.obj[props.labelField];
			}
		}
	}
});

const isFixOptions = ref(false);
const tableData = ref(null);

const selectObj = computed({
	get() {
		return props.obj;
	},
	set(val) {
		emit("update:obj", val);
	},
});

const selectValue = computed({
	get() {
		return props.modelValue;
	},
	set(val) {
		emit("update:modelValue", val);
	},
});

const selectLabel = ref("");

const keyword = ref("");
const query = ref({ search: "" });

const handleQuery = () => {
	query.value.search = keyword.value;
	table.value.queryData(query.value);
};

const rowClick = (row) => {
	if (!props.multiple) {
		selectObj.value = row;
		selectLabel.value = row[props.labelField];
		selectValue.value = row[props.valueField];
		showPopover.value = false;
	}
	emit("change");
};

const handleClear = () => {
	if (props.multiple) {
		(selectObj.value = []), (selectLabel.value = "");
		selectValue.value = [];
	} else {
		selectObj.value = {};
		selectLabel.value = "";
		selectValue.value = null;
	}
	emit("update:label", "");
	emit("change");
};

const tdChange = (res, tableData) => {
	// if(obj.value && multiple){
	// }
};

const selectionChange = (val) => {
	if (props.multiple) {
		selectObj.value = val;
		selectValue.value = val.map((item) => item[props.valueField]);

		selectLabel.value = val
			.map((item) => item[props.labelField])
			.join(props.splitField);
	}
	emit("update:label", val);
	emit("change");
};
</script>
