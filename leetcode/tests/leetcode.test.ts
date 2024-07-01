import { twoSum } from "../1.two-sum";
import { isValid } from "../20.valid-parentheses";

describe("Two Sums", () => {

    test('[2,7,11,15] and target 9 should equal [0, 1]', () => {
        expect(1).toBe(1);
      });
    test('[2,7,11,15] and target 9 should equal [0, 1]', () => {
      expect(twoSum([2,7,11,15], 9)).toEqual([0, 1]);
    });

    test('is Valid Parenthesis', () => {
      let s = "()[]{}";
      expect(isValid(s)).toBe(true);

      let s2 = "()[]{";
      expect(isValid(s2)).toBe(false);
    })

});