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
        <label class="title" v-if="title && title !== ''" v-html="title"></label>
        <span v-if="schema.description && schema.description !== ''" class="description" v-html="schema.description"></span>
        <div v-for="(item, index) in schema.items.anyOf" class="item" :key="index">
            <checkbox :title="item.title" :checked="items.indexOf(item.enum[0]) !== -1" v-on:input="updateValue($event, index)" />
        </div>
    </div>
</template>

<script>
    import { scaffold } from "../../services/schema";

    export default {
        name: "anyof-field",

        props: {
            schema: Object,
            value: [Object, String, Number, Boolean, Array],
            title: String,
        },

        data() {
            return {
                items: (this.value !== undefined) ? this.value : scaffold(this.schema),
            };
        },

        methods: {
            updateValue(value, index) {
                const location = this.items.indexOf(this.schema.items.anyOf[index].enum[0]);

                if (value && location === -1) {
                    this.items.push(this.schema.items.anyOf[index].enum[0])
                } else if (!value && location !== -1) {
                    this.items.splice(location, 1);
                }

                this.$emit("input", this.items);
            },
        },
    };
</script>

<style scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 0 20px 0;
    }

    #field .title {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 0 7px 0;
        user-select: none;
    }

    #field .title:empty {
        display: none;
    }

    #field .description {
        font-size: 12px;
        margin: -7px 0 7px 0;
        user-select: none;
    }

    #field .description:empty {
        display: none;
    }

    #field .item {
        padding: 0;
    }
</style>
