import { twoSum } from "../1.two-sum";

describe("Two Sums", () => {

    test('[2,7,11,15] and target 9 should equal [0, 1]', () => {
        expect(1).toBe(1);
      });
    test('[2,7,11,15] and target 9 should equal [0, 1]', () => {
      expect(twoSum([2,7,11,15], 9)).toEqual([0, 1]);
    });

});