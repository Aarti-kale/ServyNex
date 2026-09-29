import React, { useEffect, useMemo, useState } from "react";

import API from "../../../api/api";

import FooterHeader from "../../../components/AdminComponents/websiteCMS/Footer/FooterHeader";
import LogoDescriptionSection from "../../../components/AdminComponents/websiteCMS/Footer/LogoDescription";
import SocialLink from "../../../components/AdminComponents/websiteCMS/Footer/SocialLink";
import FooterColumns from "../../../components/AdminComponents/websiteCMS/Footer/FooterColumns";
import ContactInfoSection from "../../../components/AdminComponents/websiteCMS/Footer/ContactInfoSection";
import CopyRightSection from "../../../components/AdminComponents/websiteCMS/Footer/CopyRIghtSection";
import FooterStatusSection from "../../../components/AdminComponents/websiteCMS/Footer/FooterStatusSection";

const EMPTY_STATE = {
  logo: "",
  description: "",

  socialLinks: [],

  columns: [],

  contact: {
    title: "",
    phone: "",
    email: "",
    address: "",
  },

  copyright: "",

  isActive: false,
};

let nextSocialLinkId = 100000;
let nextColumnId = 200000;
let nextColumnLinkId = 300000;

const normalizeFooter = (footer) => {
  const safeFooter = footer && typeof footer === "object" ? footer : {};

  const safeSocialLinks = Array.isArray(safeFooter.socialLinks)
    ? safeFooter.socialLinks
    : [];

  const safeColumns = Array.isArray(safeFooter.columns)
    ? safeFooter.columns
    : [];

  const normalizedSocialLinks = safeSocialLinks.map((link, index) => ({
    ...(link || {}),

    platform: typeof link?.platform === "string" ? link.platform : "",

    url: typeof link?.url === "string" ? link.url : "",

    isActive: Boolean(link?.isActive),

    __tempId: link?._id ? undefined : `social-${index}-${nextSocialLinkId++}`,
  }));

  const normalizedColumns = safeColumns
    .map((column, columnIndex) => {
      const safeLinks = Array.isArray(column?.links) ? column.links : [];

      return {
        ...(column || {}),

        title: typeof column?.title === "string" ? column.title : "",

        order: Number.isFinite(Number(column?.order))
          ? Number(column.order)
          : columnIndex + 1,

        links: safeLinks.map((link, linkIndex) => ({
          ...(link || {}),

          label: typeof link?.label === "string" ? link.label : "",

          href: typeof link?.href === "string" ? link.href : "",

          isActive: Boolean(link?.isActive),

          order: Number.isFinite(Number(link?.order))
            ? Number(link.order)
            : linkIndex + 1,

          __tempId: link?._id
            ? undefined
            : `link-${columnIndex}-${linkIndex}-${nextColumnLinkId++}`,
        })),
      };
    })
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  return {
    logo: typeof safeFooter.logo === "string" ? safeFooter.logo : "",

    description:
      typeof safeFooter.description === "string" ? safeFooter.description : "",

    socialLinks: normalizedSocialLinks,

    columns: normalizedColumns,

    contact: {
      title:
        typeof safeFooter?.contact?.title === "string"
          ? safeFooter.contact.title
          : "",

      phone:
        typeof safeFooter?.contact?.phone === "string"
          ? safeFooter.contact.phone
          : "",

      email:
        typeof safeFooter?.contact?.email === "string"
          ? safeFooter.contact.email
          : "",

      address:
        typeof safeFooter?.contact?.address === "string"
          ? safeFooter.contact.address
          : "",
    },

    copyright:
      typeof safeFooter.copyright === "string" ? safeFooter.copyright : "",

    isActive: Boolean(safeFooter.isActive),
  };
};

