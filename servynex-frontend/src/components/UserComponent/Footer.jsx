import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HouseFill,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  TelephoneFill,
  EnvelopeFill,
  GeoAltFill,
} from "react-bootstrap-icons";

import API from "../../api/api.js";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const fallbackFooter = {
  isActive: true,
  logo: "",
  description:
    "ServyNex is your trusted partner for home services. We connect you with verified professionals to make your life easier.",

  socialLinks: [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "youtube", url: "#" },
  ],

  columns: [
    {
      title: "Quick Links",
      order: 1,
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Workers", href: "/workers" },
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "For Customers",
      order: 2,
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "Book a Service", href: "/services" },
        { label: "My Bookings", href: "/customer-dashboard" },
        { label: "Help & Support", href: "/contact" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
    {
      title: "For Professionals",
      order: 3,
      links: [
        {
          label: "Become a Professional",
          href: "/professional-registration",
        },
        {
          label: "Professional Login",
          href: "/professional-login",
        },
        {
          label: "Training & Guidelines",
          href: "/professional-guidelines",
        },
        {
          label: "FAQs",
          href: "/faqs",
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
};

const Footer = () => {
  const [footer, setFooter] = useState(fallbackFooter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFooter = async () => {
      try {
        const response = await API.get("/site-settings");
        const data = response.data?.data;

        if (isMounted && data?.footer) {
          setFooter({
            ...fallbackFooter,
            ...data.footer,
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFooter();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && footer?.isActive === false) {
    return null;
  }

  const columns = [...(footer.columns || [])].sort(
    (a, b) => Number(a.order || 0) - Number(b.order || 0)
  );

  const socialLinks = footer.socialLinks || [];

  return (
    <footer
      className="pt-5 pb-4"
      style={{
        backgroundColor: "#fff",
        borderTop: "1px solid #eef0f2",
      }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-5 col-lg-4">
            <Link
              to="/"
              className="d-flex align-items-center gap-2 fw-bold fs-5 mb-3 text-decoration-none"
            >
              {footer.logo ? (
                <img
                  src={footer.logo}
                  alt="ServyNex"
                  className="img-fluid"
                  style={{
                    maxWidth: "140px",
                    maxHeight: "40px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <>
                  <span
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#0e8a5f",
                    }}
                  >
                    <HouseFill color="#fff" size={16} />
                  </span>

                  <span style={{ color: "#0f1724" }}>ServyNex</span>
                </>
              )}
            </Link>

            <p
              className="text-secondary mb-3"
              style={{
                fontSize: "0.9rem",
                maxWidth: "360px",
                lineHeight: "1.7",
              }}
            >
              {footer.description}
            </p>

            <div className="d-flex flex-wrap gap-2">
              {socialLinks.map((social, index) => {
                const platform = String(social.platform || "").toLowerCase();

                const Icon = socialIcons[platform];

                if (!Icon) {
                  return null;
                }

                const hasUrl = social.url && social.url !== "#";

                return (
                  <a
                    key={`${platform}-${index}`}
                    href={social.url || "#"}
                    target={hasUrl ? "_blank" : undefined}
                    rel={hasUrl ? "noopener noreferrer" : undefined}
                    aria-label={social.platform}
                    className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#f3f4f6",
                      color: "#0f1724",
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((column, columnIndex) => (
            <div
              className="col-6 col-md-3 col-lg-2"
              key={`${column.title}-${columnIndex}`}
            >
              <h6 className="fw-semibold mb-3" style={{ color: "#0f1724" }}>
                {column.title}
              </h6>

              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                {(column.links || []).map((link, linkIndex) => (
                  <li key={`${link.label}-${linkIndex}`}>
                    <Link
                      to={link.href || "#"}
                      className="text-secondary text-decoration-none"
                      style={{
                        fontSize: "0.88rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-12 col-md-6 col-lg-2">
            <h6 className="fw-semibold mb-3" style={{ color: "#0f1724" }}>
              {footer.contact?.title || "Contact Us"}
            </h6>

            <ul
              className="list-unstyled d-flex flex-column gap-3 mb-0"
              style={{ fontSize: "0.85rem" }}
            >
              {footer.contact?.phone && (
                <li className="d-flex align-items-start gap-2 text-secondary">
                  <TelephoneFill size={14} className="mt-1 flex-shrink-0" />
                  <span className="text-break">{footer.contact.phone}</span>
                </li>
              )}

              {footer.contact?.email && (
                <li className="d-flex align-items-start gap-2 text-secondary">
                  <EnvelopeFill size={14} className="mt-1 flex-shrink-0" />
                  <span className="text-break">{footer.contact.email}</span>
                </li>
              )}

              {footer.contact?.address && (
                <li className="d-flex align-items-start gap-2 text-secondary">
                  <GeoAltFill size={14} className="mt-1 flex-shrink-0" />
                  <span className="text-break">{footer.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <p
          className="text-center text-secondary mb-0"
          style={{
            fontSize: "0.85rem",
            lineHeight: "1.5",
          }}
        >
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
