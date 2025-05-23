import React, { useState, useEffect } from 'react'; // Added useEffect for initial load (optional)
import { Table, DatePicker, Button, Modal, Tag, Typography, Empty } from 'antd'; // Added Typography, Empty
import { SearchOutlined, EyeOutlined, UsergroupAddOutlined, DollarCircleOutlined, CalendarOutlined } from '@ant-design/icons'; // Added more icons
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Ensure you have this or your preferred locale
// import locale from 'antd/locale/en_US'; // Already have this for DatePicker
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Added ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';


const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const API_URL = 'http://localhost:8080/api';

const TourStatistics = () => {
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]); // Default to last 30 days
    const [tourData, setTourData] = useState([]); // Will hold the full nested data
    const [selectedTour, setSelectedTour] = useState(null); // To store the selected tour for the schedule modal title
    const [selectedTourSchedules, setSelectedTourSchedules] = useState([]);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null); // To store selected schedule for booking modal title
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const fetchTourStatistics = async (startDate, endDate) => {
        setLoading(true);
        setTourData([]); // Clear previous data
        try {
            const response = await axios.get(`${API_URL}/statistic/tour?startDate=${startDate}&endDate=${endDate}`);
            // Assuming response.data is an array of tour statistics objects
            // Each object contains tourScheduleStatList, and each schedule contains tourBookingStatList
            setTourData(response.data || []);
            if (!response.data || response.data.length === 0) {
                toast.info("No tour statistics found for the selected date range.");
            }
        } catch (error) {
            console.error("Error fetching tour statistics:", error);
            toast.error(error.response?.data?.error || error.message || "Failed to fetch tour statistics.");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount (optional)
    useEffect(() => {
        if (dateRange && dateRange.length === 2) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount if dateRange is preset


    const handleSearch = () => {
        if (!dateRange || dateRange.length !== 2) {
            toast.warn('Please select a valid date range.');
            return;
        }
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        fetchTourStatistics(startDate, endDate);
    };

    // No API call needed here, data is already in tourRecord
    const showSchedulesModal = (tourRecord) => {
        setSelectedTour(tourRecord); // Store the whole tour record
        setSelectedTourSchedules(tourRecord.tourScheduleStatList || []);
        setIsScheduleModalVisible(true);
    };

    const handleScheduleModalClose = () => {
        setIsScheduleModalVisible(false);
        setSelectedTourSchedules([]);
        setSelectedTour(null);
    };

    // No API call needed here, data is already in scheduleRecord
    const showBookingsModal = (scheduleRecord) => {
        setSelectedSchedule(scheduleRecord); // Store the schedule record
        setSelectedBookings(scheduleRecord.tourBookingStatList || []);
        setIsBookingModalVisible(true);
    };

    const handleBookingModalClose = () => {
        setIsBookingModalVisible(false);
        setSelectedBookings([]);
        setSelectedSchedule(null);
    };

    const tourColumns = [
        {
            title: 'ID',
            dataIndex: 'tourId',
            key: 'tourId',
            width: 80,
        },
        {
            title: 'Tour Name',
            dataIndex: 'tourName',
            key: 'tourName',
            ellipsis: true,
        },
        {
            title: 'Total Tickets',
            dataIndex: 'totalTickets',
            key: 'totalTickets',
            align: 'right',
            sorter: (a, b) => a.totalTickets - b.totalTickets,
            render: (text) => text || 0,
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            align: 'right',
            render: (text) => `$${text ? parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent onRow click if button is clicked
                        showSchedulesModal(record);
                    }}
                >
                    View Schedules
                </Button>
            ),
        },
    ];

    const scheduleColumns = [
        {
            title: 'Sch. ID',
            dataIndex: 'tourScheduleId',
            key: 'tourScheduleId',
            width: 100,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : 'N/A',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : 'N/A',
        },
        {
            title: 'Revenue',
            dataIndex: 'totalRevenue', // Assuming this field name in tourScheduleStatList items
            key: 'scheduleTotalRevenue',
            align: 'right',
            render: (text) => `$${text ? parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        showBookingsModal(record);
                    }}
                >
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
            ellipsis: true,
        },
        {
            title: 'Tickets',
            dataIndex: 'numberOfTickets',
            key: 'numberOfTickets',
            align: 'right',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right',
            render: (text) => `$${text ? parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`,
        },
    ];

    return (
        <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="mb-6 text-gray-700">Tour Revenue Statistics</Title>
            <div className="mb-6 p-6 bg-white rounded-lg shadow-md flex flex-wrap items-center gap-4">
                <RangePicker
                    // locale={locale} // Antd's DatePicker should pick up global locale if ConfigProvider is used, or it defaults
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    className="w-auto md:w-80"
                    allowClear
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading} className="shadow-sm">
                    Fetch Statistics
                </Button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl">
                <Table
                    columns={tourColumns}
                    dataSource={tourData}
                    loading={loading}
                    rowKey="tourId"
                    scroll={{ x: 'max-content' }}
                    locale={{ emptyText: <Empty description="No tour statistics found for the selected criteria." /> }}
                />
            </div>


            <Modal
                title={<span className="font-semibold text-lg"><CalendarOutlined className="mr-2" />Tour Schedules for: {selectedTour?.tourName || 'N/A'}</span>}
                open={isScheduleModalVisible}
                onCancel={handleScheduleModalClose}
                width={900}
                footer={<Button onClick={handleScheduleModalClose}>Close</Button>}
                destroyOnClose // Good practice
            >
                <Table
                    columns={scheduleColumns}
                    dataSource={selectedTourSchedules}
                    rowKey="tourScheduleId" // Make sure DTO for schedule has tourScheduleId
                    pagination={{ pageSize: 5 }}
                    // onRow={(record) => ({ // Using action button is more explicit
                    //     onClick: () => {
                    //         showBookingsModal(record);
                    //     },
                    //     className: 'cursor-pointer hover:bg-gray-100 transition-colors',
                    // })}
                    scroll={{ y: 400 }}
                    locale={{ emptyText: <Empty description="No schedules found for this tour in the selected date range." /> }}
                />
            </Modal>

            <Modal
                title={<span className="font-semibold text-lg"><UsergroupAddOutlined className="mr-2" />Booking Details for Schedule ID: {selectedSchedule?.tourScheduleId || 'N/A'}</span>}
                open={isBookingModalVisible}
                onCancel={handleBookingModalClose}
                footer={<Button onClick={handleBookingModalClose}>Close</Button>}
                width={700}
                destroyOnClose
            >
                <Table
                    columns={bookingColumns}
                    dataSource={selectedBookings}
                    rowKey="bookingId" // Make sure DTO for booking has bookingId
                    pagination={{ pageSize: 5 }}
                    scroll={{ y: 300 }}
                    locale={{ emptyText: <Empty description="No bookings found for this schedule." /> }}
                />
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick theme="colored"/>
        </div>
    );
};

export default TourStatistics;