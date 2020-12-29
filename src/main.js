import Vue from "vue";

import App from "./app.vue";

import TextField from "./components/fields/text.vue";
import SelectField from "./components/fields/select.vue";
import TextareaField from "./components/fields/textarea.vue";
import NumberField from "./components/fields/number.vue";
import IntegerField from "./components/fields/integer.vue";
import DateField from "./components/fields/date.vue";
import Checkbox from "./components/fields/checkbox.vue";
import Radio from "./components/fields/radio.vue";

Vue.component("radio", Radio);
Vue.component("checkbox", Checkbox);
Vue.component("text-field", TextField);
Vue.component("select-field", SelectField);
Vue.component("textarea-field", TextareaField);
Vue.component("number-field", NumberField);
Vue.component("date-field", DateField);
Vue.component("integer-field", IntegerField);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount("#app");
