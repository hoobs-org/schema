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
    <div id="field" class="field">
        <span class="title" v-html="title"></span>
        <span v-if="description && description !== ''" class="description" v-html="description"></span>
        <input
            :id="id || uuid"
            :ref="uuid"
            :name="name"
            type="number"
            autocomplete="false"
            data-lpignore="true"
            :min="min !== undefined ? min : ''"
            :max="max !== undefined ? max : ''"
            :step="step"
            :value="value"
            :placeholder="placeholder"
            v-on:input="update"
            v-on:change="change"
            v-bind:required="required"
        />
    </div>
</template>

<script>
    const INPUT_FOCUS_DELAY = 10;

    export default {
        name: "number-field",

        props: {
            id: {
                type: String,
                default: undefined,
            },
            name: String,
            title: String,
            description: String,
            placeholder: {
                type: [Number, String],
                default: "",
            },
            value: Number,
            min: Number,
            max: Number,
            step: {
                type: [Number, String],
                default: "any",
            },
            required: {
                type: Boolean,
                default: false,
            },
            autofocus: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                uuid: "",
            };
        },

        mounted() {
            if (this.id === undefined || typeof String) {
                this.uuid = `number_field_${Math.random().toString(36).substring(2, 10)}`;
            } else {
                this.uuid = this.id;
            }

            if (this.autofocus) {
                setTimeout(() => {
                    if (this.$refs[this.uuid]) this.$refs[this.uuid].focus();
                }, INPUT_FOCUS_DELAY);
            }
        },

        methods: {
            update() {
                this.$emit("input", parseFloat(this.$refs[this.uuid].value));
            },

            change() {
                this.$emit("change", parseFloat(this.$refs[this.uuid].value));
            },
        },
    };
</script>

<style scoped>
    #field {
        display: flex;
        flex-direction: column;
        padding: 0 10px 20px 0;
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

    #field input {
        flex: 1;
        padding: 7px;
        font-size: 14px;
    }

    #field input:focus {
        outline: 0 none;
    }

    #field input::placeholder {
        opacity: 0.5;
    }
</style>
