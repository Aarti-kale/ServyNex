import { useEffect, useMemo, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

import API from "../../../api/api";

import NavHeader from "../../../components/AdminComponents/websiteCMS/Navbar/NavHeader";
import LogoSection from "../../../components/AdminComponents/websiteCMS/Navbar/LogoSection";
import MenuItemsSection from "../../../components/AdminComponents/websiteCMS/Navbar/MenuItemsSection";
import ButtonConfiguration from "../../../components/AdminComponents/websiteCMS/Navbar/ButtonConfiguration";

const EMPTY_STATE = {
  logo: "",
  logoLink: "",

  menuItems: [],

  loginButton: {
    text: "",
    link: "",
    enabled: false,
  },

  signupButton: {
    text: "",
    link: "",
    enabled: false,
  },

  isActive: false,
};

let nextMenuItemId = 100000;

const getMenuItemId = (item, index) => {
  if (item?._id) return item._id;

  if (item?.__tempId !== undefined) {
    return item.__tempId;
  }

  return `menu-${index}`;
};

const normalizeNavbar = (navbar) => {
  const safeNavbar =
    navbar && typeof navbar === "object"
      ? navbar
      : {};

  const safeMenuItems = Array.isArray(
    safeNavbar.menuItems
  )
    ? safeNavbar.menuItems
    : [];

  const normalizedMenuItems = safeMenuItems
    .map((item, index) => ({
      ...(item || {}),

      label:
        typeof item?.label === "string"
          ? item.label
          : "",

      href:
        typeof item?.href === "string"
          ? item.href
          : "",

      isActive: Boolean(item?.isActive),

      order:
        Number.isFinite(Number(item?.order))
          ? Number(item.order)
          : index + 1,
    }))
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  return {
    logo:
      typeof safeNavbar.logo === "string"
        ? safeNavbar.logo
        : "",

    logoLink:
      typeof safeNavbar.logoLink === "string"
        ? safeNavbar.logoLink
        : "",

    menuItems: normalizedMenuItems,

    loginButton: {
      text:
        typeof safeNavbar?.loginButton?.text ===
        "string"
          ? safeNavbar.loginButton.text
          : "",

      link:
        typeof safeNavbar?.loginButton?.link ===
        "string"
          ? safeNavbar.loginButton.link
          : "",

      enabled: Boolean(
        safeNavbar?.loginButton?.enabled
      ),
    },

    signupButton: {
      text:
        typeof safeNavbar?.signupButton?.text ===
        "string"
          ? safeNavbar.signupButton.text
          : "",

      link:
        typeof safeNavbar?.signupButton?.link ===
        "string"
          ? safeNavbar.signupButton.link
          : "",

      enabled: Boolean(
        safeNavbar?.signupButton?.enabled
      ),
    },

    isActive: Boolean(safeNavbar.isActive),
  };
};

const createNavbarPayload = (state) => {
  const safeState =
    state && typeof state === "object"
      ? state
      : EMPTY_STATE;

  const safeMenuItems = Array.isArray(
    safeState.menuItems
  )
    ? safeState.menuItems
    : [];

  return {
    logo:
      typeof safeState.logo === "string"
        ? safeState.logo
        : "",

    logoLink:
      typeof safeState.logoLink === "string"
        ? safeState.logoLink
        : "",

    menuItems: safeMenuItems.map(
      (item, index) => {
        const cleanItem = {
          label:
            typeof item?.label === "string"
              ? item.label
              : "",

          href:
            typeof item?.href === "string"
              ? item.href
              : "",

          isActive: Boolean(item?.isActive),

          order:
            Number.isFinite(Number(item?.order))
              ? Number(item.order)
              : index + 1,
        };


        if (item?._id) {
          cleanItem._id = item._id;
        }

        return cleanItem;
      }
    ),

    loginButton: {
      text:
        typeof safeState?.loginButton?.text ===
        "string"
          ? safeState.loginButton.text
          : "",

      link:
        typeof safeState?.loginButton?.link ===
        "string"
          ? safeState.loginButton.link
          : "",

      enabled: Boolean(
        safeState?.loginButton?.enabled
      ),
    },

    signupButton: {
      text:
        typeof safeState?.signupButton?.text ===
        "string"
          ? safeState.signupButton.text
          : "",

      link:
        typeof safeState?.signupButton?.link ===
        "string"
          ? safeState.signupButton.link
          : "",

      enabled: Boolean(
        safeState?.signupButton?.enabled
      ),
    },

    isActive: Boolean(safeState.isActive),
  };
};

function CmsNavbar() {
  const [savedState, setSavedState] =
    useState(EMPTY_STATE);

  const [draftState, setDraftState] =
    useState(EMPTY_STATE);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [logoFile, setLogoFile] =
    useState(null);

  const isDirty = useMemo(
    () =>
      JSON.stringify(draftState) !==
      JSON.stringify(savedState),
    [draftState, savedState]
  );

  useEffect(() => {
    let mounted = true;

    const loadNavbar = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await API.get(
          "/admin/site-settings"
        );

        if (!mounted) return;

        const responseData =
          response?.data?.data;

        const backendNavbar =
          responseData?.navbar ??
          responseData?.settings?.navbar ??
          {};

        const normalizedNavbar =
          normalizeNavbar(
            backendNavbar
          );

        setSavedState(
          normalizedNavbar
        );

        setDraftState(
          normalizedNavbar
        );

        setLogoFile(null);
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Failed to load navbar settings:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load navbar settings."
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadNavbar();

    return () => {
      mounted = false;
    };
  }, []);

  const uploadNavbarLogo = async (file) => {
    if (!(file instanceof File)) {
      return null;
    }

    const imageFormData = new FormData();

    imageFormData.append(
      "image",
      file
    );

    const response = await API.post(
      "/admin/upload/image",
      imageFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to upload navbar logo"
      );
    }

    const imageUrl =
      response.data?.data?.url;

    if (!imageUrl) {
      throw new Error(
        "Logo uploaded but server did not return a valid URL"
      );
    }

    return imageUrl;
  };

  const handleLogoChange = (file) => {
    if (!(file instanceof File)) {
      return;
    }


    setLogoFile(file);


    const previewUrl =
      URL.createObjectURL(file);

    setDraftState((prev) => {

      if (
        typeof prev?.logo === "string" &&
        prev.logo.startsWith("blob:")
      ) {
        URL.revokeObjectURL(prev.logo);
      }

      return {
        ...prev,

        logo: previewUrl,
      };
    });
  };

  const handleLogoRemove = () => {
    setDraftState((prev) => {

      if (
        typeof prev?.logo === "string" &&
        prev.logo.startsWith("blob:")
      ) {
        URL.revokeObjectURL(prev.logo);
      }

      return {
        ...prev,

        logo: "",
      };
    });


    setLogoFile(null);
  };

  const handleLogoLinkChange = (value) => {
    setDraftState((prev) => ({
      ...prev,

      logoLink:
        typeof value === "string"
          ? value
          : "",
    }));
  };

  
  const handleItemChange = (
    id,
    field,
    value
  ) => {
    setDraftState((prev) => {
      const menuItems =
        Array.isArray(prev.menuItems)
          ? prev.menuItems
          : [];

      return {
        ...prev,

        menuItems: menuItems.map(
          (item, index) => {
            const itemId =
              getMenuItemId(
                item,
                index
              );

            if (itemId !== id) {
              return item;
            }

            return {
              ...item,

              [field]:
                field === "order"
                  ? Number(value)
                  : value,
            };
          }
        ),
      };
    });
  };

  const handleItemToggle = (id) => {
    setDraftState((prev) => {
      const menuItems =
        Array.isArray(prev.menuItems)
          ? prev.menuItems
          : [];

      return {
        ...prev,

        menuItems: menuItems.map(
          (item, index) => {
            const itemId =
              getMenuItemId(
                item,
                index
              );

            if (itemId !== id) {
              return item;
            }

            return {
              ...item,

              isActive:
                !Boolean(
                  item?.isActive
                ),
            };
          }
        ),
      };
    });
  };

  const handleItemRemove = (id) => {
    setDraftState((prev) => {
      const menuItems =
        Array.isArray(prev.menuItems)
          ? prev.menuItems
          : [];

      return {
        ...prev,

        menuItems: menuItems.filter(
          (item, index) =>
            getMenuItemId(
              item,
              index
            ) !== id
        ),
      };
    });
  };

  const handleItemAdd = () => {
    setDraftState((prev) => {
      const menuItems =
        Array.isArray(prev.menuItems)
          ? prev.menuItems
          : [];

      const nextOrder =
        menuItems.reduce(
          (maxOrder, item) =>
            Math.max(
              maxOrder,
              Number(item?.order) || 0
            ),
          0
        ) + 1;

      return {
        ...prev,

        menuItems: [
          ...menuItems,

          {
            __tempId:
              `menu-${nextMenuItemId++}`,

            label: "",

            href: "",

            isActive: true,

            order: nextOrder,
          },
        ],
      };
    });
  };

  const handleReorder = (
    fromIndex,
    toIndex
  ) => {
    setDraftState((prev) => {
      const items =
        Array.isArray(
          prev.menuItems
        )
          ? [
              ...prev.menuItems,
            ]
          : [];

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= items.length ||
        toIndex >= items.length
      ) {
        return prev;
      }

      const [moved] =
        items.splice(
          fromIndex,
          1
        );

      if (!moved) {
        return prev;
      }

      items.splice(
        toIndex,
        0,
        moved
      );

     
      const reorderedItems =
        items.map(
          (item, index) => ({
            ...item,

            order:
              index + 1,
          })
        );

      return {
        ...prev,

        menuItems:
          reorderedItems,
      };
    });
  };

  const handleLoginChange = (
    field,
    value
  ) => {
    setDraftState((prev) => ({
      ...prev,

      loginButton: {
        ...(prev.loginButton || {}),

        [field]:
          field === "enabled"
            ? Boolean(value)
            : value,
      },
    }));
  };

  const handleSignupChange = (
    field,
    value
  ) => {
    setDraftState((prev) => ({
      ...prev,

      signupButton: {
        ...(prev.signupButton || {}),

        [field]:
          field === "enabled"
            ? Boolean(value)
            : value,
      },
    }));
  };


  const handleReset = () => {

    if (
      typeof draftState?.logo === "string" &&
      draftState.logo.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        draftState.logo
      );
    }

    setDraftState(
      normalizeNavbar(
        savedState
      )
    );

   
    setLogoFile(null);

    setError("");
  };

 
  const handleSave = async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
     
      let logoUrl =
        typeof draftState?.logo ===
        "string"
          ? draftState.logo
          : "";


      if (logoFile instanceof File) {
        logoUrl =
          await uploadNavbarLogo(
            logoFile
          );
      }

      const navbarPayload =
        createNavbarPayload({
          ...draftState,


          logo: logoUrl,
        });


      const response =
        await API.put(
          "/admin/site-settings/navbar",
          {
            navbar: navbarPayload,
          }
        );


      const responseData =
        response?.data?.data;

      const backendNavbar =
        responseData?.navbar ??
        responseData ??
        navbarPayload;

      const normalizedNavbar =
        normalizeNavbar(
          backendNavbar
        );


      setLogoFile(null);

      setSavedState(
        normalizedNavbar
      );

      setDraftState(
        normalizedNavbar
      );
    } catch (err) {
      console.error(
        "Failed to save navbar settings:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save navbar settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor:
          "#f7fbfa",
      }}
    >
     
      <NavHeader
        isDirty={isDirty}
        isSaving={
          isSaving || isLoading
        }
        onReset={handleReset}
        onSave={handleSave}
      />


      {error && (
        <div className="container-fluid px-3 px-xl-4">
          <div
            className="alert alert-danger py-2 mb-2"
            role="alert"
          >
            {error}
          </div>
        </div>
      )}

     
      <main className="container-fluid px-3 px-xl-4 pb-4">
        <div
          className="row g-2 g-xl-3 align-items-stretch"
          style={{
            minHeight: "718px",
          }}
        >
       
          <div className="col-12 col-xl-7">
            <div className="d-flex flex-column gap-2 gap-xl-3 h-100">


              <div>
                <LogoSection
                  logo={
                    typeof draftState?.logo ===
                    "string"
                      ? draftState.logo
                      : ""
                  }
                  logoLink={
                    draftState?.logoLink ??
                    ""
                  }
                  onLogoChange={
                    handleLogoChange
                  }
                  onLogoRemove={
                    handleLogoRemove
                  }
                  onLogoLinkChange={
                    handleLogoLinkChange
                  }
                />
              </div>

              <div className="flex-grow-1">
                <MenuItemsSection
                  items={
                    Array.isArray(
                      draftState?.menuItems
                    )
                      ? draftState.menuItems
                      : []
                  }
                  onItemChange={
                    handleItemChange
                  }
                  onItemToggle={
                    handleItemToggle
                  }
                  onItemRemove={
                    handleItemRemove
                  }
                  onItemAdd={
                    handleItemAdd
                  }
                  onReorder={
                    handleReorder
                  }
                />
              </div>

            </div>
          </div>

          
          <div className="col-12 col-xl-5">
            <div className="d-flex flex-column gap-2 gap-xl-3 h-100">

            
              <div>
                <ButtonConfiguration
                  icon={LogIn}
                  title="Login Button"
                  description="Configure login button text and link"

                  enabled={Boolean(
                    draftState
                      ?.loginButton
                      ?.enabled
                  )}

                  onToggle={() =>
                    handleLoginChange(
                      "enabled",
                      !Boolean(
                        draftState
                          ?.loginButton
                          ?.enabled
                      )
                    )
                  }

                  text={
                    draftState
                      ?.loginButton
                      ?.text ??
                    ""
                  }

                  onTextChange={(value) =>
                    handleLoginChange(
                      "text",
                      value
                    )
                  }

                  link={
                    draftState
                      ?.loginButton
                      ?.link ??
                    ""
                  }

                  onLinkChange={(value) =>
                    handleLoginChange(
                      "link",
                      value
                    )
                  }
                />
              </div>

              <div className="flex-grow-1">
                <ButtonConfiguration
                  icon={UserPlus}
                  title="Signup Button"
                  description="Configure signup button text and link"

                  enabled={Boolean(
                    draftState
                      ?.signupButton
                      ?.enabled
                  )}

                  onToggle={() =>
                    handleSignupChange(
                      "enabled",
                      !Boolean(
                        draftState
                          ?.signupButton
                          ?.enabled
                      )
                    )
                  }

                  text={
                    draftState
                      ?.signupButton
                      ?.text ??
                    ""
                  }

                  onTextChange={(value) =>
                    handleSignupChange(
                      "text",
                      value
                    )
                  }

                  link={
                    draftState
                      ?.signupButton
                      ?.link ??
                    ""
                  }

                  onLinkChange={(value) =>
                    handleSignupChange(
                      "link",
                      value
                    )
                  }
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CmsNavbar;
    

 