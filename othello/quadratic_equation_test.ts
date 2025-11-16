import { solve } from "./quadratic_equation";

describe("solve()", () => {

  test("returns two solutions when discriminant > 0", () => {
    const result = solve(1, 0, -1);
    // Lösungen: x = 1, x = -1
    expect(result).toContain(1);
    expect(result).toContain(-1);
    expect(result.length).toBe(2);
  });

  test("returns one solution when discriminant = 0", () => {
    const result = solve(1, 2, 1);
    // doppelte Lösung x = -1
    expect(result).toEqual([-1]);
  });

  test("returns empty array when discriminant < 0", () => {
    const result = solve(1, 0, 1);
    expect(result).toEqual([]);
  });

});
