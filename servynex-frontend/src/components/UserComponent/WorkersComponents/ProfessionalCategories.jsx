// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   LightningChargeFill,
//   Droplet,
//   Brush,
//   PaletteFill,
//   Snow,
//   Hammer,
//   GearFill,
//   BugFill,
// } from "react-bootstrap-icons";

// const iconMap = {
//   electrician: LightningChargeFill,
//   plumber: Droplet,
//   cleaner: Brush,
//   painter: PaletteFill,
//   "ac technician": Snow,
//   carpenter: Hammer,
//   "appliance repair": GearFill,
//   "pest control": BugFill,
// };

// const ProfessionalCategories = ({ data = [] }) => {
//   return (
//     <section className="py-5">
//       <div className="container">
//         <h2
//           className="fw-bold mb-1"
//           style={{ color: "#0f1724", fontSize: "1.6rem" }}
//         >
//           Professional Categories
//         </h2>

//         <p className="text-secondary mb-4">
//           Experts across all your home service needs
//         </p>

//         <div className="row g-3">
//           {data.map((c) => {
//             const Icon = iconMap[c.name?.trim().toLowerCase()] || GearFill;

//             return (
//               <div className="col-6 col-md-3 col-lg-3" key={c._id}>
//                 <div
//                   className="rounded-3 p-3 h-100 text-center bg-white"
//                   style={{
//                     border: "1px solid #eef0f2",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <div
//                     className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
//                     style={{
//                       width: "48px",
//                       height: "48px",
//                       backgroundColor: "#e6f4ee",
//                     }}
//                   >
//                     <Icon size={22} color="#0e8a5f" />
//                   </div>

//                   <h6 className="fw-semibold mb-1" style={{ color: "#0f1724" }}>
//                     {c.name}
//                   </h6>

//                   <p
//                     className="text-secondary mb-0"
//                     style={{ fontSize: "0.8rem" }}
//                   >
//                     {c.professionalCount ?? 0}{" "}
//                     {c.professionalCount === 1
//                       ? "Professional"
//                       : "Professionals"}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProfessionalCategories;



import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightningChargeFill,
  Droplet,
  Brush,
  PaletteFill,
  Snow,
  Hammer,
  GearFill,
  BugFill,
} from "react-bootstrap-icons";

import { getMediaUrl } from "../../../utils/getMediaUrl";

const iconMap = {
  electrician: LightningChargeFill,
  plumber: Droplet,
  cleaner: Brush,
  painter: PaletteFill,
  "ac technician": Snow,
  carpenter: Hammer,
  "appliance repair": GearFill,
  "pest control": BugFill,
};

const ProfessionalCategories = ({ data = [] }) => {
  return (
    <section className="py-5">
      <div className="container">
        <h2
          className="fw-bold mb-1"
          style={{ color: "#0f1724", fontSize: "1.6rem" }}
        >
          Professional Categories
        </h2>

        <p className="text-secondary mb-4">
          Experts across all your home service needs
        </p>

        <div className="row g-3">
          {data.map((c) => {
            const Icon = iconMap[c.name?.trim().toLowerCase()] || GearFill;
            const imageUrl = getMediaUrl(c.image);

            return (
              <div className="col-6 col-md-3 col-lg-3" key={c._id}>
                <div
                  className="rounded-3 p-3 h-100 text-center bg-white"
                  style={{
                    border: "1px solid #eef0f2",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#e6f4ee",
                      overflow: "hidden",
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={c.name || "Category"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Icon size={22} color="#0e8a5f" />
                    )}
                  </div>

                  <h6
                    className="fw-semibold mb-1"
                    style={{ color: "#0f1724" }}
                  >
                    {c.name}
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.8rem" }}
                  >
                    {c.professionalCount ?? 0}{" "}
                    {c.professionalCount === 1
                      ? "Professional"
                      : "Professionals"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalCategories;