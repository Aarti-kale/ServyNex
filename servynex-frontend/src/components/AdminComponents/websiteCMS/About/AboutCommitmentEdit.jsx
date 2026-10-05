// import React, { useEffect, useRef, useState } from "react";

// import "bootstrap/dist/css/bootstrap.min.css";

// import {
//   ArrowClockwise,
//   CheckCircleFill,
//   ClockFill,
//   CloudUpload,
//   FloppyFill,
//   GripVertical,
//   PlusLg,
//   ShieldFillCheck,
//   TagFill,
//   Trash3Fill,
//   CurrencyDollar,
//   PersonCheckFill,
// } from "react-bootstrap-icons";

// import getMediaUrl from "../../../../utils/getMediaUrl.jsx";

// const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

// const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
// const uploadCommitmentImage = async (file) => {
//   if (!(file instanceof File)) {
//     throw new Error("Invalid image file.");
//   }

//   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

//   const formData = new FormData();
//   formData.append("image", file);

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${apiUrl.replace(/\/$/, "")}/admin/upload/image`,
//     {
//       method: "POST",
//       credentials: "include",
//       ...(token
//         ? {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         : {}),
//       body: formData,
//     }
//   );

//   const result = await response.json().catch(() => ({}));

//   if (!response.ok || !result?.success) {
//     throw new Error(result?.message || "Image upload failed.");
//   }

//   const imageUrl = result?.data?.url;

//   if (!imageUrl) {
//     throw new Error("Image uploaded but backend did not return image URL.");
//   }

//   return imageUrl;
// };

// const ICON_OPTIONS = {
//   shield: {
//     label: "Shield",
//     component: ShieldFillCheck,
//   },

//   clock: {
//     label: "Clock",
//     component: ClockFill,
//   },

//   price: {
//     label: "Price",
//     component: CurrencyDollar,
//   },

//   user: {
//     label: "User",
//     component: PersonCheckFill,
//   },

//   tag: {
//     label: "Tag",
//     component: TagFill,
//   },
// };

// const DEFAULT_COMMITMENT = {
//   title: "Our Commitment",

//   description:
//     "We are committed to creating a safe, reliable and delightful experience for every customer, every time.",

//   points: [
//     {
//       title: "Verified & skilled professionals",
//       icon: "shield",
//     },
//     {
//       title: "On-time & dependable service",
//       icon: "clock",
//     },
//     {
//       title: "Transparent & fair pricing",
//       icon: "price",
//     },
//   ],

//   image: "",
// };

// const normalizeData = (data) => {
//   const points = Array.isArray(data?.points)
//     ? data.points
//     : DEFAULT_COMMITMENT.points;

//   return {
//     title: data?.title || DEFAULT_COMMITMENT.title,

//     description: data?.description || DEFAULT_COMMITMENT.description,

//     points: points.map((point) => ({
//       _id: point?._id,

//       title: point?.title || "",

//       icon: point?.icon && ICON_OPTIONS[point.icon] ? point.icon : "shield",
//     })),

//     image: typeof data?.image === "string" ? data.image : "",

//     imageFile: data?.imageFile instanceof File ? data.imageFile : null,
//   };
// };

// const createEmptyPoint = () => ({
//   title: "",
//   icon: "shield",
// });

// const AboutCommitmentEdit = ({
//   data = {},
//   onChange,
//   onSave,
//   onReset,
//   saving = false,
// }) => {
//   const [form, setForm] = useState(() => normalizeData(data));

//   const [imagePreview, setImagePreview] = useState("");

//   const [imageError, setImageError] = useState("");

//   const [draggedIndex, setDraggedIndex] = useState(null);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const normalized = normalizeData(data);

//     setForm(normalized);

//     setImagePreview(normalized.image ? getMediaUrl(normalized.image) : "");

//     setImageError("");
//   }, [data]);

//   const updateForm = (updates) => {
//     setForm((previousForm) => {
//       const updatedForm = {
//         ...previousForm,
//         ...updates,
//       };

//       onChange?.(updatedForm);

//       return updatedForm;
//     });
//   };

//   const updatePoint = (index, updates) => {
//     setForm((previousForm) => {
//       const points = [...previousForm.points];

//       points[index] = {
//         ...points[index],
//         ...updates,
//       };

//       const updatedForm = {
//         ...previousForm,
//         points,
//       };

//       onChange?.(updatedForm);

//       return updatedForm;
//     });
//   };

//   const handleAddPoint = () => {
//     setForm((previousForm) => {
//       const updatedForm = {
//         ...previousForm,

//         points: [...previousForm.points, createEmptyPoint()],
//       };

//       onChange?.(updatedForm);

//       return updatedForm;
//     });
//   };

//   const handleDeletePoint = (index) => {
//     if (saving) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to remove this commitment point?"
//     );

//     if (!confirmed) return;

//     setForm((previousForm) => {
//       const points = previousForm.points.filter(
//         (_, pointIndex) => pointIndex !== index
//       );

//       const updatedForm = {
//         ...previousForm,
//         points,
//       };

//       onChange?.(updatedForm);

//       return updatedForm;
//     });
//   };

//   const handleDragStart = (event, index) => {
//     if (saving) return;

//     setDraggedIndex(index);

//     event.dataTransfer.effectAllowed = "move";

//     event.dataTransfer.setData("text/plain", String(index));
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();

//     event.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (event, targetIndex) => {
//     event.preventDefault();

//     if (saving || draggedIndex === null || draggedIndex === targetIndex) {
//       setDraggedIndex(null);
//       return;
//     }

//     setForm((previousForm) => {
//       const points = [...previousForm.points];

//       const [movedPoint] = points.splice(draggedIndex, 1);

//       points.splice(targetIndex, 0, movedPoint);

//       const updatedForm = {
//         ...previousForm,
//         points,
//       };

//       onChange?.(updatedForm);

//       return updatedForm;
//     });

//     setDraggedIndex(null);
//   };

//   const handleDragEnd = () => {
//     setDraggedIndex(null);
//   };

//   const handleUploadAreaClick = () => {
//     if (saving) return;

//     fileInputRef.current?.click();
//   };

//   const handleImageChange = async (event) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     setImageError("");

//     if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
//       setImageError("Only JPG, PNG and WEBP images are allowed.");
//       event.target.value = "";
//       return;
//     }

//     if (file.size > MAX_IMAGE_SIZE) {
//       setImageError("Image size must be less than 2MB.");
//       event.target.value = "";
//       return;
//     }

//     if (saving) {
//       event.target.value = "";
//       return;
//     }

//     try {
//       const uploadedImageUrl = await uploadCommitmentImage(file);

//       const permanentPreview = getMediaUrl(uploadedImageUrl);

//       setImagePreview(permanentPreview);

//       updateForm({
//         image: uploadedImageUrl,
//         imageFile: null,
//       });
//     } catch (error) {
//       console.error("[AboutCommitment] IMAGE UPLOAD FAILED:", error);

//       setImageError(error?.message || "Image upload failed. Please try again.");
//     } finally {
//       event.target.value = "";
//     }
//   };

//   const handleRemoveImage = () => {
//     if (saving) return;

//     setImagePreview("");

//     updateForm({
//       image: "",
//       imageFile: null,
//     });

//     setImageError("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSave = () => {
//     const normalizedData = normalizeData(form);

//     if (!normalizedData.title.trim()) {
//       window.alert("Section title is required.");

//       return;
//     }

//     if (!normalizedData.description.trim()) {
//       window.alert("Description is required.");

//       return;
//     }

//     if (normalizedData.points.length === 0) {
//       window.alert("Please add at least one commitment point.");

//       return;
//     }

//     const invalidPoint = normalizedData.points.find(
//       (point) => !point.title.trim()
//     );

//     if (invalidPoint) {
//       window.alert("Every commitment point must have a title.");

//       return;
//     }

//     const payload = {
//       title: normalizedData.title.trim(),

//       description: normalizedData.description.trim(),

//       points: normalizedData.points.map((point) => ({
//         ...(point._id
//           ? {
//               _id: point._id,
//             }
//           : {}),

//         title: point.title.trim(),

//         icon: point.icon || "shield",
//       })),

//       image: normalizedData.image || "",
//     };

//     onSave?.(payload);
//   };

//   const renderIcon = (iconName, size = 21) => {
//     const option = ICON_OPTIONS[iconName] || ICON_OPTIONS.shield;

//     const IconComponent = option.component;

//     return <IconComponent size={size} color="#168653" />;
//   };

//   return (
//     <div
//       className="rounded-4 bg-white overflow-hidden"
//       style={{
//         border: "1px solid #e4ece7",
//         boxShadow: "0 5px 20px rgba(22, 134, 83, 0.05)",
//       }}
//     >
//       <div
//         className="px-4 py-3"
//         style={{
//           borderBottom: "1px solid #e5ece8",
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <div className="d-flex align-items-center gap-2">
//               <h5
//                 className="mb-0 fw-semibold"
//                 style={{
//                   color: "#172b4d",
//                 }}
//               >
//                 Our Commitment Section
//               </h5>

//               <span
//                 className="px-2 py-1 rounded-pill small fw-medium"
//                 style={{
//                   background: "#e7f7ef",
//                   color: "#168653",
//                 }}
//               >
//                 <CheckCircleFill size={11} className="me-1" />
//                 Active
//               </span>
//             </div>

//             <p
//               className="mb-0 mt-1 small"
//               style={{
//                 color: "#718096",
//               }}
//             >
//               Update the commitment section and settings for this section
//             </p>
//           </div>

//           <button
//             type="button"
//             className="btn btn-sm"
//             disabled={saving}
//             style={{
//               minHeight: "38px",
//               padding: "0 14px",
//               background: "#ffffff",
//               color: "#26364a",
//               border: "1px solid #dce6e0",
//               borderRadius: "8px",
//             }}
//           >
//             Collapse
//             <span className="ms-2">˄</span>
//           </button>
//         </div>
//       </div>

//       <div className="p-4">
//         <div
//           className="d-flex gap-2 mb-4"
//           style={{
//             borderBottom: "1px solid #e6ece8",
//             paddingBottom: "12px",
//           }}
//         >
//           <button
//             type="button"
//             className="btn px-4"
//             style={{
//               minHeight: "40px",
//               background: "#168653",
//               color: "#ffffff",
//               border: "1px solid #168653",
//               borderRadius: "8px",
//               fontWeight: 500,
//             }}
//           >
//             Content
//           </button>

//           <button
//             type="button"
//             className="btn px-4"
//             disabled
//             style={{
//               minHeight: "40px",
//               background: "#ffffff",
//               color: "#536274",
//               border: "1px solid #dce6e0",
//               borderRadius: "8px",
//               opacity: 1,
//             }}
//           >
//             Settings
//           </button>

//           <button
//             type="button"
//             className="btn px-4"
//             disabled
//             style={{
//               minHeight: "40px",
//               background: "#ffffff",
//               color: "#536274",
//               border: "1px solid #dce6e0",
//               borderRadius: "8px",
//               opacity: 1,
//             }}
//           >
//             Background
//           </button>
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="commitmentTitle"
//             className="form-label fw-semibold small mb-2"
//             style={{
//               color: "#26364a",
//             }}
//           >
//             Section Title
//             <span
//               className="ms-1"
//               style={{
//                 color: "#dc3545",
//               }}
//             >
//               *
//             </span>
//           </label>

//           <input
//             id="commitmentTitle"
//             type="text"
//             className="form-control"
//             value={form.title}
//             maxLength={100}
//             disabled={saving}
//             onChange={(event) =>
//               updateForm({
//                 title: event.target.value,
//               })
//             }
//             placeholder="Our Commitment"
//             style={{
//               minHeight: "46px",
//               borderColor: "#dce7df",
//               borderRadius: "9px",
//               boxShadow: "none",
//             }}
//           />

//           <div className="text-end mt-1">
//             <small className="text-secondary">{form.title.length}/100</small>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="commitmentDescription"
//             className="form-label fw-semibold small mb-2"
//             style={{
//               color: "#26364a",
//             }}
//           >
//             Description
//             <span
//               className="ms-1"
//               style={{
//                 color: "#dc3545",
//               }}
//             >
//               *
//             </span>
//           </label>

//           <textarea
//             id="commitmentDescription"
//             className="form-control"
//             value={form.description}
//             maxLength={1000}
//             rows={5}
//             disabled={saving}
//             onChange={(event) =>
//               updateForm({
//                 description: event.target.value,
//               })
//             }
//             placeholder="Enter commitment description..."
//             style={{
//               borderColor: "#dce7df",
//               borderRadius: "9px",
//               resize: "vertical",
//               boxShadow: "none",
//             }}
//           />

//           <div className="text-end mt-1">
//             <small className="text-secondary">
//               {form.description.length}
//               /1000
//             </small>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <label
//               className="form-label fw-semibold small mb-0"
//               style={{
//                 color: "#26364a",
//               }}
//             >
//               Commitment Points
//               <span
//                 className="ms-1"
//                 style={{
//                   color: "#dc3545",
//                 }}
//               >
//                 *
//               </span>
//             </label>

//             <small className="text-secondary">
//               {form.points.length}{" "}
//               {form.points.length === 1 ? "point" : "points"}
//             </small>
//           </div>

//           <div className="d-flex flex-column gap-2">
//             {form.points.map((point, index) => {
//               const isDragging = draggedIndex === index;

//               return (
//                 <div
//                   key={point._id || `commitment-point-${index}`}
//                   draggable={!saving}
//                   onDragStart={(event) => handleDragStart(event, index)}
//                   onDragOver={handleDragOver}
//                   onDrop={(event) => handleDrop(event, index)}
//                   onDragEnd={handleDragEnd}
//                   className="rounded-3"
//                   style={{
//                     border: "1px solid #dfe8e3",
//                     background: "#ffffff",
//                     opacity: isDragging ? 0.55 : 1,
//                     transition: "opacity 0.15s ease",
//                   }}
//                 >
//                   <div className="p-3">
//                     <div className="row g-3 align-items-center">
//                       <div className="col-auto">
//                         <GripVertical
//                           size={19}
//                           style={{
//                             color: "#8b9b92",
//                             cursor: saving ? "not-allowed" : "grab",
//                           }}
//                         />
//                       </div>

//                       {/* ICON */}
//                       <div className="col-md-3">
//                         <label
//                           htmlFor={`commitmentIcon-${index}`}
//                           className="form-label fw-semibold small mb-2"
//                           style={{
//                             color: "#26364a",
//                           }}
//                         >
//                           Icon
//                         </label>

//                         <div className="d-flex gap-2">
//                           <div
//                             className="d-flex align-items-center justify-content-center rounded-3"
//                             style={{
//                               width: "46px",
//                               height: "46px",
//                               minWidth: "46px",
//                               background: "#e8f7ef",
//                               border: "1px solid #d5ebdf",
//                             }}
//                           >
//                             {renderIcon(point.icon)}
//                           </div>

//                           <select
//                             id={`commitmentIcon-${index}`}
//                             className="form-select"
//                             value={point.icon}
//                             disabled={saving}
//                             onChange={(event) =>
//                               updatePoint(index, {
//                                 icon: event.target.value,
//                               })
//                             }
//                             style={{
//                               minHeight: "46px",
//                               borderColor: "#dce7df",
//                               borderRadius: "9px",
//                               boxShadow: "none",
//                             }}
//                           >
//                             {Object.entries(ICON_OPTIONS).map(
//                               ([key, option]) => (
//                                 <option key={key} value={key}>
//                                   {option.label}
//                                 </option>
//                               )
//                             )}
//                           </select>
//                         </div>
//                       </div>

//                       <div className="col">
//                         <label
//                           htmlFor={`commitmentPointTitle-${index}`}
//                           className="form-label fw-semibold small mb-2"
//                           style={{
//                             color: "#26364a",
//                           }}
//                         >
//                           Title
//                           <span
//                             className="ms-1"
//                             style={{
//                               color: "#dc3545",
//                             }}
//                           >
//                             *
//                           </span>
//                         </label>

//                         <input
//                           id={`commitmentPointTitle-${index}`}
//                           type="text"
//                           className="form-control"
//                           value={point.title}
//                           maxLength={50}
//                           disabled={saving}
//                           onChange={(event) =>
//                             updatePoint(index, {
//                               title: event.target.value,
//                             })
//                           }
//                           placeholder="Commitment point"
//                           style={{
//                             minHeight: "46px",
//                             borderColor: "#dce7df",
//                             borderRadius: "9px",
//                             boxShadow: "none",
//                           }}
//                         />

//                         <div className="text-end mt-1">
//                           <small className="text-secondary">
//                             {point.title.length}
//                             /50
//                           </small>
//                         </div>
//                       </div>

//                       <div className="col-auto">
//                         <button
//                           type="button"
//                           className="btn d-flex align-items-center justify-content-center"
//                           title="Delete point"
//                           onClick={() => handleDeletePoint(index)}
//                           disabled={saving}
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             background: "#fff4f4",
//                             color: "#dc3545",
//                             border: "1px solid #ffdcdc",
//                             borderRadius: "8px",
//                           }}
//                         >
//                           <Trash3Fill size={15} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             className="btn w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
//             onClick={handleAddPoint}
//             disabled={saving}
//             style={{
//               minHeight: "42px",
//               background: "#f8fffb",
//               color: "#168653",
//               border: "1px dashed #9fd0b3",
//               borderRadius: "9px",
//               fontWeight: 500,
//             }}
//           >
//             <PlusLg size={15} />
//             Add Point
//           </button>
//         </div>

//         <div>
//           <label className="form-label fw-semibold small mb-2">
//             Commitment Image
//           </label>

//           {imagePreview ? (
//             <div
//               className="d-flex align-items-center justify-content-between p-2 rounded-3"
//               style={{
//                 width: "100%",
//                 maxWidth: "430px",
//                 border: "1px solid #dce7df",
//                 background: "#ffffff",
//               }}
//             >
//               <div className="d-flex align-items-center gap-3">
//                 <img
//                   src={imagePreview}
//                   alt="Commitment preview"
//                   style={{
//                     width: "92px",
//                     height: "58px",
//                     objectFit: "cover",
//                     borderRadius: "7px",
//                     border: "1px solid #e5ece8",
//                   }}
//                   onError={() =>
//                     setImageError("Unable to load commitment image.")
//                   }
//                 />

//                 <div>
//                   <div
//                     className="fw-medium small"
//                     style={{
//                       color: "#26364a",
//                     }}
//                   >
//                     Commitment image
//                   </div>

//                   <small className="text-secondary">
//                     Recommended: 1920 × 800 px
//                   </small>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 className="btn d-flex align-items-center justify-content-center"
//                 onClick={handleRemoveImage}
//                 disabled={saving}
//                 title="Remove image"
//                 style={{
//                   width: "38px",
//                   height: "38px",
//                   background: "#fff4f4",
//                   color: "#dc3545",
//                   border: "1px solid #ffdcdc",
//                   borderRadius: "8px",
//                 }}
//               >
//                 <Trash3Fill size={15} />
//               </button>
//             </div>
//           ) : (
//             <button
//               type="button"
//               onClick={handleUploadAreaClick}
//               disabled={saving}
//               className="w-100 text-center rounded-3"
//               style={{
//                 minHeight: "105px",
//                 background: "#fbfdfc",
//                 border: "1px dashed #a9cdb8",
//                 color: "#26364a",
//                 cursor: saving ? "not-allowed" : "pointer",
//               }}
//             >
//               <CloudUpload size={24} color="#168653" />

//               <div className="mt-2 fw-medium small">
//                 Upload Commitment Image
//               </div>

//               <small className="text-secondary">
//                 JPG, PNG or WEBP · Max 2MB
//               </small>
//             </button>
//           )}

//           <input
//             ref={fileInputRef}
//             id="commitmentImageUpload"
//             type="file"
//             accept="image/jpeg,image/png,image/webp"
//             onChange={handleImageChange}
//             className="d-none"
//             disabled={saving}
//           />

//           {imageError && (
//             <div
//               className="small mt-2"
//               style={{
//                 color: "#dc3545",
//               }}
//             >
//               {imageError}
//             </div>
//           )}

//           <small className="text-secondary d-block mt-2">
//             Recommended size: 1920×800px
//           </small>
//         </div>
//       </div>

//       <div
//         className="px-4 py-3 d-flex justify-content-end gap-2"
//         style={{
//           borderTop: "1px solid #e5ece8",
//           background: "#ffffff",
//         }}
//       >
//         <button
//           type="button"
//           className="btn px-4 d-flex align-items-center justify-content-center"
//           onClick={onReset}
//           disabled={saving}
//           style={{
//             minHeight: "42px",
//             minWidth: "120px",
//             background: "#ffffff",
//             color: "#26364a",
//             border: "1px solid #d7e1db",
//             borderRadius: "9px",
//             fontWeight: 500,
//           }}
//         >
//           <ArrowClockwise size={15} className="me-2" />
//           Reset
//         </button>

//         <button
//           type="button"
//           className="btn px-4 d-flex align-items-center justify-content-center"
//           onClick={handleSave}
//           disabled={saving}
//           style={{
//             minHeight: "42px",
//             minWidth: "145px",
//             background: "#168653",
//             color: "#ffffff",
//             border: "1px solid #168653",
//             borderRadius: "9px",
//             fontWeight: 500,
//           }}
//         >
//           {saving ? (
//             <>
//               <span
//                 className="spinner-border spinner-border-sm me-2"
//                 aria-hidden="true"
//               />
//               Saving...
//             </>
//           ) : (
//             <>
//               <FloppyFill size={15} className="me-2" />
//               Save Changes
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AboutCommitmentEdit;

import React, { useEffect, useRef, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  ArrowClockwise,
  CheckCircleFill,
  ClockFill,
  CloudUpload,
  FloppyFill,
  GripVertical,
  PlusLg,
  ShieldFillCheck,
  TagFill,
  Trash3Fill,
  CurrencyDollar,
  PersonCheckFill,
} from "react-bootstrap-icons";

import getMediaUrl from "../../../../utils/getMediaUrl.jsx";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const uploadCommitmentImage = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file.");
  }

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const formData = new FormData();
  formData.append("image", file);

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/admin/upload/image`,
    {
      method: "POST",
      credentials: "include",
      ...(token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}),
      body: formData,
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Image upload failed.");
  }

  const imageUrl = result?.data?.url;

  if (!imageUrl) {
    throw new Error("Image uploaded but backend did not return image URL.");
  }

  return imageUrl;
};

