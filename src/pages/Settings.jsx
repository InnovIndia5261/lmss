import React from "react";
import Card from "../components/common/Card";
import { DEMO_MODE } from "@/shared/utils/demo";
import { resetDemoData } from "@/lib/demoData/resetDemo";

const Settings = () => {
    const handleResetDemo = () => {
        if (!DEMO_MODE) return;
        resetDemoData();
        window.location.reload();
    };

    return (
        <div>
            <div className="p-4 px-8 mb-8 shadow">
                <h4 className="text-3xl font-semibold">Settings</h4>
            </div>
            <div className="px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_MODE && (
                    <Card customClass="bg-amber-50 border-2 border-amber-200 md:col-span-2">
                        <h5 className="font-bold mb-2">Demo Mode</h5>
                        <p className="text-sm text-gray-600 mb-4">Reset all sample data (courses, lessons, assignments, exams) to initial state.</p>
                        <button
                            onClick={handleResetDemo}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"
                        >
                            Reset Demo Data
                        </button>
                    </Card>
                )}
                <Card customClass="bg-white shadow">
                    <h5 className="font-bold mb-4">Appearance</h5>
                    <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-0 transition-transform"></div>
                        </div>
                    </div>
                </Card>

                <Card customClass="bg-white shadow">
                    <h5 className="font-bold mb-4">Notifications</h5>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span>Email Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span>SMS Alerts</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
