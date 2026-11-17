// The films of the Motion Lab, in the order of its buttons (three to five).
//
// A slot without a `video` shows the drawn animation of that style instead,
// so the lab works before any file exists. To put a film in a slot:
//   video:   { desktop: "/video/<name>.mp4", mobile: "/video/<name>-tall.mp4" }
//            `mobile` is optional: a taller cut shown on phones
//   poster:  "/video/<name>.jpg"   the still shown before the film loads
//   caption: one line under the viewer saying what the film shows
// The files live in the public/video folder.
export const REEL = [
  {
    id: "0",
    kicker: "STYLE 01 //",
    title: "Interactive Product Launch",
    caption: "",
    video: null,
    poster: null,
  },
  {
    id: "1",
    kicker: "STYLE 02 //",
    title: "Kinetic Motion Graphics",
    caption: "",
    video: null,
    poster: null,
  },
  {
    id: "2",
    kicker: "STYLE 03 //",
    title: "Cinematic Showcase",
    caption: "",
    video: null,
    poster: null,
  },
];
