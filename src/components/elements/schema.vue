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
    import { field } from "../../services/schema";

    export default {
        name: "schema",

        props: {
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