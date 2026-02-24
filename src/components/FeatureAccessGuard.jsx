import React, { useContext } from "react";
import { SubscriptionContext } from "@/context/SubscriptionContext";
import { OrganizationContext } from "@/context/OrganizationContext";

/**
 * FeatureAccessGuard - Gates features by plan and org flags.
 * @param {string} feature - Plan feature (analytics, liveClasses, codeArena, microLearning)
 * @param {string} orgFlag - Org feature flag (optional, from featureFlags)
 * @param {React.ReactNode} children - Content when allowed
 * @param {React.ReactNode} fallback - Content when blocked
 */
const FeatureAccessGuard = ({ feature, orgFlag, children, fallback = null }) => {
  const { hasFeature } = useContext(SubscriptionContext);
  const { hasFeatureFlag, currentOrgId } = useContext(OrganizationContext);
  const orgId = currentOrgId || "org-1";

  const planAllowed = feature ? hasFeature(feature, orgId) : true;
  const flagAllowed = orgFlag ? hasFeatureFlag(orgFlag, orgId) : true;

  if (planAllowed && flagAllowed) return <>{children}</>;
  return <>{fallback}</>;
};

export default FeatureAccessGuard;
