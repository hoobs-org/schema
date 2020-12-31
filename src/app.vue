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
    <div id="app">
        <div class="screen">
            <div class="schema">
                <textarea v-model="working" v-on:change="update" spellcheck="false" style="width: 600px; height: 500px; padding: 7px;"></textarea>
                <div class="actions">
                    <div class="section">Output</div>
                    <div v-on:click="update" class="button primary">Apply</div>
                </div>
                <pre v-html="JSON.stringify(value, null, 4)"></pre>
            </div>
            <div v-if="!error" class="form">
                <schema-form :schema="schema" v-model="value" class="output" />
            </div>
            <div v-else class="error">
                {{ error.message }}
            </div>
        </div>
    </div>
</template>

<script>
    import Form from "@/components/form";

    export default {
        name: "app",

        components: {
            "schema-form": Form
        },

        data() {
            return {
                value: {
                    "accessories": [
                        {
                            "name": "test",
                            "stateful": true,
                            "reverse": true
                        }
                    ]
                },
                working: "",
                error: null,
                schema: {
                    "type": "object",
                    "properties": {
                        "accessories": {
                            "type": "array",
                            "format": "root",
                            "items": {
                                "title": "Accessory",
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "title": "Name",
                                        "type": "string",
                                        "required": true
                                    },
                                    "stateful": {
                                        "title": "Stateful",
                                        "type": "boolean",
                                        "default": false,
                                        "description": "The switch remains on instead of being automatically turned off."
                                    },
                                    "reverse": {
                                        "title": "Reverse",
                                        "type": "boolean",
                                        "default": false,
                                        "description": "The switch's default state is on."
                                    },
                                    "time": {
                                        "title": "Time",
                                        "type": "number",
                                        "default": 1000,
                                        "description": "The switch will turn off after this number of milliseconds. Not used if the switch is stateful."
                                    }
                                }
                            }
                        }
                    }
                },
            }
        },

        mounted() {
            this.working = JSON.stringify(this.schema, null, 4);
        },

        methods: {
            update() {
                try {
                    this.schema = JSON.parse(this.working);
                    this.error = null;
                } catch (error) {
                    this.schema = {};
                    this.error = error;
                }
            },
        },
    };
</script>

<style>
    @font-face {
        font-family: "Montserrat";
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local("Montserrat Regular"), local("Montserrat-Regular"),
            url(./assets/montserrat.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
            U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Montserrat Black";
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: local("Montserrat Black"), local("Montserrat-Black"),
            url(./assets/montserrat-black.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
            U+FE2E-FE2F;
    }

    @font-face {
        font-family: "Material Icons";
        font-style: normal;
        font-weight: 400;
        src: url(./assets/material.eot);
        src: local("Material Icons"), local("MaterialIcons-Regular"),
            url(./assets/material.woff2) format("woff2"),
            url(./assets/material.woff) format("woff"),
            url(./assets/material.ttf) format("truetype");
    }
</style>

<style>
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    #app {
        height: 100%;
        display: flex;
        flex-direction: column;
        font-family: "Montserrat", sans-serif;
        border-top: 7px #feb400 solid;
        color: #727272;
        overflow: hidden;
    }

    #app ::placeholder {
        color: #727272;
    }

    #app .icon {
        font-family: "Material Icons";
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        user-select: none;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        font-feature-settings: "liga";
        -webkit-font-smoothing: antialiased;
    }

    #app .button {
        height: 40px;
        box-sizing: border-box;
        background:  #f8f8f8;
        color: #1a1a1a !important;
        text-decoration: none !important;
        display: inline-flex;
        align-items: center;
        border: 1px #dfdfdf solid;
        padding: 10.5px 10px 9.5px 10px;
        user-select: none;
        margin: 0 10px 0 0;
        white-space: pre;
        cursor: pointer;
    }

    #app .button.primary {
        background: #feb400;
        color: #fff !important;
        border: 1px #feb400 solid;
    }

    #app .button:hover {
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        text-decoration: none !important;
    }

    #app input {
        background: #f8f8f8;
        color: #000;
        border: 1px #dfdfdf solid;
        border-radius: 0;
        outline: 0 none !important;
    }

    #app input:focus {
        border-color: #feb400;
        border-radius: 0;
    }

    #app select {
        background: #f8f8f8;
        color: #000;
        border: 1px #dfdfdf solid;
        border-radius: 0;
        outline: 0 none !important;
    }

    #app select:focus {
        border-color: #feb400;
        border-radius: 0;
    }

    #app select option {
        border: 1px #f8f8f8 solid;
        background: #f8f8f8;
        outline: 0 none;
    }

    #app textarea {
        background: #f8f8f8;
        color: #000;
        border: 1px #dfdfdf solid;
        border-radius: 0;
        outline: 0 none !important;
    }

    #app textarea:focus {
        border-color: #feb400;
        border-radius: 0;
    }

    #app .screen {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    #app .screen .schema {
        padding: 20px 0 20px 20px;
        background: #f8f8f8;
        display: flex;
        flex-direction: column;
        -ms-overflow-style: none;
        overflow: auto;
    }

    #app .screen .schema::-webkit-scrollbar {
        display: none;
    }

    #app .screen .schema textarea {
        margin: 0 20px 0 0;
    }

    #app .screen .schema pre {
        flex: 1;
        background: #f8f8f8;
        color: #000;
        border: 1px #dfdfdf solid;
        border-radius: 0;
        padding: 7px;
        margin: 0 20px 0 0;
        -ms-overflow-style: none;
        overflow: auto;
    }

    #app .screen .schema pre::-webkit-scrollbar {
        display: none;
    }

    #app .screen .schema .section {
        color: #feb400;
        font-size: 17px;
    }

    #app .screen .schema .actions {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        padding: 10px 10px 10px 0;
    }

    #app .screen .form {
        flex: 1;
        padding: 20px;
        -ms-overflow-style: none;
        overflow: auto;
    }

    #app .screen .form::-webkit-scrollbar {
        display: none;
    }

    #app .screen .form .output {
        max-width: 800px;
    }

    #app .screen .error {
        flex: 1;
        padding: 20px;
        -ms-overflow-style: none;
        overflow: auto;
    }

    #app .screen .error::-webkit-scrollbar {
        display: none;
    }
</style>
