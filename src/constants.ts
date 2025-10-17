import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
// import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/jaemin96",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  // {
  //   name: "LinkedIn",
  //   href: "https://www.linkedin.com/in/username/",
  //   linkTitle: `${SITE.title} on LinkedIn`,
  //   icon: IconLinkedin,
  // },
  {
    name: "Mail",
    href: "mailto:lemon__96@naver.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
