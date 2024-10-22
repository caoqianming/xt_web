<template>
	<el-config-provider
		:locale="locale"
		:size="config.size"
		:zIndex="config.zIndex"
		:button="config.button"
	>
		<router-view></router-view>
	</el-config-provider>
</template>

<script>
import colorTool from "@/utils/color";
export default {
	name: "App",
	data() {
		return {
			config: {
				size: "default",
				zIndex: 2000,
				button: {
					autoInsertSpace: false,
				},
			},
		};
	},
	computed: {
		locale() {
			return this.$i18n.messages[this.$i18n.locale].el;
		},
	},
	created() {
		//设置主题颜色
		const app_color =
			this.$CONFIG.COLOR || this.$TOOL.data.get("APP_COLOR");
		if (app_color) {
			document.documentElement.style.setProperty(
				"--el-color-primary",
				app_color
			);
			for (let i = 1; i <= 9; i++) {
				document.documentElement.style.setProperty(
					`--el-color-primary-light-${i}`,
					colorTool.lighten(app_color, i / 10)
				);
			}
			for (let i = 1; i <= 9; i++) {
				document.documentElement.style.setProperty(
					`--el-color-primary-dark-${i}`,
					colorTool.darken(app_color, i / 10)
				);
			}
		}
	},
};
</script>

<style lang="scss">
@import "@/style/style.scss";

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.headerSearch {
	width: 120px !important;
	margin-right: 5px;
}

.printWrap {
	width: 100%;
	overflow-x: scroll;
}

.printContainer {
	width: 1075px;
}

.myTable {
	table-layout: fixed;
	border: 1px solid #cccccc;
}

.myTableHead {
	background: #008080;
	color: #ffffff;
}

.myTable th {
	height: 40px;
	font-weight: 500;
}

.myTable td {
	height: 32px;
	padding-left: 5px;
	border: 1px solid #cccccc;
}

.numCell {
	height: 35px;
	text-align: center;
}

.numCell {
	width: 100px;
}

.chartWrap {
	width: 1035px;
	margin-top: 20px;
	border: 1px solid #eeeeee;
}

.chartTitle {
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	margin-top: 20px;
}

.redColor {
	font-weight: bold;
	color: #ff0000;
}

.greenColor {
	font-weight: bold;
	color: #008000;
}

#table1.el-table,
#table1.el-table tr,
#table1.el-table .el-table__body-wrapper,
#table1.el-table .el-table__header-wrapper .el-table__row,
#table1.el-table .el-table__body-wrapper .el-table__row,
#table1.el-table td.el-table__cell,
#table1.el-table th.el-table__cell.is-leaf {
	background: rgba(0, 0, 0, 0);
}

.el-calendar-table .el-calendar-day {
	height: 43px !important;
}

.el-calendar {
	border-radius: 15px;
}

.el-calendar > .el-calendar__body {
	padding: 0 20px 20px;
}

// 排放系统

// .el-popper {
// 	border-radius: 0;
// }

// .el-popper[data-popper-placement^=bottom]>.el-popper__arrow {
// 	top: -5px;
// 	display: none !important;
// }

// .el-popper.is-light {
// 	background: linear-gradient(to right, #116a7c, #92f2ff);
// 	border-image-source: linear-gradient(to right, #92f2ff, #116a7c);
// }

.enpMenu.el-dropdown-menu {
	padding: 0.7vh 0.7vh 0.2vh;
	//background: linear-gradient(to right, #10608e, #1dabfd);
	background: linear-gradient(to right, #053949, #107b90);
}

.enpMenu > .el-dropdown-menu__item {
	margin-bottom: 0.5vh;
	//background: linear-gradient(to right, #29d, #1dabfd);
	background: linear-gradient(to right, #1b8fa4, #107b90);
}

.enpMenu > .el-dropdown-menu__item:not(.is-disabled):focus {
	//background: linear-gradient(to right, #10608e, #1dabfd);
	background: linear-gradient(to right, #053949, #107b90);
	color: #ffffff;
}

.enpMenu > .el-dropdown-menu__item {
	color: #ffffff;
}

#enpElDrawer {
	height: 91vh;
	bottom: 0;
	top: 9vh;
	background: rgb(11, 25, 38);
	border-radius: 0 10px 0 0;
	background-size: cover;
	z-index: 1000;
}

#enpElDrawer.el-overlay {
	height: 92%;
	bottom: 0;
	top: 8%;
	// background-image: url('/public/img/enp_blue/bg_enp_half.png');
}

#enpTable .el-table {
	background-color: none !important;
	background: none !important;
	--el-table-tr-bg-color: transparent !important;
	--el-table-border: none !important;
	--el-table-text-color: #ffffff !important;
}

#enpTable .el-table thead {
	color: #ffffff !important;
}

#enpTable
	.el-table--enable-row-hover
	.el-table__body
	tr:hover
	> td.el-table__cell {
	background-color: rgba(0, 50, 45, 0.5) !important;
}

#enpTable .el-table th.el-table__cell,
#enpTable .el-table tr,
#enpTable .el-scrollbar {
	background-color: none !important;
	background: none !important;
}

#enpTable .el-scrollbar {
	--el-scrollbar-bg-color: none !important;
	--el-scrollbar-hover-bg-color: none !important;
}

#enpTable .el-table .el-table__body-wrapper {
	background-color: none !important;
	background: none !important;
}

#enpTable .el-table__inner-wrapper::before {
	background-color: none !important;
	background: none !important;
}

#enpTable
	.el-table--striped
	.el-table__body
	tr.el-table__row--striped
	td.el-table__cell {
	background-color: rgba(0, 50, 45, 0.5) !important;
}

.enpelCard.el-card {
	background: none !important;
}
.bigScreenTable table th {
	font-size: 0.8vw !important;
}
.bigScreenTable table td {
	font-size: 0.7vw !important;
}

// .searchSelect>.select-trigger>.el-input>.el-input__wrapper {
// 	width: 7vw;
// 	height: 3vh;
// 	border: none !important;
// 	box-shadow: none !important;
// 	background-size: 100% 100%;
// 	background-image: url('/public/img/enp_blue/selectBg.png');
// }

// .searchInput>.el-input__wrapper {
// 	width: 7vw;
// 	height: 3vh;
// 	border: none !important;
// 	box-shadow: none !important;
// 	background-size: 100% 100%;
// 	background-image: url('/public/img/enp_blue/selectBg.png');
// }

.enpCheckbox > .el-checkbox > .el-checkbox__label {
	color: #ffffff;
}
#hourBaseTable.el-table--border th.el-table__cell {
	background: #008080;
	color: #ffffff;
}
#hourBaseTable.el-table.is-scrolling-left th.el-table-fixed-column--left {
	background: #008080;
	color: #ffffff;
}
.elProgress > .el-progress-circle {
	width: 9vh !important;
	height: 9vh !important;
}
#progressbwlq .el-progress-bar__innerText{
	width: 100%;
    position: absolute;
    top: 4px;
    left: 50%;
    color: #cccccc;
}
.el-select-dropdown__item{
	height:auto!important;
}
.el-select-dropdown__item div{
	margin-left:15px!important;
}
//排放系统
</style>
