export const SITE = {
  website: "https://jaemin96.github.io", // replace this with your deployed domain
  author: "Jaemin Kim",
  profile: "https://github.com/jaemin96",
  desc: "A simple and minimal blog to share my thoughts, projects, and notes",
  title: "Jaemin.dev",
  ogImage: "jaemin96-og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/jaemin96/jaemin96.github.io/edit/main",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Seoul",
} as const;
