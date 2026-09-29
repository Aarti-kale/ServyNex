import React from "react";
import CMSOverviewHeader from "../../../components/AdminComponents/websiteCMS/Overview/Cmsoverviewheader";
import SectionStatusCard from "../../../components/AdminComponents/websiteCMS/Overview/Sectionstatuscard";
import RecentUpdatesCard from "../../../components/AdminComponents/websiteCMS/Overview/RecentUpdatesCard";
import QuickTipBanner from "../../../components/AdminComponents/websiteCMS/Overview/QuickTipBanner";

export default function CMSOverview() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <CMSOverviewHeader
        onRefresh={() => console.log("Refreshing overview...")}
      />

      <div className="container-fluid px-4 pb-3">
        <div className="row g-3">
          <div className="col-lg-6">
            <SectionStatusCard
              onSelectSection={(name) => console.log("Manage section:", name)}
              onManageAll={() => console.log("Manage all sections")}
            />
          </div>
          <div className="col-lg-6">
            <RecentUpdatesCard
              onViewAll={() => console.log("View all updates")}
            />
          </div>
        </div>
      </div>

      <QuickTipBanner />
    </div>
  );
}
