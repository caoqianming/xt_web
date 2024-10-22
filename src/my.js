import myUserSelect from './components/mySelect/userselect'
import mySelect from './components/mySelect/select'
import myTableSelect from './components/mySelect/tableSelect'
export default {
	install(app) {
		app.component('myUserSelect', myUserSelect);
		app.component('mySelect', mySelect);
		app.component('myTableSelect', myTableSelect);
	}
}
