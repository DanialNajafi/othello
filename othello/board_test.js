// board_test.js
import { expect } from "jsr:@std/expect";
import { Board } from "./board.js";

// Hilfsfunktion: Startaufstellung verifizieren
function verifyInitial(board) {
  const p1 = board.fieldsWithState(1).length;
  const p2 = board.fieldsWithState(2).length;
  const empty = board.fieldsWithState(0).length;
  expect(p1).toBe(2);
  expect(p2).toBe(2);
  expect(empty).toBe(64 - 4);
}

Deno.test("Initial counts", () => {
  const board = new Board();
  verifyInitial(board);
});

Deno.test("Valid moves for player 1 on initial board", () => {
  const board = new Board();
  // Typische legale Zuege fuer Spieler 1 bei Standardstart:
  // (2,3), (3,2), (4,5), (5,4) — Index 0-basiert
  expect(board.isValidMove(1, 2, 3)).toBe(true);
  expect(board.isValidMove(1, 3, 2)).toBe(true);
  expect(board.isValidMove(1, 4, 5)).toBe(true);
  expect(board.isValidMove(1, 5, 4)).toBe(true);

  // Ein offenkundig ungueltiger Zug
  expect(board.isValidMove(1, 0, 0)).toBe(false);
});

Deno.test("Valid moves for player 2 on initial board", () => {
  const board = new Board();
  // Symmetrische Zuege fuer Spieler 2:
  // (2,4), (3,5), (4,2), (5,3)
  expect(board.isValidMove(2, 2, 4)).toBe(true);
  expect(board.isValidMove(2, 3, 5)).toBe(true);
  expect(board.isValidMove(2, 4, 2)).toBe(true);
  expect(board.isValidMove(2, 5, 3)).toBe(true);
});

Deno.test("Occupied field is invalid", () => {
  const board = new Board();
  // In der Startaufstellung belegt:
  // typischerweise (3,3) und (4,4) vom einen Spieler, (3,4) und (4,3) vom anderen.
  expect(board.isValidMove(1, 3, 3)).toBe(false);
  expect(board.isValidMove(2, 3, 4)).toBe(false);
});

Deno.test("Out-of-bounds coordinates are invalid", () => {
  const board = new Board();
  expect(board.isValidMove(1, -1, 0)).toBe(false);
  expect(board.isValidMove(1, 0, 8)).toBe(false);
  expect(board.isValidMove(2, 9, 9)).toBe(false);
});

Deno.test("Invalid player values are invalid", () => {
  const board = new Board();
  expect(board.isValidMove(0, 2, 3)).toBe(false);
  expect(board.isValidMove(3, 2, 3)).toBe(false);
  expect(board.isValidMove(NaN, 2, 3)).toBe(false);
});

Deno.test("No capture along edge (must be enclosed by own stone)", () => {
  const board = new Board();

  // Kuenstliche Stellung bauen:
  // Reihe 0: [1, 2, 2, 2, 2, 2, 2, 0]
  // Ein Zug von Spieler 1 auf (0,7) ist NUR dann gueltig, wenn irgendwo eine Richtung
  // mit mind. einem 2 und anschliessendem 1 existiert. Hier NICHT der Fall -> false.
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) board.fields[r][c] = 0;
  }
  board.fields[0][0] = 1;
  for (let c = 1; c <= 6; c++) board.fields[0][c] = 2;
  board.fields[0][7] = 0;

  expect(board.isValidMove(1, 0, 7)).toBe(false);
});

Deno.test("Multi-directional capture is valid", () => {
  const board = new Board();

  // Leeres Brett, kleine Konstellation:
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) board.fields[r][c] = 0;
  }
  // Zentrum:
  //   2 2
  //   2 1
  board.fields[3][3] = 2;
  board.fields[3][4] = 2;
  board.fields[4][3] = 2;
  board.fields[4][4] = 1;

  // Zug von Spieler 1 auf (2,2) schliesst diagonal und horizontal ein -> true
  expect(board.isValidMove(1, 2, 2)).toBe(true);
});
