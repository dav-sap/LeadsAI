var dataTree = require('data-tree');
const QUESTION = "question";
const ANSWER = "answer";

let BOT_LOGIC = dataTree.create();

let root = BOT_LOGIC.insert({
    type: QUESTION,
    content: " אהלן נעים מאד! לפני שנתחיל לשוחח, אשמח לקבל ממך כמה פרטים בסיסיים"
});

let GET_NAME = BOT_LOGIC.insertToNode(root, {
    type: QUESTION,
    content: "?איך קוראים לך",
    close: true
});

let NAME = BOT_LOGIC.insertToNode(GET_NAME,{
    type: ANSWER,
    content: "",
    createUser : true,
});


let IS_WED_DATE = BOT_LOGIC.insertToNode(NAME, {
    type: QUESTION,
    content: "?היי צדיק, האם כבר יש תאריך לחתונה"
});



let YES = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER,
    content: "כן"
});

let NOT_YET = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER,
    content: "עוד לא"
});


let GET_WED_DATE = BOT_LOGIC.insertToNode(YES, {
    type: QUESTION,
    content: "?יופי מתי זה"
});

let TOO_BAD = BOT_LOGIC.insertToNode(NOT_YET, {
    type: QUESTION,
    content: "..חבל"
});
export {QUESTION, ANSWER}
export default BOT_LOGIC;

