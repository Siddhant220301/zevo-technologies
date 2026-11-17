// Real photos of the studio and its work. A slot without a `src` shows
// nothing at all, so the site never shows a stand-in picture.
//
// Files go in public/photos (JPEG or PNG, ideally 1600 px wide or more) and
// are served resized and compressed for each screen. `alt` says what the photo
// shows, for screen readers and search engines. To change a photo later, save
// the new one under a new file name: the resized copies are cached for a few
// hours, so a reused name can keep showing the old picture.
export const TEAM_PHOTO = {
  src: null, // e.g. "/photos/team.jpg"
  alt: "",
  caption: "", // optional line under the photo
};

// One screenshot per case study, in the order the cards appear
export const CASE_SHOTS = [
  { src: null, alt: "" }, // Shree Balaji Logistics
  { src: null, alt: "" }, // Zenith Lifestyle
  { src: null, alt: "" }, // Kavach Health
];
