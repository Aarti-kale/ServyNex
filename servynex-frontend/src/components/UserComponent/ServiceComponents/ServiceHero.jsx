// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// import {
//   PatchCheckFill,
//   ArrowRight,
//   PersonPlusFill,
//   ShieldCheck,
//   LockFill,
//   HandThumbsUpFill,
//   PeopleFill,
//   StarFill,
//   BriefcaseFill,
// } from "react-bootstrap-icons";

// import { useNavigate } from "react-router-dom";

// import getMediaUrl from "../../../utils/getMediaUrl";

// const trustPoints = [
//   {
//     icon: <ShieldCheck size={14} />,
//     text: "Verified Professionals",
//   },
//   {
//     icon: <LockFill size={14} />,
//     text: "Secure Booking",
//   },
//   {
//     icon: <HandThumbsUpFill size={14} />,
//     text: "Satisfaction Guaranteed",
//   },
// ];

// const ServiceHero = ({ data = {} }) => {
//   const navigate = useNavigate();

//   const hero = {
//     badge: data.badge || "",

//     title: data.title || "",

//     highlightedTitle: data.highlightedTitle || "",

//     description: data.description || "",

//     primaryButton: {
//       text: data.primaryButton?.text || "",

//       link: data.primaryButton?.link || "",
//     },

//     secondaryButton: {
//       text: data.secondaryButton?.text || "",

//       link: data.secondaryButton?.link || "",
//     },

//     image: data.image || "",
//   };

//   const imageUrl = hero.image ? getMediaUrl(hero.image) : "";

//   const handleNavigation = (link) => {
//     if (!link) {
//       return;
//     }

//     if (/^https?:\/\//i.test(link)) {
//       window.location.href = link;
//       return;
//     }

//     navigate(link);
//   };

//   return (
//     <section
//       className="py-5"
//       style={{
//         backgroundColor: "#eef7f3",
//       }}
//     >
//       <div className="container py-3">
//         <div className="row align-items-center g-5">
//           <div className="col-lg-6">
//             {hero.badge && (
//               <span
//                 className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
//                 style={{
//                   backgroundColor: "#ffffff",

//                   color: "#0e8a5f",

//                   fontSize: "0.8rem",
//                 }}
//               >
//                 <PatchCheckFill size={14} />

//                 {hero.badge}
//               </span>
//             )}

//             <h1
//               className="fw-bold mb-3"
//               style={{
//                 color: "#0f1724",

//                 fontSize: "2.75rem",

//                 lineHeight: 1.15,
//               }}
//             >
//               {hero.title}

//               {hero.highlightedTitle && (
//                 <>
//                   <br />

//                   <span
//                     style={{
//                       color: "#0e8a5f",
//                     }}
//                   >
//                     {hero.highlightedTitle}
//                   </span>
//                 </>
//               )}
//             </h1>

//             {hero.description && (
//               <p
//                 className="text-secondary mb-4"
//                 style={{
//                   maxWidth: "480px",

//                   fontSize: "1rem",
//                 }}
//               >
//                 {hero.description}
//               </p>
//             )}

//             <div className="d-flex flex-wrap gap-3 mb-4">
//               {hero.primaryButton.text && hero.primaryButton.link && (
//                 <button
//                   type="button"
//                   onClick={() => handleNavigation(hero.primaryButton.link)}
//                   className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
//                   style={{
//                     backgroundColor: "#0e8a5f",
//                   }}
//                 >
//                   {hero.primaryButton.text}

//                   <ArrowRight />
//                 </button>
//               )}

//               {hero.secondaryButton.text && hero.secondaryButton.link && (
//                 <button
//                   type="button"
//                   onClick={() => handleNavigation(hero.secondaryButton.link)}
//                   className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
//                   style={{
//                     border: "1.5px solid #d1d5db",

//                     color: "#0f1724",
//                   }}
//                 >
//                   {hero.secondaryButton.text}

//                   <PersonPlusFill />
//                 </button>
//               )}
//             </div>

