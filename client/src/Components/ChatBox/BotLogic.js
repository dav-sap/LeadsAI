var dataTree = require('data-tree');
const QUESTION = "question";
const ANSWER_INPUT = "answer_input";
const ANSWER_OPTION = "answer_option";

let BOT_LOGIC = dataTree.create();

let root = BOT_LOGIC.insert({
    type: QUESTION,
    content: " בחירה מצויינת :) כדי שגיא יוכל ליצור איתך קשר, נצטרך כמה פרטים. איך קוראים לך? "
});

let NAME = BOT_LOGIC.insertToNode(root,{
    type: ANSWER_INPUT,
    createUser : true,
});


let IS_WED_DATE = BOT_LOGIC.insertToNode(NAME, {
    type: QUESTION,
    content: "?היי צדיק, האם כבר יש תאריך לחתונה"
});



let YES = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER_OPTION,
    content: "כן"
});

let NOT_YET = BOT_LOGIC.insertToNode(IS_WED_DATE, {
    type: ANSWER_OPTION,
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
export {QUESTION, ANSWER_OPTION, ANSWER_INPUT}
export default BOT_LOGIC;

