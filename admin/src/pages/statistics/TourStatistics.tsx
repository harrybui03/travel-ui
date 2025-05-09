import React, { useState } from 'react';
import { Table, DatePicker, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import locale from 'antd/locale/en_US';
import axios from 'axios';

const { RangePicker } = DatePicker;
const API_URL = 'http://localhost:8080/api'
const TourStatistics = () => {
    const [dateRange, setDateRange] = useState(null);
    const [tourData, setTourData] = useState([]);
    const [selectedTourSchedules, setSelectedTourSchedules] = useState([]);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const fetchTourStatistics = async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + `/statistic/tour?startDate=${startDate}&endDate=${endDate}`)
            setTourData(response.data);
        } catch (error) {
            console.error("Error fetching tour statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTourSchedules = async (tourId) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + `/statistic/tour/${tourId}`);
            setSelectedTourSchedules(response.data);
            setIsScheduleModalVisible(true);
        } catch (error) {
            console.error("Error fetching tour schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTourBookings = async (scheduleId) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + `/statistic/tour/schedule/${scheduleId}/bookings`);
            console.log(response.data)
            setSelectedBookings(response.data);
            setIsBookingModalVisible(true);
        } catch (error) {
            console.error("Error fetching tour bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!dateRange || dateRange.length !== 2) {
            return;
        }
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        fetchTourStatistics(startDate, endDate);
    };

    const showSchedulesModal = (record) => {
        fetchTourSchedules(record.tourId);
    };

    const handleScheduleModalClose = () => {
        setIsScheduleModalVisible(false);
    };

    const showBookingsModal = (record) => {
        fetchTourBookings(record.tourScheduleId);
    };

    const handleBookingModalClose = () => {
        setIsBookingModalVisible(false);
    };

    const tourColumns = [
        {
            title: 'Tour Code',
            dataIndex: 'tourId',
            key: 'tourId',
        },
        {
            title: 'Tour Name',
            dataIndex: 'tourName',
            key: 'tourName',
        },
        {
            title: 'Total Tickets Sold',
            dataIndex: 'totalTickets',
            key: 'totalTickets',
            sorter: (a, b) => a.totalTickets - b.totalTickets,
        },
        {
            title: 'Total Revenue Earned',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (text) => `${text ? parseFloat(text).toLocaleString('en-US') : 0}$`,
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
            sortDirections: ['descend'],
        },
    ];

    const scheduleColumns = [
        {
            title: 'Schedule ID',
            dataIndex: 'tourScheduleId',
            key: 'tourScheduleId',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => dayjs(text).format('YYYY-MM-DD'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => dayjs(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Tour Guide',
            dataIndex: 'tourGuide',
            key: 'tourGuide',
        },
        {
            title: 'Total Tickets',
            dataIndex: 'totalTicket',
            key: 'totalTicket',
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (text) => `${text ? parseFloat(text).toLocaleString('en-US') : 0}$`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button size="small" onClick={() => showBookingsModal(record)}>
                    View Bookings
                </Button>
            ),
        },
    ];

    const bookingColumns = [
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerFullName',
            key: 'customerFullName',
        },
        {
            title: 'Number of Tickets',
            dataIndex: 'numberOfTickets',
            key: 'numberOfTickets',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => `${text ? parseFloat(text).toLocaleString('en-US') : 0}$`,
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Tour Revenue Statistics</h2>
            <div className="mb-4 flex items-center space-x-2">
                <RangePicker
                    locale={locale}
                    onChange={handleDateRangeChange}
                />
                <Button icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                    Statistics
                </Button>
            </div>

            <Table
                columns={tourColumns}
                dataSource={tourData}
                loading={loading}
                onRow={(record) => ({
                    onClick: () => {
                        showSchedulesModal(record);
                    },
                    className: 'cursor-pointer hover:bg-gray-100',
                })}
                rowKey="tourId"
            />

            <Modal
                title="Tour Schedules"
                open={isScheduleModalVisible}
                onCancel={handleScheduleModalClose}
                width={900}
                footer={null}
                loading={loading}
            >
                <Table
                    columns={scheduleColumns}
                    dataSource={selectedTourSchedules}
                    rowKey="tourScheduleId"
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => {
                            showBookingsModal(record);
                        },
                        className: 'cursor-pointer hover:bg-gray-100',
                    })}
                />
            </Modal>

            <Modal
                title="Booking Details"
                open={isBookingModalVisible}
                onCancel={handleBookingModalClose}
                footer={null}
                width={700}
                loading={loading}
            >
                <Table
                    columns={bookingColumns}
                    dataSource={selectedBookings}
                    rowKey="bookingId"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default TourStatistics;