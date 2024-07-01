/*
 * @lc app=leetcode id=20 lang=typescript
 *
 * [20] Valid Parentheses
 */

// @lc code=start
function isValid(s: string): boolean {
    let openBracketSet = new Set(['(', '[', '{']);

    let stack: string[] = [];
    
    for (let ch of s) {
        if (openBracketSet.has(ch)) {
            stack.push(ch);
        } else {
            if (stack.length === 0) return false;
            // peek
            if (!isPair(stack.pop(), ch)) return false; 
        }
    }
    return stack.length === 0;
};

function isPair(open, close) {
    return open === '(' && close === ')'
    || open === '{' && close === '}'
    || open === '[' && close === ']';
}

// @lc code=end

export {isValid};