const ICON_OPTIONS = {
  shield: {
    label: "Shield",
    component: ShieldFillCheck,
  },

  clock: {
    label: "Clock",
    component: ClockFill,
  },

  price: {
    label: "Price",
    component: CurrencyDollar,
  },

  user: {
    label: "User",
    component: PersonCheckFill,
  },

  tag: {
    label: "Tag",
    component: TagFill,
  },
};

const DEFAULT_COMMITMENT = {
  title: "Our Commitment",

  description:
    "We are committed to creating a safe, reliable and delightful experience for every customer, every time.",

  points: [
    {
      title: "Verified & skilled professionals",
      icon: "shield",
    },
    {
      title: "On-time & dependable service",
      icon: "clock",
    },
    {
      title: "Transparent & fair pricing",
      icon: "price",
    },
  ],

  image: "",
};

const normalizeData = (data) => {
  const points = Array.isArray(data?.points)
    ? data.points
    : DEFAULT_COMMITMENT.points;

  return {
    title: data?.title || DEFAULT_COMMITMENT.title,

    description: data?.description || DEFAULT_COMMITMENT.description,

    points: points.map((point) => ({
      _id: point?._id,
      title: point?.title || "",
      icon:
        point?.icon && ICON_OPTIONS[point.icon]
          ? point.icon
          : "shield",
    })),

    image: typeof data?.image === "string" ? data.image : "",

    imageFile:
      data?.imageFile instanceof File
        ? data.imageFile
        : null,
  };
};

