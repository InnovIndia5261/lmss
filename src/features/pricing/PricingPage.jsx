import React, { useContext } from "react";
import { SubscriptionContext } from "@/context/SubscriptionContext";
import Card from "@/components/common/Card";
import { FiCheck } from "react-icons/fi";

const PricingPage = () => {
  const { plans, getSubscription } = useContext(SubscriptionContext);
  const currentSub = getSubscription();

  return (
    <div>
      <div className="p-4 px-8 mb-8 shadow">
        <h4 className="text-3xl font-semibold">Pricing</h4>
        <p className="text-gray-600 mt-1">Choose the plan that fits your organization</p>
      </div>
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentSub?.planId === plan._id;
          return (
            <Card
              key={plan._id}
              customClass={`bg-white shadow ${isCurrent ? "ring-2 ring-indigo-500" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h5 className="font-bold text-lg">{plan.name}</h5>
                {isCurrent && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">Current</span>}
              </div>
              <div className="text-3xl font-bold mb-2">
                ${plan.priceMonthly}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">${plan.priceYearly}/yr (save 2 months)</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <FiCheck className="text-green-500 flex-shrink-0" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                className={`w-full py-2 rounded-lg font-medium ${isCurrent ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
              >
                {isCurrent ? "Current Plan" : "Select Plan"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;