//             <div className="d-flex flex-wrap gap-4">
//               {trustPoints.map((point, index) => (
//                 <div
//                   className="d-flex align-items-center gap-2 text-secondary small"
//                   key={index}
//                 >
//                   <span
//                     style={{
//                       color: "#0e8a5f",
//                     }}
//                   >
//                     {point.icon}
//                   </span>

//                   {point.text}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="col-lg-6 position-relative">
//             <div
//               className="rounded-4 overflow-hidden position-relative"
//               style={{
//                 backgroundColor: "#eef7f3",

//                 minHeight: "380px",
//               }}
//             >
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt={hero.title || "ServyNex Services"}
//                   className="w-100 h-100"
//                   style={{
//                     objectFit: "cover",
//                   }}
//                 />
//               ) : (
//                 <div
//                   className="w-100 h-100 d-flex align-items-center justify-content-center"
//                   style={{
//                     minHeight: "380px",

//                     color: "#7a8a82",
//                   }}
//                 >
//                   <span>No hero image available</span>
//                 </div>
//               )}
//             </div>

//             <div
//               className="d-flex gap-2 position-absolute w-100 px-2"
//               style={{
//                 bottom: "-28px",

//                 left: 0,
//               }}
//             >
//               <div
//                 className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
//                 style={{
//                   border: "1px solid #eef0f2",
//                 }}
//               >
//                 <div className="d-flex justify-content-center mb-1">
//                   <PeopleFill size={16} color="#0e8a5f" />
//                 </div>

//                 <div
//                   className="fw-bold"
//                   style={{
//                     fontSize: "0.95rem",

//                     color: "#0f1724",
//                   }}
//                 >
//                   10K+
//                 </div>

//                 <div
//                   className="text-secondary"
//                   style={{
//                     fontSize: "0.7rem",
//                   }}
//                 >
//                   Happy Customers
//                 </div>
//               </div>

//               <div
//                 className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
//                 style={{
//                   border: "1px solid #eef0f2",
//                 }}
//               >
//                 <div className="d-flex justify-content-center mb-1">
//                   <StarFill size={16} color="#f5b301" />
//                 </div>

//                 <div
//                   className="fw-bold"
//                   style={{
//                     fontSize: "0.95rem",

//                     color: "#0f1724",
//                   }}
//                 >
//                   4.9
//                 </div>

//                 <div
//                   className="text-secondary"
//                   style={{
//                     fontSize: "0.7rem",
//                   }}
//                 >
//                   Average Rating
//                 </div>
//               </div>

//               <div
//                 className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
//                 style={{
//                   border: "1px solid #eef0f2",
//                 }}
//               >
//                 <div className="d-flex justify-content-center mb-1">
//                   <BriefcaseFill size={16} color="#0e8a5f" />
//                 </div>

//                 <div
//                   className="fw-bold"
//                   style={{
//                     fontSize: "0.95rem",

//                     color: "#0f1724",
//                   }}
//                 >
//                   500+
//                 </div>

//                 <div
//                   className="text-secondary"
//                   style={{
//                     fontSize: "0.7rem",
//                   }}
//                 >
//                   Active Workers
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServiceHero;
    
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PatchCheckFill,
  ArrowRight,
  PersonPlusFill,
  ShieldCheck,
  LockFill,
  HandThumbsUpFill,
  PeopleFill,
  StarFill,
  BriefcaseFill,
} from "react-bootstrap-icons";

import { useNavigate } from "react-router-dom";

import getMediaUrl from "../../../utils/getMediaUrl";

const trustPoints = [
  {
    icon: <ShieldCheck size={14} />,
    text: "Verified Professionals",
  },
  {
    icon: <LockFill size={14} />,
    text: "Secure Booking",
  },
  {
    icon: <HandThumbsUpFill size={14} />,
    text: "Satisfaction Guaranteed",
  },
];