const createEmptyPoint = () => ({
  title: "",
  icon: "shield",
});

const AboutCommitmentEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const initialForm = normalizeData(data);

  const [form, setForm] = useState(initialForm);

  const [imagePreview, setImagePreview] = useState(
    initialForm.image ? getMediaUrl(initialForm.image) : ""
  );

  const [imageError, setImageError] = useState("");

  const [draggedIndex, setDraggedIndex] = useState(null);

  const fileInputRef = useRef(null);

  const formRef = useRef(initialForm);

  useEffect(() => {
    const normalized = normalizeData(data);

    formRef.current = normalized;

    setForm(normalized);

    setImagePreview(
      normalized.image ? getMediaUrl(normalized.image) : ""
    );

    setImageError("");
  }, [data]);

  const updateForm = (updates) => {
    const updatedForm = {
      ...formRef.current,
      ...updates,
    };

    formRef.current = updatedForm;

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const updatePoint = (index, updates) => {
    const currentForm = formRef.current;

    const points = [...currentForm.points];

    points[index] = {
      ...points[index],
      ...updates,
    };

    const updatedForm = {
      ...currentForm,
      points,
    };

    formRef.current = updatedForm;

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleAddPoint = () => {
    const currentForm = formRef.current;

    const updatedForm = {
      ...currentForm,
      points: [
        ...currentForm.points,
        createEmptyPoint(),
      ],
    };

    formRef.current = updatedForm;

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleDeletePoint = (index) => {
    if (saving) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove this commitment point?"
    );

    if (!confirmed) return;

    const currentForm = formRef.current;

    const points = currentForm.points.filter(
      (_, pointIndex) => pointIndex !== index
    );

    const updatedForm = {
      ...currentForm,
      points,
    };

    formRef.current = updatedForm;

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleDragStart = (event, index) => {
    if (saving) return;

    setDraggedIndex(index);

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    if (
      saving ||
      draggedIndex === null ||
      draggedIndex === targetIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    const currentForm = formRef.current;

    const points = [...currentForm.points];

    const [movedPoint] = points.splice(
      draggedIndex,
      1
    );

    points.splice(
      targetIndex,
      0,
      movedPoint
    );

    const updatedForm = {
      ...currentForm,
      points,
    };

    formRef.current = updatedForm;

    setForm(updatedForm);

    onChange?.(updatedForm);

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleUploadAreaClick = () => {
    if (saving) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      event.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        "Image size must be less than 2MB."
      );

      event.target.value = "";

      return;
    }

    if (saving) {
      event.target.value = "";

      return;
    }

    try {
      const uploadedImageUrl =
        await uploadCommitmentImage(file);

      const permanentPreview =
        getMediaUrl(uploadedImageUrl);

      setImagePreview(permanentPreview);

      const currentForm = formRef.current;

      const updatedForm = {
        ...currentForm,
        image: uploadedImageUrl,
        imageFile: null,
      };

      formRef.current = updatedForm;

      setForm(updatedForm);

      onChange?.(updatedForm);
    } catch (error) {
      console.error(
        "[AboutCommitment] IMAGE UPLOAD FAILED:",
        error
      );

      setImageError(
        error?.message ||
          "Image upload failed. Please try again."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (saving) return;

    setImagePreview("");

    updateForm({
      image: "",
      imageFile: null,
    });

    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    const normalizedData = normalizeData(
      formRef.current
    );

    if (!normalizedData.title.trim()) {
      window.alert("Section title is required.");

      return;
    }

    if (!normalizedData.description.trim()) {
      window.alert("Description is required.");

      return;
    }

    if (normalizedData.points.length === 0) {
      window.alert(
        "Please add at least one commitment point."
      );

      return;
    }

    const invalidPoint =
      normalizedData.points.find(
        (point) => !point.title.trim()
      );

    if (invalidPoint) {
      window.alert(
        "Every commitment point must have a title."
      );

      return;
    }

    const payload = {
      title: normalizedData.title.trim(),

      description:
        normalizedData.description.trim(),

      points: normalizedData.points.map((point) => ({
        ...(point._id
          ? {
              _id: point._id,
            }
          : {}),

        title: point.title.trim(),

        icon: point.icon || "shield",
      })),

      image: normalizedData.image || "",
    };

    onSave?.(payload);
  };

  const renderIcon = (iconName, size = 21) => {
    const option =
      ICON_OPTIONS[iconName] ||
      ICON_OPTIONS.shield;

    const IconComponent = option.component;

    return (
      <IconComponent
        size={size}
        color="#168653"
      />
    );
  };

  return (
    <div
      className="rounded-4 bg-white overflow-hidden"
      style={{
        border: "1px solid #e4ece7",
        boxShadow:
          "0 5px 20px rgba(22, 134, 83, 0.05)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid #e5ece8",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5
                className="mb-0 fw-semibold"
                style={{
                  color: "#172b4d",
                }}
              >
                Our Commitment Section
              </h5>

              <span
                className="px-2 py-1 rounded-pill small fw-medium"
                style={{
                  background: "#e7f7ef",
                  color: "#168653",
                }}
              >
                <CheckCircleFill
                  size={11}
                  className="me-1"
                />
                Active
              </span>
            </div>

            <p
              className="mb-0 mt-1 small"
              style={{
                color: "#718096",
              }}
            >
              Update the commitment section and
              settings for this section
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm"
            disabled={saving}
            style={{
              minHeight: "38px",
              padding: "0 14px",
              background: "#ffffff",
              color: "#26364a",
              border: "1px solid #dce6e0",
              borderRadius: "8px",
            }}
          >
            Collapse
            <span className="ms-2">˄</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div
          className="d-flex gap-2 mb-4"
          style={{
            borderBottom: "1px solid #e6ece8",
            paddingBottom: "12px",
          }}
        >
          <button
            type="button"
            className="btn px-4"
            style={{
              minHeight: "40px",
              background: "#168653",
              color: "#ffffff",
              border: "1px solid #168653",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            Content
          </button>

          <button
            type="button"
            className="btn px-4"
            disabled
            style={{
              minHeight: "40px",
              background: "#ffffff",
              color: "#536274",
              border: "1px solid #dce6e0",
              borderRadius: "8px",
              opacity: 1,
            }}
          >
            Settings
          </button>

          <button
            type="button"
            className="btn px-4"
            disabled
            style={{
              minHeight: "40px",
              background: "#ffffff",
              color: "#536274",
              border: "1px solid #dce6e0",
              borderRadius: "8px",
              opacity: 1,
            }}
          >
            Background
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="commitmentTitle"
            className="form-label fw-semibold small mb-2"
            style={{
              color: "#26364a",
            }}
          >
            Section Title
            <span
              className="ms-1"
              style={{
                color: "#dc3545",
              }}
            >
              *
            </span>
          </label>

          <input
            id="commitmentTitle"
            type="text"
            className="form-control"
            value={form.title}
            maxLength={100}
            disabled={saving}
            onChange={(event) =>
              updateForm({
                title: event.target.value,
              })
            }
            placeholder="Our Commitment"
            style={{
              minHeight: "46px",
              borderColor: "#dce7df",
              borderRadius: "9px",
              boxShadow: "none",
            }}
          />

          <div className="text-end mt-1">
            <small className="text-secondary">
              {form.title.length}/100
            </small>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="commitmentDescription"
            className="form-label fw-semibold small mb-2"
            style={{
              color: "#26364a",
            }}
          >
            Description
            <span
              className="ms-1"
              style={{
                color: "#dc3545",
              }}
            >
              *
            </span>
          </label>

          <textarea
            id="commitmentDescription"
            className="form-control"
            value={form.description}
            maxLength={1000}
            rows={5}
            disabled={saving}
            onChange={(event) =>
              updateForm({
                description: event.target.value,
              })
            }
            placeholder="Enter commitment description..."
            style={{
              borderColor: "#dce7df",
              borderRadius: "9px",
              resize: "vertical",
              boxShadow: "none",
            }}
          />

          <div className="text-end mt-1">
            <small className="text-secondary">
              {form.description.length}/1000
            </small>
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold small mb-0"
              style={{
                color: "#26364a",
              }}
            >
              Commitment Points
              <span
                className="ms-1"
                style={{
                  color: "#dc3545",
                }}
              >
                *
              </span>
            </label>

            <small className="text-secondary">
              {form.points.length}{" "}
              {form.points.length === 1
                ? "point"
                : "points"}
            </small>
          </div>

          <div className="d-flex flex-column gap-2">
            {form.points.map((point, index) => {
              const isDragging =
                draggedIndex === index;

              return (
                <div
                  key={
                    point._id ||
                    `commitment-point-${index}`
                  }
                  draggable={!saving}
                  onDragStart={(event) =>
                    handleDragStart(event, index)
                  }
                  onDragOver={handleDragOver}
                  onDrop={(event) =>
                    handleDrop(event, index)
                  }
                  onDragEnd={handleDragEnd}
                  className="rounded-3"
                  style={{
                    border:
                      "1px solid #dfe8e3",
                    background: "#ffffff",
                    opacity: isDragging ? 0.55 : 1,
                    transition:
                      "opacity 0.15s ease",
                  }}
                >
                  <div className="p-3">
                    <div className="row g-3 align-items-center">
                      <div className="col-auto">
                        <GripVertical
                          size={19}
                          style={{
                            color: "#8b9b92",
                            cursor: saving
                              ? "not-allowed"
                              : "grab",
                          }}
                        />
                      </div>

                      <div className="col-md-3">
                        <label
                          htmlFor={`commitmentIcon-${index}`}
                          className="form-label fw-semibold small mb-2"
                          style={{
                            color: "#26364a",
                          }}
                        >
                          Icon
                        </label>

                        <div className="d-flex gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3"
                            style={{
                              width: "46px",
                              height: "46px",
                              minWidth: "46px",
                              background: "#e8f7ef",
                              border:
                                "1px solid #d5ebdf",
                            }}
                          >
                            {renderIcon(point.icon)}
                          </div>

                          <select
                            id={`commitmentIcon-${index}`}
                            className="form-select"
                            value={point.icon}
                            disabled={saving}
                            onChange={(event) =>
                              updatePoint(index, {
                                icon: event.target.value,
                              })
                            }
                            style={{
                              minHeight: "46px",
                              borderColor: "#dce7df",
                              borderRadius: "9px",
                              boxShadow: "none",
                            }}
                          >
                            {Object.entries(
                              ICON_OPTIONS
                            ).map(
                              ([key, option]) => (
                                <option
                                  key={key}
                                  value={key}
                                >
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="col">
                        <label
                          htmlFor={`commitmentPointTitle-${index}`}
                          className="form-label fw-semibold small mb-2"
                          style={{
                            color: "#26364a",
                          }}
                        >
                          Title
                          <span
                            className="ms-1"
                            style={{
                              color: "#dc3545",
                            }}
                          >
                            *
                          </span>
                        </label>

                        <input
                          id={`commitmentPointTitle-${index}`}
                          type="text"
                          className="form-control"
                          value={point.title}
                          maxLength={50}
                          disabled={saving}
                          onChange={(event) =>
                            updatePoint(index, {
                              title:
                                event.target.value,
                            })
                          }
                          placeholder="Commitment point"
                          style={{
                            minHeight: "46px",
                            borderColor: "#dce7df",
                            borderRadius: "9px",
                            boxShadow: "none",
                          }}
                        />

                        <div className="text-end mt-1">
                          <small className="text-secondary">
                            {point.title.length}/50
                          </small>
                        </div>
                      </div>

                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn d-flex align-items-center justify-content-center"
                          title="Delete point"
                          onClick={() =>
                            handleDeletePoint(index)
                          }
                          disabled={saving}
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#fff4f4",
                            color: "#dc3545",
                            border:
                              "1px solid #ffdcdc",
                            borderRadius: "8px",
                          }}
                        >
                          <Trash3Fill size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleAddPoint}
            disabled={saving}
            style={{
              minHeight: "42px",
              background: "#f8fffb",
              color: "#168653",
              border: "1px dashed #9fd0b3",
              borderRadius: "9px",
              fontWeight: 500,
            }}
          >
            <PlusLg size={15} />
            Add Point
          </button>
        </div>

        <div>
          <label className="form-label fw-semibold small mb-2">
            Commitment Image
          </label>

          {imagePreview ? (
            <div
              className="d-flex align-items-center justify-content-between p-2 rounded-3"
              style={{
                width: "100%",
                maxWidth: "430px",
                border: "1px solid #dce7df",
                background: "#ffffff",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Commitment preview"
                  style={{
                    width: "92px",
                    height: "58px",
                    objectFit: "cover",
                    borderRadius: "7px",
                    border:
                      "1px solid #e5ece8",
                  }}
                  onError={() =>
                    setImageError(
                      "Unable to load commitment image."
                    )
                  }
                />

                <div>
                  <div
                    className="fw-medium small"
                    style={{
                      color: "#26364a",
                    }}
                  >
                    Commitment image
                  </div>

                  <small className="text-secondary">
                    Recommended: 1920 × 800 px
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center"
                onClick={handleRemoveImage}
                disabled={saving}
                title="Remove image"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "#fff4f4",
                  color: "#dc3545",
                  border: "1px solid #ffdcdc",
                  borderRadius: "8px",
                }}
              >
                <Trash3Fill size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUploadAreaClick}
              disabled={saving}
              className="w-100 text-center rounded-3"
              style={{
                minHeight: "105px",
                background: "#fbfdfc",
                border:
                  "1px dashed #a9cdb8",
                color: "#26364a",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <CloudUpload
                size={24}
                color="#168653"
              />

              <div className="mt-2 fw-medium small">
                Upload Commitment Image
              </div>

              <small className="text-secondary">
                JPG, PNG or WEBP · Max 2MB
              </small>
            </button>
          )}

          <input
            ref={fileInputRef}
            id="commitmentImageUpload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="d-none"
            disabled={saving}
          />

          {imageError && (
            <div
              className="small mt-2"
              style={{
                color: "#dc3545",
              }}
            >
              {imageError}
            </div>
          )}

          <small className="text-secondary d-block mt-2">
            Recommended size: 1920×800px
          </small>
        </div>
      </div>

      <div
        className="px-4 py-3 d-flex justify-content-end gap-2"
        style={{
          borderTop: "1px solid #e5ece8",
          background: "#ffffff",
        }}
      >
        <button
          type="button"
          className="btn px-4 d-flex align-items-center justify-content-center"
          onClick={onReset}
          disabled={saving}
          style={{
            minHeight: "42px",
            minWidth: "120px",
            background: "#ffffff",
            color: "#26364a",
            border: "1px solid #d7e1db",
            borderRadius: "9px",
            fontWeight: 500,
          }}
        >
          <ArrowClockwise
            size={15}
            className="me-2"
          />
          Reset
        </button>

        <button
          type="button"
          className="btn px-4 d-flex align-items-center justify-content-center"
          onClick={handleSave}
          disabled={saving}
          style={{
            minHeight: "42px",
            minWidth: "145px",
            background: "#168653",
            color: "#ffffff",
            border: "1px solid #168653",
            borderRadius: "9px",
            fontWeight: 500,
          }}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            <>
              <FloppyFill
                size={15}
                className="me-2"
              />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AboutCommitmentEdit;