const createFooterPayload = (state) => {
  const safeState = state && typeof state === "object" ? state : EMPTY_STATE;

  const safeSocialLinks = Array.isArray(safeState.socialLinks)
    ? safeState.socialLinks
    : [];

  const safeColumns = Array.isArray(safeState.columns) ? safeState.columns : [];

  return {
    logo: typeof safeState.logo === "string" ? safeState.logo : "",

    description:
      typeof safeState.description === "string" ? safeState.description : "",

    socialLinks: safeSocialLinks.map((link) => {
      const payload = {
        platform: typeof link?.platform === "string" ? link.platform : "",

        url: typeof link?.url === "string" ? link.url : "",

        isActive: Boolean(link?.isActive),
      };

      if (link?._id) {
        payload._id = link._id;
      }

      return payload;
    }),

    columns: safeColumns.map((column, columnIndex) => {
      const safeLinks = Array.isArray(column?.links) ? column.links : [];

      const columnPayload = {
        title: typeof column?.title === "string" ? column.title : "",

        order: Number.isFinite(Number(column?.order))
          ? Number(column.order)
          : columnIndex + 1,

        links: safeLinks.map((link, linkIndex) => {
          const linkPayload = {
            label: typeof link?.label === "string" ? link.label : "",

            href: typeof link?.href === "string" ? link.href : "",

            isActive: Boolean(link?.isActive),

            order: Number.isFinite(Number(link?.order))
              ? Number(link.order)
              : linkIndex + 1,
          };

          if (link?._id) {
            linkPayload._id = link._id;
          }

          return linkPayload;
        }),
      };

      if (column?._id) {
        columnPayload._id = column._id;
      }

      return columnPayload;
    }),

    contact: {
      title:
        typeof safeState?.contact?.title === "string"
          ? safeState.contact.title
          : "",

      phone:
        typeof safeState?.contact?.phone === "string"
          ? safeState.contact.phone
          : "",

      email:
        typeof safeState?.contact?.email === "string"
          ? safeState.contact.email
          : "",

      address:
        typeof safeState?.contact?.address === "string"
          ? safeState.contact.address
          : "",
    },

    copyright:
      typeof safeState.copyright === "string" ? safeState.copyright : "",

    isActive: Boolean(safeState.isActive),
  };
};

