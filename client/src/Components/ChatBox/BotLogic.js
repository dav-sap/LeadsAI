import moment from 'moment';
var dataTree = require('data-tree');

const QUESTION = "question";
const ANSWER_INPUT = "answer_input";
const ANSWER_OPTION = "answer_option";
const FEMALE = "Female";
const MALE = "Male";
const NOT_YET_STR = "עוד לא";
const YES_STR = "כן!";
const END_STR = "מעולה! היועץ שלנו יצור איתך בקרוב.";
const YOUR_NUM_STR = "דבר אחרון - מה מספר הנייד שלך?";
const NO_PRESSURE_STR = "אין לחץ :)";


let BOT_LOGIC = dataTree.create();
let YOUR_NUM_NODE = {
    type: ANSWER_INPUT,
    placeholder: "מספר טלפון",
    dir:"ltr",
    changeString: function (oldInput, newInput) {
        if (oldInput.length === 3 && newInput.length === 4) {
            return newInput + "-";
        } else if (oldInput.length === 5 && newInput.length === 4) {
            return newInput.slice(0, -1)
        } else if (oldInput.length === 6 && newInput.length === 5) {
            return newInput.slice(0, -2);
        } else if (oldInput.length === 7 && newInput.length === 8) {
            return newInput + "-";
        } else if (oldInput.length === 10 && newInput.length === 9) {
            return newInput.slice(0, -2);
        } else if (oldInput.length === 9 && newInput.length === 8) {
            return newInput.slice(0, -1);
        }else return newInput;
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
    changeString: function (oldInput, newInput) {
        return newInput;
    },
    validator: function () {
        return true
    },
    validateSubmit: function (value) {
        return value.length >= 1
    }
});


let IS_WED_DATE = BOT_LOGIC.insertToNode(NAME, {
    type: QUESTION,
    name: "",
    get content() {
        let start = "היי";
        let end = ", האם כבר יש תאריך לחתונה?";
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
        let today = new Date();
        return today.getDate().toString() + "/" + (today.getMonth() + 1).toString() + "/" + today.getFullYear().toString()
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
    content: YOUR_NUM_STR,
});
let YOUR_NUM_2 = BOT_LOGIC.insertToNode(NOT_YET, {
    type: QUESTION,
    content: NO_PRESSURE_STR + " " + YOUR_NUM_STR,
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

