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
                <text-field
                    :value="item.key"
                    v-on:input="updateKey($event, index)"
                />
            </div>
            <div class="field">
                <component
                    :is="type"
                    :placeholder="schema.placeholder || schema.example"
                    :min="schema.minimum"
                    :max="schema.maximum"
                    :value="item.value"
                    v-on:input="updateValue($event, index)"
                />
            </div>
            <div class="action">
                <div class="icon" v-if="items.length > 0" v-on:click="removeItem(index)" :key="`remove-${index}`">delete</div>
            </div>
        </div>
        <div class="icon add" v-if="!schema.maxItems || items.length < schema.maxItems" v-on:click="addItem()">add_circle</div>
    </div>
</template>

<script>
    import { field, decamel, prune } from "../../services/schema";

    export default {
        name: "keys-field",

        components: {
            "schema": () => import("@/components/elements/schema.vue"),
        },

        props: {
            field: [String, Number],
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
            identifier: String,
        },

        computed: {
            type() {
                return field((Object.keys(this.schema.patternProperties)[0] !== undefined) ? this.schema.patternProperties[Object.keys(this.schema.patternProperties)[0]] : { type: "string" });
            },
        },

        data() {
            return {
                items: (this.value !== undefined) ? Object.keys(this.value).map((item) => ({ key: item, value: this.value[item]})) : [],
                label: "",
            };
        },

        mounted() {
            this.label = this.title || decamel(this.field);
        },

        methods: {
            addItem() {
                this.items.push({});
            },

            removeItem(index) {
                this.items.splice(index, 1);

                this.assemble();
            },

            updateKey(value, index) {
                if (!this.items.find((item) => item.key === value)) this.items[index].key = value;

                this.assemble();
            },

            updateValue(value, index) {
                this.items[index].value = value;
                this.assemble();
            },

            assemble() {
                const working = {};

                for (let i = 0; i < this.items.length; i += 1) {
                    if (this.items[i].key && this.items[i].key !== "") working[this.items[i].key] = this.items[i].value;
                }

                this.$emit("input", prune(working));
                this.$emit("change", prune(working));
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
        position: relative;
        padding: 20px 10px 20px 20px;
        margin: 10px 0 0 0;
    }

    #field .item::after {
        content: '';
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.017;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
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
