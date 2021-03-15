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
            :field="field"
            :schema="schema"
            :value="value"
            :checked="value"
            :options="options"
            v-on:input="$emit('input', $event)"
        />
    </div>
</template>

<script>
    import { field } from "../../services/schema";

    export default {
        name: "schema",

        props: {
            field: [String, Number],
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            instance: String,
            identifier: String,
        },

        computed: {
            type() {
                return field(this.schema);
            },

            options() {
                if (this.schema.enum !== undefined && Array.isArray(this.schema.enum)) {
                    return this.schema.enum.map((item) => ({ value: item, text: item }));
                }

                if (this.schema.oneOf !== undefined && Array.isArray(this.schema.oneOf)) {
                    return this.schema.oneOf.map((item) => ({ value: item.enum[0], text: item.title }));
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