<template>
    <div id="directive" :class="type === 'checkbox' || type === 'radio' ? 'collapsed' : 'normal'">
        <component
            :is="type"
            :title="schema.title"
            :description="schema.description"
            :placeholder="schema.placeholder || schema.example"
            :min="schema.minimum"
            :max="schema.maximum"
            :instance="instance"
            :identifier="identifier"
            :schema="schema"
            :value="value"
            :checked="value"
            :options="options"
            v-on:input="$emit('input', $event)"
        />
    </div>
</template>

<script>
    import RootField from "@/components/fields/root.vue"
    import FormField from "@/components/fields/form.vue"
    import ListField from "@/components/fields/list.vue"
    import OneOfField from "@/components/fields/oneof.vue"
    import AnyOfField from "@/components/fields/anyof.vue"
    import ButtonField from "@/components/fields/button.vue";

    export default {
        name: "schema",

        components: {
            "root-field": RootField,
            "form-field": FormField,
            "list-field": ListField,
            "oneof-field": OneOfField,
            "anyof-field": AnyOfField,
            "button-field": ButtonField,
        },

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            instance: String,
            identifier: String,
        },

        computed: {
            type() {
                if (this.schema.widget === "button") return "button-field";
                if (this.schema.widget === "textarea") return "textarea-field";

                if (this.schema.oneOf !== undefined && Array.isArray(this.schema.oneOf)) return "oneof-field";
                if (this.schema.enum !== undefined && Array.isArray(this.schema.enum)) return "select-field";

                if (this.schema.type === "boolean") return "checkbox";
                if (this.schema.type === "array" && this.schema.format === "root") return "root-field";
                if (this.schema.type === "array") return this.schema.items.anyOf === undefined || !Array.isArray(this.schema.items.anyOf) ? "list-field" : "anyof-field";
                if (this.schema.type === "object") return "form-field";
                if (this.schema.type === "integer") return "integer-field";
                if (this.schema.type === "number") return "number-field";

                if (this.schema.format === "date") return "date-field";
                if (this.schema.format === "password") return "password-field";

                return "text-field";
            },

            options() {
                if (this.schema.enum !== undefined && Array.isArray(this.schema.enum)) {
                    return this.schema.enum.map((item) => ({ value: item, text: item }));
                }

                return [];
            },
        },
    };
</script>

<style scoped>
    #directive {
        margin: 20px 0 0 0;
    }

    #directive:first-child {
        margin: 0;
    }

    #directive.collapsed {
        margin: 0;
    }
</style>