
import React from "react";
import './Activity.scss';
import { BsGraphUp } from "react-icons/bs";

const Activity = () => {
    const revenueData = [
        { month: "January", revenue: "$10,000" },
        { month: "February", revenue: "$8,500" },
        { month: "March", revenue: "$9,200" },
        { month: "April", revenue: "$11,000" },
        { month: "May", revenue: "$12,300" },
        { month: "June", revenue: "$10,700" },
        { month: "July", revenue: "$11,500" },
        { month: "August", revenue: "$13,200" },
        { month: "September", revenue: "$12,800" },
        { month: "October", revenue: "$14,000" },
        // { month: "November", revenue: "$13,500" },
        // { month: "December", revenue: "$15,000" }
    ];

    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Monthly Revenue</h1>
                <BsGraphUp className="icon" />
            </div>
            <div className="revenueList">
                {revenueData.map((data, index) => (
                    <div key={index} className="revenueItem flex">
                        <span>{data.month}</span>
                        <span>{data.revenue}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activity;
