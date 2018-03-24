import moment from 'moment';
import React, { Component } from 'react';
var dataTree = require('data-tree');

const QUESTION = "question";
const ANSWER_INPUT = "answer_input";
const ANSWER_OPTION = "answer_option";
const FEMALE = "Female";
const MALE = "Male";
const NOT_YET_STR = "עוד לא";
const YES_STR = "כן!";
const END_STR = "מעולה! היועץ שלנו יצור איתך בקרוב.";
const YOUR_NUM_STR_AFTER_DATE = "תאריך חלום ";
const NO_PRESSURE_STR = "אין לחץ ";
const WINK = "😉";
const HEART_EYES = "😍";
const END_YOUR_NUMBER_STR = "מה מספר הטלפון שלך?";


let BOT_LOGIC = dataTree.create();
let YOUR_NUM_NODE = {
    type: ANSWER_INPUT,
    placeholder: "הכנס מספר נייד",
    dir:"ltr",
    changeString: function (oldInput, newInput) {
        if (oldInput.length === 2 && newInput.length === 3) {
            return newInput + "-";
        } else if (oldInput.length === 4 && newInput.length === 3) {
            return newInput.slice(0, -1)
        } else if (oldInput.length === 5 && newInput.length === 4) {
            return newInput.slice(0, -2);
        } else return newInput;
    },
    validator: function (value) {
        let reg = /\d/;
        let reg1 = /-/;
        return (reg.test(value[value.length - 1]) || reg1.test(value[value.length - 1])) && value.length <= 12;
    },
    validateSubmit: function (value) {
        return value && value.length >= 12
    }
};
let root = BOT_LOGIC.insert({
    type: QUESTION,
    gender: "",
    get content() {
        let today = new Date().getHours();
        let start = "";
        if (today >= 5 && today < 12) {
            start = "בוקר טוב!"
        } else if (today >= 12 && today < 18) {
            start = "צהריים טובים!"
        } else if (today >= 18 && today < 22) {
            start = "ערב טוב!"
        } else if (today >= 22 || today < 5) {
            start = "לילה טוב!"
        }
        let end = " איך קוראים לך?";
        return start + end;
    }
});

let NAME = BOT_LOGIC.insertToNode(root,{
    type: ANSWER_INPUT,
    createUser : true,
    placeholder: "שם מלא |",
    changeString: function (oldInput, newInput) {
        return newInput;
    },
    validator: function (value) {
        let reg = /^([^0-9]*)$/;
        return reg.test(value);
    },
    validateSubmit: function (value) {
        return value.length >= 1
    }
});


let IS_WED_DATE = BOT_LOGIC.insertToNode(NAME, {
    type: QUESTION,
    name: "",
    getName: true,
    get content() {
        let start = "נעים מאוד ";
        let end = ". יש תאריך לחתונה?";
        return start + this.name + end;
    }
});

let NOT_YET = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER_OPTION,
    content: NOT_YET_STR
});

let YES = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER_OPTION,
    content: YES_STR,
    fill: "rgba(25, 45, 66, 0.8)"

});


let GET_WED_DATE = BOT_LOGIC.insertToNode(YES, {
    type: QUESTION,
    content: "קולולו!!! מתי מתחתנים?"
});
let WHEN_WED = BOT_LOGIC.insertToNode(GET_WED_DATE, {
    type: ANSWER_INPUT,

    get placeholder() {

        return "בחר תאריך"
    },
    validator: function (value) {
        // let reg = /^\d*\/*\d*\/*\d*\/*$/;
        // return reg.test(value);
        return true;
    },
    validateSubmit: function (value) {
        // let reg = /^\d{1,2}\/\d{1,2}\/\d\d(\d\d)?$/;
        // return reg.test(value);
        return value.length >= 1;
    },
    changeString: function (oldInput, newInput) {
        return newInput;
    }
});
let YOUR_NUM = BOT_LOGIC.insertToNode(WHEN_WED, {
    type: QUESTION,
    content: YOUR_NUM_STR_AFTER_DATE + HEART_EYES +END_YOUR_NUMBER_STR,
});
let YOUR_NUM_2 = BOT_LOGIC.insertToNode(NOT_YET, {
    type: QUESTION,
    content: NO_PRESSURE_STR + WINK + " " + END_YOUR_NUMBER_STR,
    // dir:"ltr",
    // content: WINK,
});
let YOUR_NUM_ANSWER = BOT_LOGIC.insertToNode(YOUR_NUM, YOUR_NUM_NODE);
let YOUR_NUM_ASNWER2 = BOT_LOGIC.insertToNode(YOUR_NUM_2, YOUR_NUM_NODE);
let END = BOT_LOGIC.insertToNode(YOUR_NUM_ANSWER, {
    type: QUESTION,
    content:END_STR,
    completed: true
});
let END_2 = BOT_LOGIC.insertToNode(YOUR_NUM_ASNWER2, {
    type: QUESTION,
    content:END_STR,
    completed: true
});

export {QUESTION, ANSWER_OPTION, ANSWER_INPUT, FEMALE, MALE, NOT_YET_STR,YES_STR}
export default BOT_LOGIC;

