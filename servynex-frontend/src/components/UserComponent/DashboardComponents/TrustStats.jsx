import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ShieldFillCheck,
  PeopleFill,
  EmojiSmileFill,
  HeadsetVr,
} from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const stats = [
  {
    icon: <ShieldFillCheck size={22} color="#0e8a5f" />,
    title: "100% Secure",
    desc: "Your data is always protected",
  },
  {
    icon: <PeopleFill size={22} color="#0e8a5f" />,
    title: "Trusted Professionals",
    desc: "Background verified experts",
  },
  {
    icon: <EmojiSmileFill size={22} color="#0e8a5f" />,
    title: "10K+ Happy Customers",
    desc: "Quality service you can trust",
  },
  {
    icon: <HeadsetVr size={22} color="#0e8a5f" />,
    title: "24/7 Support",
    desc: "We are here to help you anytime",
  },
];

const TrustStats = () => {
  return (
    <section className="py-4" style={{ backgroundColor: "#eef7f3" }}>
      <div className="container">
        <div className="row g-4">
          {stats.map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="d-flex align-items-start gap-2">
                <div className="flex-shrink-0">{s.icon}</div>
                <div>
                  <h6
                    className="fw-semibold mb-1"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    {s.title}
                  </h6>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
