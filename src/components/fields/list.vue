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
    <div id="field">
        <div class="position">
            <legend v-if="label && label !== ''" :class="schema.description && schema.description !== '' ? 'legend collapsed' : 'legend'" v-html="label"></legend>
        </div>
        <div v-if="schema.description && schema.description !== ''" class="description" v-html="schema.description"></div>
        <div v-for="(item, index) in items" class="item" :key="index">
            <div class="field">
                <schema :instance="instance" :identifier="identifier" :title="schema.title" :description="schema.description" :placeholder="schema.example" :schema="schema.items" :value="item" v-on:input="updateValue($event, index)" />
            </div>
            <div class="action">
                <div class="icon" v-if="items.length > 0" v-on:click="removeItem(index)" :key="`remove-${index}`">delete</div>
            </div>
        </div>
        <div class="icon add" v-if="!schema.maxItems || items.length < schema.maxItems" v-on:click="addItem()">add_circle</div>
    </div>
</template>

<script>
    import { scaffold, decamel } from "../../services/schema";

    export default {
        name: "list-field",

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
                items: (this.value !== undefined) ? this.value : [],
                label: "",
            };
        },

        mounted() {
            this.label = this.title || decamel(this.field);
        },

        methods: {
            addItem() {
                this.items.push(scaffold(this.schema)[0]);
            },

            removeItem(index) {
                this.items.splice(index, 1);

                this.$emit("input", this.items);
                this.$emit("change", this.items);
            },

            updateValue(value, index) {
                this.items.splice(index, 1, value);

                this.$emit("input", this.items);
                this.$emit("change", this.items);
            },
        },
    };
</script>

<style scoped>
    #field {
        flex: 1;
        padding: 0 10px 0 0;
    }

    #field .position {
        margin: 0 0 7px 0;
        user-select: none;
        cursor: default;
    }

    #field .legend {
        color: #feb400;
        padding: 0 0 7px 0;
        font-size: 14px;
        border-bottom: 1px #dfdfdf solid;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #field .description {
        font-size: 12px;
        margin: 0;
        user-select: none;
    }

    #field .description:empty {
        display: none;
    }

    #field .add {
        cursor: pointer;
        margin: 10px 0 0 0;
        opacity: 0.7;
    }

    #field .add:hover {
        opacity: 1;
    }

    #field .item {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        padding: 0 10px 10px 10px;
        margin: 10px 0 0 0;
        border: 1px #dfdfdf solid;
    }

    #field .item .field {
        flex: 1;
    }

    #field .item .action {
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 0 0 0;
        cursor: pointer;
        opacity: 0.7;
    }

    #field .item .action:hover {
        opacity: 1;
    }
</style>
