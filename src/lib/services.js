// The six things the studio builds, one entry per service page.
//
// To add a service: add an entry here, and copy one of the small route files
// in app/services/<slug>/page.js under the new slug. The page, its title and
// description, its structured data and its sitemap entry all come from the
// entry. `face` is the matching face of the 3D die and `chip` the matching
// chip in the enquiry form. `titleLead`, `titleAccent` and `titleTail`
// together make the page heading.
//
// Everything written here restates what the home page already promises.
export const SERVICES_UPDATED = "2026-11-16";

export const SERVICES = [
  {
    slug: "custom-erp-software",
    chip: "erp",
    face: 0,
    code: "01 // CUSTOM ERP",
    name: "Custom ERP & Operations Software",
    titleLead: "Custom ERP software, built around how your business",
    titleAccent: "runs",
    metaTitle: "Custom ERP Software Development",
    metaDescription:
      "Custom ERP for inventory, GST e-invoicing, payroll and reporting, built around your workflow. Delivered in 4 to 6 weeks. You own the code, with no per-user fees.",
    lead: "We build custom ERP and operations software for businesses that have outgrown spreadsheets and rigid off-the-shelf tools. Inventory, invoicing, attendance and reporting live in one fast system that you own outright.",
    body: [
      "Off-the-shelf ERP software forces your team into complicated setups and screens that do not match how you work, and it charges for every user, every month. A custom ERP is the opposite: it is shaped around your process, it loads instantly on office workstations, warehouse handhelds and phones, and it belongs to your business.",
      "A typical custom ERP is delivered in 4 to 6 weeks. We build in 2-week sprints, so you test working software on a live staging link long before launch.",
    ],
    includes: [
      {
        title: "Inventory & warehouse",
        text: "Track stock in real time across multiple distribution hubs. Purchase orders are raised automatically when stock reaches its reorder level, and barcode scanners sync without lag.",
      },
      {
        title: "GST e-invoicing & e-way bills",
        text: "Generate GST invoices with IRN and QR codes automatically, create e-way bills for every dispatch, and reconcile payments against your bank feeds.",
      },
      {
        title: "Team attendance & payroll",
        text: "Track check-ins, floor attendance and shift rosters without manual registers. Payroll and payslips are calculated with statutory PF and ESIC deductions.",
      },
      {
        title: "Dashboards & daily reports",
        text: "See daily sales, pending dispatches, low-stock alerts and margins in one executive dashboard, with a daily summary delivered to WhatsApp.",
      },
    ],
    fit: [
      "Stock, orders and invoices live in separate spreadsheets that never agree.",
      "You pay per user, every month, for software your staff struggle to use.",
      "Your workflow does not fit the screens an off-the-shelf ERP gives you.",
    ],
    faqs: [
      {
        q: "How long does a custom ERP take to build?",
        a: "A typical custom ERP is delivered in 4 to 6 weeks. Work runs in 2-week sprints, and each sprint ends with a working release your team can test on a live staging link.",
      },
      {
        q: "Is the invoicing GST compliant?",
        a: "Yes. Invoices are generated with IRN and QR codes, and e-way bills are created for dispatches.",
      },
      {
        q: "Do we pay per user?",
        a: "No. There are no per-seat charges and no recurring licence fees. You add users as your team grows.",
      },
    ],
  },
  {
    slug: "interactive-web-experiences",
    chip: "interactive",
    face: 1,
    code: "02 // INTERACTIVE WEB",
    name: "Interactive Web & Product Showcases",
    titleLead: "Interactive web experiences that let customers",
    titleAccent: "explore",
    titleTail: "your product",
    metaTitle: "Interactive Web & Product Showcases",
    metaDescription:
      "Interactive product visualisers, 360° views and configurators that run fast in the browser, on phones and desktops. Designed and engineered by one studio.",
    lead: "We design and engineer interactive web experiences: product visualisers, 360° views and configurators that let customers explore every detail and buy with confidence.",
    body: [
      "A photo shows a product from one angle. An interactive showcase lets a customer turn it, change its colour and see the result at once, right in the browser, with nothing to install. The die on this site is a small example of the same engineering.",
      "Every experience is built for speed first, so it stays smooth on phones as well as desktops, and it is designed by the same team that writes the code.",
    ],
    includes: [
      {
        title: "Product visualisers",
        text: "High-performance viewers that let customers inspect a product and its materials from every side.",
      },
      {
        title: "Configurators",
        text: "Customers choose colours and features and see the product update instantly.",
      },
      {
        title: "Launch pages",
        text: "Pages that present a new product with motion, depth and detail.",
      },
      {
        title: "Fast on every device",
        text: "Lightweight engineering that loads quickly on mobile browsers and desktops alike.",
      },
    ],
    fit: [
      "Customers need to see a product from every angle before they buy.",
      "Your product comes in many colours, materials or options.",
      "A launch deserves more than a gallery of photos.",
    ],
    faqs: [
      {
        q: "Does it work on phones?",
        a: "Yes. Experiences are engineered to load fast and stay smooth on mobile browsers as well as desktops.",
      },
      {
        q: "Do visitors need to install anything?",
        a: "No. Everything runs in the browser.",
      },
      {
        q: "Who owns the finished work?",
        a: "You do. The source code is handed over to you, with no recurring licence fees.",
      },
    ],
  },
  {
    slug: "whatsapp-workflow-automation",
    chip: "automation",
    face: 2,
    code: "03 // AUTOMATION",
    name: "WhatsApp & Workflow Automation",
    titleLead: "WhatsApp and workflow automation that does the",
    titleAccent: "routine",
    titleTail: "work",
    metaTitle: "WhatsApp & Workflow Automation",
    metaDescription:
      "Automated order alerts, dispatch notifications, daily business summaries on WhatsApp and document processing, built around how your business works.",
    lead: "We automate the routine messages and paperwork that slow a business down: customer order alerts, dispatch notifications, daily summaries on WhatsApp and document processing.",
    body: [
      "In a growing business, a lot of time goes into telling people what just happened: the order is confirmed, the consignment has left, the numbers for the day are in. These are the same messages every day, and they can send themselves.",
      "We build automations around your actual workflow, on their own or as part of a custom system, so your team stops copying information from one place to another.",
    ],
    includes: [
      {
        title: "Customer order alerts",
        text: "Customers receive order updates automatically, without anyone typing them.",
      },
      {
        title: "Dispatch notifications",
        text: "A message goes out the moment a consignment is dispatched.",
      },
      {
        title: "Daily business summary",
        text: "Owners receive the daily sales, pending dispatches and low-stock alerts on WhatsApp.",
      },
      {
        title: "Document processing",
        text: "Routine documents are processed automatically instead of by hand.",
      },
    ],
    fit: [
      "Your team sends the same updates to customers by hand every day.",
      "Owners wait for someone to compile the daily numbers.",
      "Staff re-type information from documents into another system.",
    ],
    faqs: [
      {
        q: "Can it work with a custom ERP?",
        a: "Yes. Automations can be part of a custom operations system, for example low-stock alerts and a daily business summary on WhatsApp.",
      },
      {
        q: "How quickly can we start?",
        a: "Send a short brief and you receive a scope breakdown and milestone estimate within 24 hours. Work is then delivered in 2-week sprints.",
      },
      {
        q: "Who owns the automation?",
        a: "You do. The source code and access are handed over to your team.",
      },
    ],
  },
  {
    slug: "motion-design",
    chip: "motion",
    face: 3,
    code: "04 // MOTION DESIGN",
    name: "Motion Design & Visual Assets",
    titleLead: "Motion design that makes your product",
    titleAccent: "stand out",
    metaTitle: "Motion Design & Product Animation",
    metaDescription:
      "Product animations, explainer reels and kinetic motion graphics that show what your product does. Designed by the same studio that builds your software.",
    lead: "We design crisp product animations, explainer reels and distinctive brand visuals that show what your product does in seconds.",
    body: [
      "Some things are easier to show than to explain. A short film can walk a customer through a product, a kinetic sequence can turn a set of numbers into a story, and a launch reel can give a new release the entrance it deserves.",
      "Because the same studio designs and engineers software, the motion work matches the product exactly, and it can be built straight into your website.",
    ],
    includes: [
      {
        title: "Product launch films",
        text: "A cinematic reveal of your product, for a launch or for your homepage.",
      },
      {
        title: "Kinetic motion graphics",
        text: "Type, shapes and numbers in motion, for explainers and short clips.",
      },
      {
        title: "Explainer reels",
        text: "Short walkthroughs that show how a product or a system works.",
      },
      {
        title: "Brand visuals",
        text: "A distinctive visual language that carries across web, product and film.",
      },
    ],
    fit: [
      "A product is hard to explain in words alone.",
      "A launch needs a film, not just a page.",
      "Your website and your videos look like they come from different companies.",
    ],
    faqs: [
      {
        q: "Can the motion work be used on our website?",
        a: "Yes. We design interactive web components as well as films, so motion can be built directly into the site.",
      },
      {
        q: "Do you only make videos?",
        a: "No. We also build the software and websites they belong to. One team covers design, engineering and motion.",
      },
    ],
  },
  {
    slug: "web-application-development",
    chip: "webapp",
    face: 4,
    code: "05 // WEB APPS",
    name: "Web Application Development",
    titleLead: "Web applications that load fast and are",
    titleAccent: "yours",
    titleTail: "to keep",
    metaTitle: "Web Application Development with Next.js",
    metaDescription:
      "Fast, modern web applications, portals and landing pages built with Next.js. Working releases every 2 weeks, 100% code ownership and no per-user fees.",
    lead: "We build modern, fast-loading web applications, portals and landing pages with Next.js and modern web standards.",
    body: [
      "A web application is software your customers or your team open in a browser: a portal, a dashboard, a booking or ordering system. It has to load instantly, work on a phone as well as a workstation, and keep working as the business grows.",
      "We architect the database, design the interface and write the code as one team. You see a working release every 2 weeks on a live staging link, and at launch the repositories, deployment configuration and database are handed over to you.",
    ],
    includes: [
      {
        title: "Portals for customers and staff",
        text: "Clean, fast interfaces for the people who use your system every day.",
      },
      {
        title: "Dashboards",
        text: "Live figures and summaries in one clear view.",
      },
      {
        title: "Landing pages",
        text: "Fast-loading pages built on the same modern stack.",
      },
      {
        title: "Search and speed",
        text: "Technical SEO and performance are engineered in from the start.",
      },
    ],
    fit: [
      "Your current system is slow, or only works properly on a desktop.",
      "You run a process on spreadsheets and email that needs a real tool.",
      "You want software you own, not a platform you rent.",
    ],
    faqs: [
      {
        q: "Which technology do you use?",
        a: "Next.js and modern web standards, delivered with clean Git repositories and Docker configurations.",
      },
      {
        q: "How long does a web application take?",
        a: "A typical build is delivered in 4 to 6 weeks, in 2-week sprints with a working release at the end of each.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Repositories, deployment configuration and database access are handed over to your team.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    chip: "mobile",
    face: 5,
    code: "06 // MOBILE",
    name: "Mobile App Development (iOS & Android)",
    titleLead: "Mobile apps for iOS and Android, from",
    titleAccent: "one",
    titleTail: "build",
    metaTitle: "Mobile App Development for iOS & Android",
    metaDescription:
      "Cross-platform mobile apps for field staff and customers, built once for iOS and Android. You own the code, with no per-user fees.",
    lead: "We build responsive, smooth cross-platform mobile apps for iOS and Android, for field staff or for your customers.",
    body: [
      "Cross-platform means one app is built and maintained for both iPhone and Android, instead of two separate projects. Your team in the field and your customers get the same app, whichever phone they carry.",
      "A mobile app works best when it is connected to the rest of your operation, so we can build it alongside a custom web system: the same data, in the office and on the road.",
    ],
    includes: [
      {
        title: "Apps for field staff",
        text: "Give teams outside the office the tools they need on their phone.",
      },
      {
        title: "Customer-facing apps",
        text: "A smooth, responsive experience for the people who buy from you.",
      },
      {
        title: "One build, two platforms",
        text: "A single cross-platform app for iOS and Android.",
      },
      {
        title: "Connected to your system",
        text: "Built to work with your custom web application or ERP.",
      },
    ],
    fit: [
      "Staff in the field report by phone calls and paper.",
      "Customers ask for an app, not just a website.",
      "You do not want to pay for two separate apps.",
    ],
    faqs: [
      {
        q: "Do you build for both iOS and Android?",
        a: "Yes. We build cross-platform apps that run on both from a single codebase.",
      },
      {
        q: "Can you build the web system as well?",
        a: "Yes. The same team builds web applications and custom ERP software, so the app and the system behind it are designed together.",
      },
      {
        q: "Who owns the app?",
        a: "You do. The source code is handed over to you.",
      },
    ],
  },
];

export const getService = (slug) => SERVICES.find((service) => service.slug === slug) || null;

// The four steps every project follows (the home page shows the same four)
export const PROJECT_STEPS = [
  {
    code: "01 // TALK",
    title: "Start with a conversation",
    text: "Send a short brief. You talk directly with the engineers and designers who will build your product, and receive a scope breakdown and milestone estimate within 24 hours.",
  },
  {
    code: "02 // SCOPE",
    title: "Clear milestones, honest pricing",
    text: "Every milestone has a defined scope and a predictable price in ₹ Lakhs, agreed before work begins. Zero hidden costs.",
  },
  {
    code: "03 // BUILD",
    title: "Working releases every 2 weeks",
    text: "We build in 2-week sprints and deploy testable software to a live staging environment, so your team can try features and give feedback in real time.",
  },
  {
    code: "04 // HAND OVER",
    title: "Launched, then fully yours",
    text: "We deploy to production and hand over the Git repositories, Docker configurations and complete database access.",
  },
];
