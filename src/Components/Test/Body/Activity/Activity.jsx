import React from "react";
import './Activity.scss';
import { BsGraphUp } from "react-icons/bs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Activity = () => {
    const revenueData = [
        { month: "January", revenue: 10000 },
        { month: "February", revenue: 8500 },
        { month: "March", revenue: 9200 },
        { month: "April", revenue: 11000 },
        { month: "May", revenue: 12300 },
        { month: "June", revenue: 10700 },
        { month: "July", revenue: 11500 },
        { month: "August", revenue: 13200 },
        { month: "September", revenue: 12800 },
        { month: "October", revenue: 14000 },
        // { month: "November", revenue: 13500 },
        // { month: "December", revenue: 15000 }
    ];

    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Monthly Revenue</h1>
                <BsGraphUp className="icon" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Activity;
