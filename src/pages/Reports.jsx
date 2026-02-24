import React from "react";
import Card from "../components/common/Card";
import { FiPieChart, FiBarChart2 } from "react-icons/fi";

const Reports = () => {
    return (
        <div>
            <div className="p-4 px-8 mb-8 shadow">
                <h4 className="text-3xl font-semibold">Reports</h4>
            </div>
            <div className="px-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card customClass="bg-white shadow">
                        <h5 className="font-bold mb-4 flex items-center gap-2"><FiPieChart /> Monthly Activity</h5>
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
                            [Mock Pie Chart Placeholder]
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-600">
                            <span>Issues: 45</span>
                            <span>Returns: 38</span>
                        </div>
                    </Card>

                    <Card customClass="bg-white shadow">
                        <h5 className="font-bold mb-4 flex items-center gap-2"><FiBarChart2 /> Popular Books</h5>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>1. The Great Gatsby</span>
                                <span className="font-bold text-green-600">Borrow Count: 12</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>2. 1984</span>
                                <span className="font-bold text-green-600">Borrow Count: 9</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>3. To Kill a Mockingbird</span>
                                <span className="font-bold text-green-600">Borrow Count: 7</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Reports;
