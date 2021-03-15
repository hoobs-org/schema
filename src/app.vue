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
                <schema-form instance="instance" identifier="identifier" :schema="schema" v-model="value" class="output" />
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
                    "platform": "Hue",
                    "name": "Hue",
                    "users": {
                        "ECB5FAFFFE255032": "HLTz1fPjcyxa6tZe4jNAB6RkLU9a67UZuZie0jet"
                    },
                    "lights": true,
                    "nativeHomeKitLights": false,
                    "brightnessAdjustment": 100,
                    "heartrate": 5,
                    "lowBattery": 25,
                    "timeout": 5,
                    "waitTimePut": 50,
                    "waitTimePutGroup": 1000,
                    "waitTimeResend": 300,
                    "waitTimeUpdate": 20
                },
                working: "",
                error: null,
                schema: {
                    "name": "homebridge-hue",
                    "alias": "Hue",
                    "accessory": false,
                    "platform": true,
                    "singular": true,
                    "config": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "title": "Name",
                                "description": "Plugin name as displayed in the homebridge log.",
                                "type": "string",
                                "required": true,
                                "default": "Hue"
                            },
                            "anyOn": {
                                "title": "Any On",
                                "description": "Expose AnyOn characteristic.",
                                "type": "boolean",
                                "default": true
                            },
                            "brightnessAdjustment": {
                                "title": "Brightness Adjustment",
                                "description": "Adjustment factor for brightness for adaptive lighting.",
                                "type": "integer",
                                "default": 100,
                                "placeholder": 100,
                                "minimum": 10,
                                "maximum": 100
                            },
                            "configuredName": {
                                "title": "Configured Names",
                                "description": "Expose Configured Name characteritic.",
                                "default": false,
                                "type": "boolean"
                            },
                            "effects": {
                                "title": "Effects",
                                "description": "Expose special effects (on supported lights) as separate services.",
                                "type": "boolean",
                                "default": true
                            },
                            "excludeSensorTypes": {
                                "title": "Exclude Sensor Types",
                                "description": "List of sensor types to exclude.",
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "forceEveWeather": {
                                "title": "Eve Weather",
                                "description": "Create dummy pressure sensor for temperature/humidity sensors, so the Eve app treats them like an Eve Weather.",
                                "default": false,
                                "type": "boolean"
                            },
                            "forceHttp": {
                                "title": "Use HTTP",
                                "description": "Use plain http instead of https.",
                                "default": true,
                                "type": "boolean"
                            },
                            "groups": {
                                "title": "Expose Groups",
                                "default": false,
                                "type": "boolean"
                            },
                            "group0": {
                                "title": "Expose All Lights",
                                "default": false,
                                "type": "boolean"
                            },
                            "heartrate": {
                                "title": "Polling Interval",
                                "description": "Heartbeat interval in seconds.",
                                "type": "integer",
                                "placeholder": 5,
                                "default": 5,
                                "minimum": 1,
                                "maximum": 30
                            },
                            "hosts": {
                                "title": "Bridges/Gateways",
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "hueDimmerRepeat": {
                                "title": "Dimmer Repeat",
                                "description": "Enable repeat mode for the Hue dimmer switch (Dim Up and Dim Down buttons) and the Hue smart button.",
                                "type": "boolean"
                            },
                            "hueMotionTemperatureHistory": {
                                "title": "Sensor History",
                                "description": "Expose the temperature sensor of the Hue motion sensor as a separate HomeKit accessory, to enable temperature history in Eve.",
                                "type": "boolean"
                            },
                            "lights": {
                                "title": "Expose lights.",
                                "default": true,
                                "type": "boolean"
                            },
                            "linkButton": {
                                "title": "Link Button",
                                "description": "Expose the link button on the Hue bridge.",
                                "default": false,
                                "type": "boolean"
                            },
                            "lowBattery": {
                                "title": "Low Battery",
                                "description": "Threshold for low battery.",
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100,
                                "default": 25
                            },
                            "nativeHomeKitLights": {
                                "title": "Hide HomeKit Lights",
                                "description": "Don't expose lights already exposed by Hue.",
                                "type": "boolean",
                                "default": false
                            },
                            "nativeHomeKitSensors": {
                                "title": "Hide HomeKit Sensors",
                                "description": "Don't expose sensors already exposed Hue.",
                                "type": "boolean",
                                "default": true
                            },
                            "noResponse": {
                                "title": "No Response",
                                "description": "Report unreachable lights as <i>No Response</i> in HomeKit.",
                                "type": "boolean"
                            },
                            "parallelRequests": {
                                "title": "Parallel Requests",
                                "description": "The number of ansynchronous requests homebridge-hue sends in parallel to a Hue bridge.",
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 30
                            },
                            "resource": {
                                "title": "Resource",
                                "description": "Expose a Resource characteristic.",
                                "type": "boolean",
                                "default": true
                            },
                            "rooms": {
                                "title": "Rooms",
                                "description": "Include Room groups.",
                                "type": "boolean",
                                "default": false
                            },
                            "rules": {
                                "title": "Rules",
                                "description": "Expose rules.",
                                "type": "boolean",
                                "default": false
                            },
                            "scenes": {
                                "title": "Scenes",
                                "description": "Expose scenes.",
                                "type": "boolean",
                                "default": false
                            },
                            "scenesAsSwitch": {
                                "title": "Scene Switches",
                                "description": "Expose scenes as Switch service.",
                                "type": "boolean"
                            },
                            "schedules": {
                                "title": "Schedules",
                                "description": "Expose schedules.",
                                "type": "boolean",
                                "default": false
                            },
                            "sensors": {
                                "title": "Sensors",
                                "description": "Expose sensors.",
                                "type": "boolean",
                                "default": false
                            },
                            "stealth": {
                                "title": "Local Only",
                                "description": "Don't make any calls to the Internet.",
                                "type": "boolean",
                                "default": false
                            },
                            "timeout": {
                                "title": "Timeout",
                                "description": "The timeout in seconds to wait for a response from a Hue bridge.",
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 30,
                                "default": 5
                            },
                            "users": {
                                "type": "object",
                                "patternProperties": {
                                    "^[A-Z0-9]{16}$": {
                                        "type": "string"
                                    }
                                },
                                "minProperties": 1
                            },
                            "waitTimePut": {
                                "title": "Request Timeout",
                                "description": "The time, in milliseconds, to wait after sending a PUT request, before sending the next PUT request.",
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 50,
                                "default": 50
                            },
                            "waitTimePutGroup": {
                                "title": "Group Request Timeout",
                                "description": "The time, in milliseconds, to wait after sending a PUT request to a group, before sending the next PUT request.",
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 1000,
                                "default": 1000
                            },
                            "waitTimeResend": {
                                "title": "Resend Timeout",
                                "description": "The time, in milliseconds, to wait before resending a request after an ECONNRESET or http status 503 error.",
                                "type": "integer",
                                "minimum": 100,
                                "maximum": 1000,
                                "default": 300
                            },
                            "waitTimeUpdate": {
                                "title": "Update Timeout",
                                "description": "The time, in milliseconds, to wait for a change from HomeKit to another characteristic for the same light or group, before updating the Hue bridge.",
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 500,
                                "default": 20
                            },
                            "wallSwitch": {
                                "title": "Wall Switchs",
                                "description": "Indicate that you use traditional wall switches to power off your lights.",
                                "type": "boolean",
                                "default": false
                            }
                        }
                    }
                },
            }
        },

        mounted() {
            this.working = JSON.stringify(this.schema, null, 4);
            this.update();
        },

        methods: {
            update() {
                let working = {};

                this.schema = {};

                try {
                    working = JSON.parse(this.working);
                    this.error = null;
                } catch (error) {
                    this.error = error;
                }

                if (working.results) working = working.results;

                if (!this.error) {
                    if ((working.pluginType || "").toLowerCase() === "accessory" || working.accessory) {
                        this.schema = {
                            type: "object",
                            properties: {
                                accessories: {
                                    type: "array",
                                    format: "root",
                                    items: {
                                        title: "Accessory",
                                        type: "object",
                                        properties: working.properties || (working.config || working.schema).properties || (working.config || working.schema),
                                    },
                                },
                            },
                        };
                    } else {
                        this.schema = {
                            type: "object",
                            properties: working.properties || (working.config || working.schema).properties || (working.config || working.schema),
                        };
                    }
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
        background: #f8f8f8;
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
