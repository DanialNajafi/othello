import { expect } from "jsr:@std/expect";
import { fibonacci } from "./fibonacci.js";

Deno.test("test first Fibonacci number", () => {
  expect(fibonacci(0)).toBe(1);
});

Deno.test("test second Fibonacci number", () => {
  expect(fibonacci(1)).toBe(1);
});
Deno.test("test fibonacci with invalid type (string)", () => {
  expect(fibonacci("abc")).toBeUndefined();
});
Deno.test("test fibonacci with negative number", () => {
  expect(fibonacci(-3)).toBeUndefined();
});
Deno.test("test fibonacci default-case (n=2)", () => {
  expect(fibonacci(2)).toBe(2);
});
