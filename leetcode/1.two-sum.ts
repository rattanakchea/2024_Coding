/*
 * @lc app=leetcode id=1 lang=typescript
 *
 * [1] Two Sum
 */

// @lc code=start
function twoSum(nums: number[], target: number): number[] {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) return [map.get(nums[i]), i];
        let remain = target - nums[i];
        map.set(remain, i);
    }
    return [];
};
// @lc code=end

// Test

let nums = [2,7,11,15];
console.log(twoSum(nums, 9));

export  {twoSum};
