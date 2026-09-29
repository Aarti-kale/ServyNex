export const DEFAULT_WEBSITE_SETTINGS = {
  key: "global",

  navbar: {
    logo: "",

    logoLink: "/",

    menuItems: [
      {
        label: "Home",
        href: "/",
        isActive: true,
        order: 1,
      },
      {
        label: "Services",
        href: "/services",
        isActive: true,
        order: 2,
      },
      {
        label: "Workers",
        href: "/workers",
        isActive: true,
        order: 3,
      },
      {
        label: "About Us",
        href: "/about",
        isActive: true,
        order: 4,
      },
      {
        label: "Contact",
        href: "/contact",
        isActive: true,
        order: 5,
      },
    ],

    loginButton: {
      enabled: true,
      text: "Log In",
      link: "/login",
    },

    signupButton: {
      enabled: true,
      text: "Sign Up",
      link: "/signup",
    },

    isActive: true,
  },

  footer: {
    logo: "",

    description:
      "ServyNex is your trusted partner for home services. We connect you with verified professionals to make your life easier.",

    socialLinks: [
      {
        platform: "Facebook",
        url: "#",
        icon: "facebook",
        isActive: true,
        order: 1,
      },
      {
        platform: "Instagram",
        url: "#",
        icon: "instagram",
        isActive: true,
        order: 2,
      },
      {
        platform: "Twitter",
        url: "#",
        icon: "twitter",
        isActive: true,
        order: 3,
      },
      {
        platform: "YouTube",
        url: "#",
        icon: "youtube",
        isActive: true,
        order: 4,
      },
    ],

    columns: [
      {
        title: "Quick Links",
        order: 1,
        isActive: true,
        links: [
          {
            label: "Home",
            href: "/",
            isActive: true,
            order: 1,
          },
          {
            label: "Services",
            href: "/services",
            isActive: true,
            order: 2,
          },
          {
            label: "Workers",
            href: "/workers",
            isActive: true,
            order: 3,
          },
          {
            label: "About Us",
            href: "/about",
            isActive: true,
            order: 4,
          },
          {
            label: "Contact",
            href: "/contact",
            isActive: true,
            order: 5,
          },
        ],
      },

      {
        title: "For Customers",
        order: 2,
        isActive: true,
        links: [
          {
            label: "How It Works",
            href: "/how-it-works",
            isActive: true,
            order: 1,
          },
          {
            label: "Book a Service",
            href: "/services",
            isActive: true,
            order: 2,
          },
          {
            label: "My Bookings",
            href: "/bookings",
            isActive: true,
            order: 3,
          },
          {
            label: "Help & Support",
            href: "/contact",
            isActive: true,
            order: 4,
          },
          {
            label: "Terms & Conditions",
            href: "/terms",
            isActive: true,
            order: 5,
          },
        ],
      },

      {
        title: "For Professionals",
        order: 3,
        isActive: true,
        links: [
          {
            label: "Become a Professional",
            href: "/become-professional",
            isActive: true,
            order: 1,
          },
          {
            label: "Professional Login",
            href: "/professional/login",
            isActive: true,
            order: 2,
          },
          {
            label: "Training & Guidelines",
            href: "/professional/guidelines",
            isActive: true,
            order: 3,
          },
          {
            label: "FAQs",
            href: "/faqs",
            isActive: true,
            order: 4,
          },
        ],
      },
    ],

    contact: {
      title: "Contact Us",
      phone: "+91 98765 43210",
      email: "support@servynex.com",
      address: "123, Green Park, New Delhi, India - 110016",
    },

    copyright: "© 2024 ServyNex. All rights reserved.",

    isActive: true,
  },
};
