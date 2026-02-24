import React from "react";
import Card from "./common/Card";

const DashboardCard = ({ title, count, Icon }) => {
  return (
    <Card customClass="!p-6 !py-5 card-featured group">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label-stat mb-1">{title}</p>
          <h3 className="metric-number group-hover:text-indigo-600 transition-colors duration-200">{count}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 flex-shrink-0 [&>svg]:w-6 [&>svg]:h-6 text-indigo-600">
          {Icon}
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
