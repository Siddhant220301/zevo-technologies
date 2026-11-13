// The Zevo logo, as shapes shared by every place it appears (header, footer,
// browser icon). Each letter is drawn on its own 100 x 100 square: one face
// of the cube that unfolds into the word. The accent pieces are the
// Klein-blue cuts; they climb from the Z's foot to the V's arm.
export const LOGO_LETTERS = [
  {
    key: "Z",
    main: "M18 10H90V31L41 90H10L59 31H10V18Q10 10 18 10Z",
    accent: "M65.4 69H90V90H48Z",
  },
  {
    key: "E",
    main: "M26 10H90V31H8.6ZM26 69H90V90H8.6Z",
    accent: "M26 39.5H80V60.5H8.6Z",
  },
  {
    key: "V",
    main: "M10 10H33L50 58.6L54.4 46H77.4L62 90H38Z",
    accent: "M67 10H90L79.5 40H56.5Z",
  },
  {
    key: "O",
    main: "M40 10H60A30 30 0 0 1 90 40V60A30 30 0 0 1 60 90H40A30 30 0 0 1 10 60V40A30 30 0 0 1 40 10ZM42 32H58A10 10 0 0 1 68 42V58A10 10 0 0 1 58 68H42A10 10 0 0 1 32 58V42A10 10 0 0 1 42 32Z",
    evenOdd: true,
  },
];

// TECHNOLOGIES: chamfered stroke letters on a 10 x 13 grid, drawn with a
// 2.4 stroke, so the whole logo stays vector with no font to load
export const SUB_GLYPHS = {
  T: "M0 1.2H10M5 1.2V13",
  E: "M10 1.2H1.2V11.8H10M1.2 6.5H8.4",
  C: "M10 1.2H3.4L1.2 3.4V9.6L3.4 11.8H10",
  H: "M1.2 0V13M8.8 0V13M1.2 6.5H8.8",
  N: "M1.2 13V0M8.8 0V13M1.2 1.6L8.8 11.4",
  O: "M3.4 1.2H6.6L8.8 3.4V9.6L6.6 11.8H3.4L1.2 9.6V3.4Z",
  L: "M1.2 0V11.8H10",
  G: "M8.8 3.4L6.6 1.2H3.4L1.2 3.4V9.6L3.4 11.8H6.6L8.8 9.6V6.6H5.2",
  I: "M2 1.2H8M5 1.2V11.8M2 11.8H8",
  S: "M10 1.2H3.4L1.2 3.4V4.3L3.4 6.5H6.6L8.8 8.7V9.6L6.6 11.8H0",
};

export const SUB_WORD = "TECHNOLOGIES";

// Spreads TECHNOLOGIES across the width of ZEVO (x 10 to 390) at a given
// letter scale. Small placements use a larger scale so it stays legible.
export function subLayout(scale) {
  const width = 10 * scale;
  const step = (380 - width) / (SUB_WORD.length - 1);
  return SUB_WORD.split("").map((ch, i) => ({ ch, x: Number((10 + i * step).toFixed(2)) }));
}
