// A link to a section of the home page (or to its top, when no id is given).
// On the home page it is an in-page anchor; from any other page it loads the
// home page.
//
// Links between pages are plain <a> elements on purpose. Next.js keeps up to
// three visited pages alive but hidden after a client-side navigation, and
// this site's 3D stage, cursor, smooth scrolling and scroll effects work on the
// whole document. A normal page load gives every page a clean document; the
// pages are static, so it stays fast.
export default function SectionLink({ home = true, id, children, ...rest }) {
  const href = home ? `#${id || "hero"}` : id ? `/#${id}` : "/";
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