const ServiceHero = ({ data = {} }) => {
  const navigate = useNavigate();

  const hero = {
    badge: data.badge || "",
    title: data.title || "",
    highlightedTitle: data.highlightedTitle || "",
    description: data.description || "",
    primaryButton: {
      text: data.primaryButton?.text || "",
      link: data.primaryButton?.link || "",
    },
    secondaryButton: {
      text: data.secondaryButton?.text || "",
      link: data.secondaryButton?.link || "",
    },
    image: data.image || "",
  };

  const imageUrl = hero.image ? getMediaUrl(hero.image) : "";

  const handleNavigation = (link) => {
    if (!link) {
      return;
    }

    if (/^https?:\/\//i.test(link)) {
      window.location.href = link;
      return;
    }

    navigate(link);
  };

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#eef7f3",
      }}
    >
      <div className="container py-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            {hero.badge && (
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0e8a5f",
                  fontSize: "0.8rem",
                }}
              >
                <PatchCheckFill size={14} />
                {hero.badge}
              </span>
            )}

            <h1
              className="fw-bold mb-3"
              style={{
                color: "#0f1724",
                fontSize: "2.75rem",
                lineHeight: 1.15,
              }}
            >
              {hero.title}

              {hero.highlightedTitle && (
                <>
                  <br />
                  <span
                    style={{
                      color: "#0e8a5f",
                    }}
                  >
                    {hero.highlightedTitle}
                  </span>
                </>
              )}
            </h1>

            {hero.description && (
              <p
                className="text-secondary mb-4"
                style={{
                  maxWidth: "480px",
                  fontSize: "1rem",
                }}
              >
                {hero.description}
              </p>
            )}

            <div className="d-flex flex-wrap gap-3 mb-4">
              {hero.primaryButton.text && hero.primaryButton.link && (
                <button
                  type="button"
                  onClick={() =>
                    handleNavigation(hero.primaryButton.link)
                  }
                  className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                  style={{
                    backgroundColor: "#0e8a5f",
                  }}
                >
                  {hero.primaryButton.text}
                  <ArrowRight />
                </button>
              )}

              {hero.secondaryButton.text &&
                hero.secondaryButton.link && (
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(hero.secondaryButton.link)
                    }
                    className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                    style={{
                      border: "1.5px solid #d1d5db",
                      color: "#0f1724",
                    }}
                  >
                    {hero.secondaryButton.text}
                    <PersonPlusFill />
                  </button>
                )}
            </div>

            <div className="d-flex flex-wrap gap-4">
              {trustPoints.map((point, index) => (
                <div
                  className="d-flex align-items-center gap-2 text-secondary small"
                  key={index}
                >
                  <span
                    style={{
                      color: "#0e8a5f",
                    }}
                  >
                    {point.icon}
                  </span>

                  {point.text}
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6 position-relative">
            {imageUrl ? (
              <div className="rounded-4 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={hero.title || "ServyNex Services"}
                  className="w-100"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div
                className="rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#eef7f3",
                  minHeight: "380px",
                  color: "#7a8a82",
                }}
              >
                <span>No hero image available</span>
              </div>
            )}

            <div
              className="d-flex gap-2 position-absolute w-100 px-2"
              style={{
                bottom: "-28px",
                left: 0,
              }}
            >
              <div
                className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="d-flex justify-content-center mb-1">
                  <PeopleFill size={16} color="#0e8a5f" />
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "0.95rem",
                    color: "#0f1724",
                  }}
                >
                  10K+
                </div>

                <div
                  className="text-secondary"
                  style={{
                    fontSize: "0.7rem",
                  }}
                >
                  Happy Customers
                </div>
              </div>

              <div
                className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="d-flex justify-content-center mb-1">
                  <StarFill size={16} color="#f5b301" />
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "0.95rem",
                    color: "#0f1724",
                  }}
                >
                  4.9
                </div>

                <div
                  className="text-secondary"
                  style={{
                    fontSize: "0.7rem",
                  }}
                >
                  Average Rating
                </div>
              </div>

              <div
                className="bg-white rounded-3 shadow-sm p-3 flex-fill text-center"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="d-flex justify-content-center mb-1">
                  <BriefcaseFill size={16} color="#0e8a5f" />
                </div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "0.95rem",
                    color: "#0f1724",
                  }}
                >
                  500+
                </div>

                <div
                  className="text-secondary"
                  style={{
                    fontSize: "0.7rem",
                  }}
                >
                  Active Workers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
