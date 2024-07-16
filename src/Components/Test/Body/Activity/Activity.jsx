import React, { useState, useEffect } from "react";
import './Activity.scss';
import { BsGraphUp } from "react-icons/bs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Activity = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    // const [month, setMonth] = useState(new Date().getMonth() + 1); // January is 0

    useEffect(() => {
        fetchRevenueData(year);
    }, [year]);

    const fetchRevenueData = async (year) => {
        try {
            const response = await axios.get(`http://localhost:8080/booking/revenue-monthly?year=${year}`);
            setRevenueData(response.data);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    // const handleMonthChange = (event) => {
    //     setMonth(event.target.value);
    // };

    return (
        <div className="activitySection">
            <div className="heading flex">
                <h1>Monthly Revenue</h1>
                <BsGraphUp className="icon" />
            </div>
            <div className="controls">
                <label>
                    Year:
                    <select value={year} onChange={handleYearChange}>
                        {[...Array(10)].map((_, i) => {
                            const y = new Date().getFullYear() - i;
                            return <option key={y} value={y}>{y}</option>
                        })}
                    </select>
                </label>
                {/* <label>
                    Month:
                    <select value={month} onChange={handleMonthChange}>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </label> */}
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
