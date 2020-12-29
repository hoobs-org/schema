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
    <div class="radio" :class="[classes]">
        <div class="group" v-on:click="toggle()">
            <div v-if="state">
                <div class="marker"></div>
            </div>
            <input type="radio" :id="id || uuid" :name="name" :value="value" :disabled="disabled" :required="required" :checked="state" />
        </div>
        <label class="label" :for="id || uuid">{{ title }}</label>
    </div>
</template>

<script>
    export default {
        name: "radio",

        model: {
            prop: "model",
            event: "change",
        },

        props: {
            id: {
                type: String,
                default: undefined,
            },
            model: {
                type: [String, Boolean, Number, Object],
                default: undefined,
            },
            checked: Boolean,
            value: {
                type: [String, Boolean, Number, Object],
                default: undefined,
            },
            name: String,
            title: String,
            required: Boolean,
            disabled: Boolean,
            size: Number,
        },

        data() {
            return {
                uuid: "",
                view: this.model,
            };
        },

        computed: {
            state() {
                return this.model === this.value;
            },

            classes() {
                return {
                    "disabled": this.disabled,
                    "active": this.state,
                };
            },
        },

        methods: {
            toggle() {
                if (this.disabled) return;

                this.view = this.model === this.value;

                this.$emit("input", this.value, this.value);
                this.$emit("change", this.value, this.value);
            },
        },

        watch: {
            checked(value) {
                if (value !== this.state) this.toggle();
            },

            model(value) {
                this.view = this.model === value;
            },
        },

        mounted() {
            if (this.id === undefined || typeof String) {
                this.uuid = `radio_${Math.random().toString(36).substring(2, 10)}`;
            } else {
                this.uuid = this.id;
            }

            if (this.checked && !this.state) this.toggle();
        },
    };
</script>

<style scoped>
    .radio {
        width: 100%;
        height: 29px;
        min-height: 29px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        position: relative;
        margin: 0;
        line-height: 20px;
        border-radius: 100%;
    }

    .radio .label {
        position: relative;
        padding-left: 7px;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        user-select: none;
        cursor: pointer;
    }

    .radio .group {
        width: 20px;
        height: 20px;
        min-width: 20px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        position: relative;
        border-radius: 10px;
        background-color: #f8f8f8;
        border: 1px #dfdfdf solid;
        cursor: pointer;
    }

    .radio.active .group{
        border: 2px #feb400 solid;
    }

    .radio.active .marker{
        background-color: #feb400;
    }

    .radio .group input[type="radio"] {
        position: absolute;
        appearance: none;
        display: none;
        left: -999rem;
    }

    .radio .group .marker {
        position: absolute;
        border-radius: 100%;
        box-sizing: border-box;
        border: 3px #f8f8f8 solid;
        inset: 0;
    }

    .radio.disabled {
        cursor: not-allowed;
    }

    .radio.disabled .group {
        opacity: 0.14;
    }

    .radio.disabled .label {
        opacity: 0.24;
        cursor: not-allowed;
    }
</style>