function CmsFooter() {
  const [savedState, setSavedState] = useState(EMPTY_STATE);

  const [draftState, setDraftState] = useState(EMPTY_STATE);

  const [isSaving, setIsSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const isDirty = useMemo(
    () => JSON.stringify(draftState) !== JSON.stringify(savedState),
    [draftState, savedState]
  );

  useEffect(() => {
    let mounted = true;

    const loadFooter = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await API.get("/admin/site-settings");

        if (!mounted) return;

        const responseData = response?.data?.data;

        const backendFooter =
          responseData?.footer ?? responseData?.settings?.footer ?? {};

        const normalizedFooter = normalizeFooter(backendFooter);

        setSavedState(normalizedFooter);

        setDraftState(normalizedFooter);
      } catch (err) {
        if (!mounted) return;

        console.error("Failed to load footer settings:", err);

        setError(
          err?.response?.data?.message || "Failed to load footer settings."
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFooter();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogoChange = (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setDraftState((prev) => ({
      ...prev,

      logo: previewUrl,
    }));
  };

  const handleLogoRemove = () => {
    setDraftState((prev) => ({
      ...prev,

      logo: "",
    }));
  };

  const handleDescriptionChange = (value) => {
    setDraftState((prev) => ({
      ...prev,

      description: typeof value === "string" ? value : "",
    }));
  };

  const getSocialLinkId = (link, index) => {
    return link?._id ?? link?.__tempId ?? index;
  };

  const handleSocialLinkChange = (id, value) => {
    setDraftState((prev) => {
      const socialLinks = Array.isArray(prev.socialLinks)
        ? prev.socialLinks
        : [];

      return {
        ...prev,

        socialLinks: socialLinks.map((link, index) =>
          getSocialLinkId(link, index) === id
            ? {
                ...link,
                url: typeof value === "string" ? value : "",
              }
            : link
        ),
      };
    });
  };

  const handleSocialLinkToggle = (id) => {
    setDraftState((prev) => {
      const socialLinks = Array.isArray(prev.socialLinks)
        ? prev.socialLinks
        : [];

      return {
        ...prev,

        socialLinks: socialLinks.map((link, index) =>
          getSocialLinkId(link, index) === id
            ? {
                ...link,

                isActive: !Boolean(link?.isActive),
              }
            : link
        ),
      };
    });
  };

  const handleSocialLinkRemove = (id) => {
    setDraftState((prev) => {
      const socialLinks = Array.isArray(prev.socialLinks)
        ? prev.socialLinks
        : [];

      return {
        ...prev,

        socialLinks: socialLinks.filter(
          (link, index) => getSocialLinkId(link, index) !== id
        ),
      };
    });
  };

  const handleSocialLinkAdd = () => {
    setDraftState((prev) => {
      const socialLinks = Array.isArray(prev.socialLinks)
        ? prev.socialLinks
        : [];

      return {
        ...prev,

        socialLinks: [
          ...socialLinks,

          {
            __tempId: `social-${nextSocialLinkId++}`,

            platform: "",

            url: "",

            isActive: false,
          },
        ],
      };
    });
  };

  const getColumnId = (column, index) => {
    return column?._id ?? column?.__tempId ?? index;
  };

  const getColumnLinkId = (link, index) => {
    return link?._id ?? link?.__tempId ?? index;
  };

  const handleColumnTitleChange = (columnId, value) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, index) =>
          getColumnId(column, index) === columnId
            ? {
                ...column,

                title: typeof value === "string" ? value : "",
              }
            : column
        ),
      };
    });
  };

  const handleColumnLinkChange = (columnId, linkId, field, value) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, columnIndex) => {
          if (getColumnId(column, columnIndex) !== columnId) {
            return column;
          }

          const links = Array.isArray(column?.links) ? column.links : [];

          return {
            ...column,

            links: links.map((link, linkIndex) =>
              getColumnLinkId(link, linkIndex) === linkId
                ? {
                    ...link,

                    [field]: field === "order" ? Number(value) : value,
                  }
                : link
            ),
          };
        }),
      };
    });
  };

  const handleColumnLinkToggle = (columnId, linkId) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, columnIndex) => {
          if (getColumnId(column, columnIndex) !== columnId) {
            return column;
          }

          const links = Array.isArray(column?.links) ? column.links : [];

          return {
            ...column,

            links: links.map((link, linkIndex) =>
              getColumnLinkId(link, linkIndex) === linkId
                ? {
                    ...link,

                    isActive: !Boolean(link?.isActive),
                  }
                : link
            ),
          };
        }),
      };
    });
  };

  const handleColumnLinkRemove = (columnId, linkId) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, columnIndex) => {
          if (getColumnId(column, columnIndex) !== columnId) {
            return column;
          }

          const links = Array.isArray(column?.links) ? column.links : [];

          return {
            ...column,

            links: links.filter(
              (link, linkIndex) => getColumnLinkId(link, linkIndex) !== linkId
            ),
          };
        }),
      };
    });
  };

  const handleColumnLinkAdd = (columnId) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, columnIndex) => {
          if (getColumnId(column, columnIndex) !== columnId) {
            return column;
          }

          const links = Array.isArray(column?.links) ? column.links : [];

          const nextOrder =
            links.reduce(
              (maxOrder, link) => Math.max(maxOrder, Number(link?.order) || 0),
              0
            ) + 1;

          return {
            ...column,

            links: [
              ...links,

              {
                __tempId: `link-${nextColumnLinkId++}`,

                label: "",

                href: "",

                isActive: false,

                order: nextOrder,
              },
            ],
          };
        }),
      };
    });
  };

  const handleColumnReorder = (columnId, fromIndex, toIndex) => {
    setDraftState((prev) => {
      const columns = Array.isArray(prev.columns) ? prev.columns : [];

      return {
        ...prev,

        columns: columns.map((column, columnIndex) => {
          if (getColumnId(column, columnIndex) !== columnId) {
            return column;
          }

          const links = Array.isArray(column?.links) ? [...column.links] : [];

          if (
            fromIndex < 0 ||
            fromIndex >= links.length ||
            toIndex < 0 ||
            toIndex >= links.length
          ) {
            return column;
          }

          const [moved] = links.splice(fromIndex, 1);

          if (!moved) {
            return column;
          }

          links.splice(toIndex, 0, moved);

          const reorderedLinks = links.map((link, index) => ({
            ...link,

            order: index + 1,
          }));

          return {
            ...column,

            links: reorderedLinks,
          };
        }),
      };
    });
  };

  const handleContactChange = (field, value) => {
    setDraftState((prev) => ({
      ...prev,

      contact: {
        ...(prev.contact || {}),

        [field]: typeof value === "string" ? value : "",
      },
    }));
  };

  const handleCopyrightChange = (value) => {
    setDraftState((prev) => ({
      ...prev,

      copyright: typeof value === "string" ? value : "",
    }));
  };

  const handleFooterStatusToggle = () => {
    setDraftState((prev) => ({
      ...prev,

      isActive: !Boolean(prev.isActive),
    }));
  };

  const handleReset = () => {
    setDraftState(normalizeFooter(savedState));

    setError("");
  };

  const handleSave = async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const footerPayload = createFooterPayload(draftState);

      const response = await API.put(
        "/admin/site-settings/footer",
        footerPayload
      );

      const responseData = response?.data?.data;

      const backendFooter =
        responseData?.footer ?? responseData ?? footerPayload;

      const normalizedFooter = normalizeFooter(backendFooter);

      setSavedState(normalizedFooter);

      setDraftState(normalizedFooter);
    } catch (err) {
      console.error("Failed to save footer settings:", err);

      setError(
        err?.response?.data?.message || "Failed to save footer settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f7fbfa",
      }}
    >
      <FooterHeader
        isDirty={isDirty}
        saving={isSaving || isLoading}
        onReset={handleReset}
        onSave={handleSave}
      />

      {error && (
        <div className="container-fluid px-3">
          <div className="alert alert-danger py-2 mb-2" role="alert">
            {error}
          </div>
        </div>
      )}

      <main className="container-fluid px-3 pb-3">
        <div className="row g-2 align-items-stretch">
          <div className="col-12 col-xl-4">
            <div className="d-flex flex-column gap-2 h-100">
              <LogoDescriptionSection
                logo={
                  typeof draftState?.logo === "string" ? draftState.logo : ""
                }
                description={draftState?.description ?? ""}
                onLogoChange={handleLogoChange}
                onLogoRemove={handleLogoRemove}
                onDescriptionChange={handleDescriptionChange}
              />

              <SocialLink
                links={
                  Array.isArray(draftState?.socialLinks)
                    ? draftState.socialLinks
                    : []
                }
                onLinkChange={handleSocialLinkChange}
                onLinkToggle={handleSocialLinkToggle}
                onLinkRemove={handleSocialLinkRemove}
                onLinkAdd={handleSocialLinkAdd}
              />
            </div>
          </div>

          <div className="col-12 col-xl-8">
            <div className="d-flex flex-column gap-2 h-100">
              <FooterColumns
                columns={
                  Array.isArray(draftState?.columns) ? draftState.columns : []
                }
                onColumnTitleChange={handleColumnTitleChange}
                onLinkChange={handleColumnLinkChange}
                onLinkToggle={handleColumnLinkToggle}
                onLinkRemove={handleColumnLinkRemove}
                onLinkAdd={handleColumnLinkAdd}
                onReorder={handleColumnReorder}
              />

              <div className="row g-2">
                <div className="col-12 col-lg-7">
                  <ContactInfoSection
                    contact={draftState?.contact ?? {}}
                    onChange={handleContactChange}
                  />
                </div>

                <div className="col-12 col-lg-5">
                  <div className="d-flex flex-column gap-2 h-100">
                    <CopyRightSection
                      copyright={draftState?.copyright ?? ""}
                      onChange={handleCopyrightChange}
                    />

                    <FooterStatusSection
                      isActive={Boolean(draftState?.isActive)}
                      onToggle={handleFooterStatusToggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CmsFooter;
