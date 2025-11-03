// result_tied_test.js
import { expect } from "jsr:@std/expect";
import { Board } from "./board.js";

// Hilfshelfer: 8x8 Matrix mit einem Wert
function fill(val) {
  return Array.from({ length: 8 }, () => Array(8).fill(val));
}

// Hilfshelfer: tiefe Kopie
function clone(mat) {
  return mat.map((row) => row.slice());
}

// Zaehlfunktion fuer Debug/Pruefzwecke (optional)
function count(mat, v) {
  let n = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (mat[r][c] === v) n++;
  return n;
}

/**
 * 1) Positivtest: Unentschieden (tied === true)
 * Wir erzeugen ein voll belegtes Schachbrettmuster (32x '1', 32x '2').
 */
Deno.test("Board.result().tied == true bei vollem Brett mit gleicher Steinanzahl", () => {
  const mat = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 2)),
  );
  // Sicherheit: 32/32
  expect(count(mat, 1)).toBe(32);
  expect(count(mat, 2)).toBe(32);

  const board = Board.of(mat);
  const res = board.result();
  expect(res.tied).toBe(true);
});

/**
 * 2) Angrenzende Klasse: Sieg Spieler 1 (diff = +1)
 * Voll belegt, aber ein einziges Feld von '2' auf '1' drehen -> 33 vs 31.
 */
Deno.test("Board.result().tied == false bei Sieg Spieler 1 (diff = +1)", () => {
  const mat = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 2)),
  );
  // Im Muster ist (0,0) == 1. Wir suchen ein Feld mit 2 und machen es zu 1.
  // Nehmen wir (0,1) (ist im Muster 2) und setzen es auf 1.
  mat[0][1] = 1;

  // 33 vs 31
  expect(count(mat, 1)).toBe(33);
  expect(count(mat, 2)).toBe(31);

  const board = Board.of(mat);
  const res = board.result();
  expect(res.tied).toBe(false);
  // Optional: Falls result einen Sieger kennzeichnet, koennte man das auch pruefen.
});

/**
 * 3) Angrenzende Klasse: Sieg Spieler 2 (diff = -1)
 * Voll belegt, aber ein einziges Feld von '1' auf '2' drehen -> 31 vs 33.
 */
Deno.test("Board.result().tied == false bei Sieg Spieler 2 (diff = -1)", () => {
  const mat = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 2)),
  );
  // (0,0) ist 1 im Muster. Aendere es zu 2.
  mat[0][0] = 2;

  // 31 vs 33
  expect(count(mat, 1)).toBe(31);
  expect(count(mat, 2)).toBe(33);

  const board = Board.of(mat);
  const res = board.result();
  expect(res.tied).toBe(false);
});

/**
 * 4) Angrenzende Klasse: Spiel noch nicht zu Ende
 * Mindestens ein leeres Feld verbleibt (und typischerweise sind Zuege noch moeglich).
 * Erwartung: tied === false
 */
Deno.test("Board.result().tied == false wenn das Spiel noch laeuft", () => {
  // Starten wir von einem fast vollen Tie-Brett und lassen ein Feld leer.
  const mat = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 2)),
  );
  mat[7][7] = 0; // ein einziges leeres Feld

  const board = Board.of(mat);
  const res = board.result();
  expect(res.tied).toBe(false);
});
