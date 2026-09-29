import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ImageFill,
  PeopleFill,
  PersonFill,
  ListUl,
  ChatSquareTextFill,
  ChevronRight,
} from "react-bootstrap-icons";

const updates = [
  {
    title: "Home Banner Updated",
    desc: "Main slider banner changed",
    time: "2 min ago",
    icon: <ImageFill size={17} color="#0e8a5f" />,
  },
  {
    title: "Services Section Updated",
    desc: "Plumbing service content updated",
    time: "1 hour ago",
    icon: <PeopleFill size={17} color="#0e8a5f" />,
  },
  {
    title: "About Us Content Updated",
    desc: "Team section content modified",
    time: "3 hours ago",
    icon: <PersonFill size={17} color="#0e8a5f" />,
  },
  {
    title: "Footer Links Updated",
    desc: "Quick links section updated",
    time: "5 hours ago",
    icon: <ListUl size={17} color="#0e8a5f" />,
  },
  {
    title: "New Testimonial Added",
    desc: "Customer review added",
    time: "1 day ago",
    icon: <ChatSquareTextFill size={17} color="#0e8a5f" />,
  },
];

const RecentUpdatesCard = ({ onViewAll }) => {
  return (
    <div
      className="rounded-4 bg-white p-4 h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h6 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
        Recent Updates
      </h6>
      <p className="text-secondary mb-3" style={{ fontSize: "0.82rem" }}>
        Latest content updates
      </p>

      <div className="flex-grow-1">
        {updates.map((u, i) => (
          <div key={i}>
            <div className="d-flex align-items-start gap-3 py-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{
                  width: "38px",
                  height: "38px",
                  backgroundColor: "#e6f4ee",
                }}
              >
                {u.icon}
              </div>
              <div className="flex-grow-1">
                <p
                  className="fw-semibold mb-0"
                  style={{ color: "#0f1724", fontSize: "0.88rem" }}
                >
                  {u.title}
                </p>
                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.8rem" }}
                >
                  {u.desc}
                </p>
              </div>
              <span
                className="text-secondary flex-shrink-0"
                style={{ fontSize: "0.78rem" }}
              >
                {u.time}
              </span>
            </div>
            {i !== updates.length - 1 && <hr className="my-1" />}
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium mt-2"
        style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
      >
        View All Updates <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default RecentUpdatesCard;
