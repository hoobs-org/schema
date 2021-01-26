<!-------------------------------------------------------------------------------------------------
 | hoobs-gui                                                                                      |
 | Copyright (C) 2020 HOOBS                                                                       |
 |                                                                                                |
 | This program is free software: you can redistribute it and/or modify                           |
 | it under the terms of the GNU General Public License as published by                           |
 | the Free Software Foundation, either version 3 of the License, or                              |
 | (at your option) any later version.                                                            |
 |                                                                                                |
 | This program is distributed in the hope that it will be useful,                                |
 | but WITHOUT ANY WARRANTY; without even the implied warranty of                                 |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                  |
 | GNU General Public License for more details.                                                   |
 |                                                                                                |
 | You should have received a copy of the GNU General Public License                              |
 | along with this program.  If not, see <http://www.gnu.org/licenses/>.                          |
 -------------------------------------------------------------------------------------------------->

<template>
    <fieldset id="field">
        <div class="position">
            <legend v-if="expandable || (label && label !== '')" class="legend" v-on:click="toggle">
                <span v-html="label"></span>
                <div v-if="expandable && !expanded" class="icon">keyboard_arrow_down</div>
                <div v-if="expandable && expanded" class="icon">keyboard_arrow_up</div>
            </legend>
        </div>
        <div v-if="schema.description && schema.description !== ''" class="description" v-html="schema.description"></div>
        <div v-if="!expandable || expanded" class="panel">
            <schema v-for="(child, key) in schema.properties" :instance="instance" :identifier="identifier" :field="key" :schema="child" :value="internalValue[key]" :key="key" @input="updateValue($event, key)" />
        </div>
    </fieldset>
</template>

<script>
    import { decamel } from "../../services/schema";

    export default {
        name: "form-field",

        components: {
            "schema": () => import("@/components/elements/schema.vue"),
        },

        props: {
            field: String,
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            instance: String,
            identifier: String,
        },

        data() {
            return {
                label: "",
                expandable: false,
                expanded: true,
                internalValue: (this.value !== undefined) ? this.value : {},
            };
        },

        watch: {
            value(value) {
                this.internalValue = value;
            },
        },

        mounted() {
            this.label = this.title || decamel(this.field);
            this.expandable = this.schema.expandable;
            this.expanded = this.schema.expanded;
        },

        methods: {
            updateValue(value, child) {
                this.internalValue[child] = value;
                this.$emit("input", this.internalValue);
            },

            toggle() {
                if (this.expandable) {
                    this.expanded = !this.expanded;
                } else {
                    this.expanded = true;
                }
            },
        },
    };
</script>

<style scoped>
    #field {
        flex: 1;
        padding: 0;
        border: none;
    }

    #field .position {
        margin: 0 8px 7px 0;
        user-select: none;
        cursor: default;
    }

    #field .legend {
        width: 100%;
        padding: 0 0 7px 0;
        color: #feb400;
        font-size: 14px;
        border-bottom: 1px #dfdfdf solid;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #field .legend span {
        flex: 1;
    }

    #field .legend .icon {
        color: #727272;
        opacity: 0.7;
        cursor: pointer;
    }

    #field .legend:hover .icon {
        opacity: 1;
    }

    #field .description {
        font-size: 12px;
        margin: 0 0 10px 0;
        user-select: none;
    }

    #field .description:empty {
        display: none;
    }

    #field .panel {
        padding: 14px 0 0 0;
    }
</style>
