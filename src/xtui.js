import ehsUserSelect from './components/ehsSelect/userselect'
import ehsEpSelect from './components/ehsSelect/epselect'
import ehsSelect from './components/ehsSelect/select'
import ehsTableSelect from './components/ehsSelect/tableSelect'
import xtSelect from './components/xtSelect/index.vue'
export default {
	install(app) {
		app.component('ehsUserSelect', ehsUserSelect);
		app.component('ehsEpSelect', ehsEpSelect);
		app.component('ehsSelect', ehsSelect);
		app.component('ehsTableSelect', ehsTableSelect);
		app.component('xtSelect', xtSelect);
	}
}
