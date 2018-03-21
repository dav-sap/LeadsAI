import moment from 'moment';
var dataTree = require('data-tree');

const QUESTION = "question";
const ANSWER_INPUT = "answer_input";
const ANSWER_OPTION = "answer_option";
const FEMALE = "Female";
const MALE = "Male";
const NOT_YET_STR = "עוד לא";
const YES_STR = "כן!";
const YOUR_NUM_STR = "דבר אחרון - מה הספר נייד שלך?";
const NO_PRESSURE_STR = "אין לחץ :)";

let BOT_LOGIC = dataTree.create();

let root = BOT_LOGIC.insert({
    type: QUESTION,
    name: "",
    gender: "",
    get content() {
        let start = "בחירה מצויינת :) כדי ש";
        let middle = this.gender === FEMALE ? " תוכל" : " יוכל";
        let end = " ליצור איתך קשר, נצטרך כמה פרטים. איך קוראים לך?";
        return start + this.name + middle +end;
    }
});

let NAME = BOT_LOGIC.insertToNode(root,{
    type: ANSWER_INPUT,
    createUser : true,
    placeholder: "שם מלא |",
    validator: function () {
        return true
    },
    validateSubmit: function (value) {
        return value.length >= 1
    }
});


let IS_WED_DATE = BOT_LOGIC.insertToNode(NAME, {
    type: QUESTION,
    content: "היי צדיק, האם כבר יש תאריך לחתונה?"
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
    content: "יופי מתי זה?"
});
let WHEN_WED = BOT_LOGIC.insertToNode(GET_WED_DATE, {
    type: ANSWER_INPUT,
    get placeholder() {
        let today = new Date();
        return today.getDate().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getFullYear().toString()
    },
    validator: function (value) {
        let reg = /^\d*\/*\d*\/*\d*\/*$/;
        return reg.test(value);

    },
    validateSubmit: function (value) {
        let reg = /^\d{1,2}\/\d{1,2}\/\d\d(\d\d)?$/;
        return reg.test(value);
    }

});
let YOUR_NUM = BOT_LOGIC.insertToNode(WHEN_WED, {
    type: QUESTION,
    content: YOUR_NUM_STR,
});
let YOUR_NUM_ANSWER = BOT_LOGIC.insertToNode(YOUR_NUM, {
    type: ANSWER_INPUT,
    placeholder: "מספר טלפון",
    validator: function (value) {
        let reg = /^\d+$/;
        return reg.test(value);
    },
    validateSubmit: function (value) {
        return value.length >= 10
    }
});
let END = BOT_LOGIC.insertToNode(YOUR_NUM_ANSWER, {
    type: QUESTION,
    content: "מעולה! היועץ שלנו יצור איתך בקרוב.",
    completed: true
});
let TOO_BAD = BOT_LOGIC.insertToNode(NOT_YET, {
    type: QUESTION,
    content: "חבל..",
    completed: true
});
export {QUESTION, ANSWER_OPTION, ANSWER_INPUT, FEMALE, MALE, NOT_YET_STR,YES_STR}
export default BOT_LOGIC;

