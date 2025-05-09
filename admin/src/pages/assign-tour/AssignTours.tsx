import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import moment from 'moment'; // Import the moment library for date formatting

const { Option } = Select;

const API_URL = 'http://localhost:8080/api'

const AssignTours = () => {
    const [tours, setTours] = useState([]);
    const [tourGuides, setTourGuides] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [assignedGuide, setAssignedGuide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assignedGuidesMap, setAssignedGuidesMap] = useState({});
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);

    function convertApiToursToMockTours(apiTours) {
        return apiTours.map((apiTour) => ({
            id: apiTour.id,
            tour_name: apiTour.tour?.tourName || null,
            transportation: apiTour.tour?.transportation || null,
            max_customer: apiTour.tour?.maxCustomer || null,
            description: apiTour.tour?.description || null,
            price: apiTour.tour?.price || null,
            destination: apiTour.tour?.destinations?.map((dest) => ({
                id: dest.id,
                name: dest.name,
                location: dest.location,
            })) || [],
            assignedGuideId: apiTour.employee?.id || null,
            startDate: apiTour.departureDate ? moment(apiTour.departureDate).format('YYYY-MM-DD') : null,
            endDate: apiTour.returnDate ? moment(apiTour.returnDate).format('YYYY-MM-DD') : null,
        }));
    }

    function convertApiTourGuidesToMockTourGuides(apiTourGuides) {
        return apiTourGuides.map((apiTourGuide) => ({
            id: apiTourGuide.id,
            name: apiTourGuide.fullname,
        }));
    }

    const getGuideName = (guideId) => {
        const guide = tourGuides.find((g) => g.id === guideId);
        return guide ? guide.name : 'Not Assigned';
    };

    const fetchInitialData = async () => {
        try{
            const [toursResponse, tourGuidesResponse] = await Promise.all([
                axios.get(API_URL + '/assign/tours'),
                axios.get(API_URL + '/assign/tour-guides'),
            ]);
            setTours(convertApiToursToMockTours(toursResponse.data));
            setTourGuides(convertApiTourGuidesToMockTourGuides(tourGuidesResponse.data));
            const initialMap = {};
            toursResponse.data.forEach((tour) => {
                if (tour.assignedGuideId) {
                    initialMap[tour.id] = tour.assignedGuideId;
                }
            });
            setAssignedGuidesMap(initialMap);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load tours and tour guides.');
        }
    }

    useEffect(() => {
        fetchInitialData();
        setAssignmentSuccess(false);
    }, [assignmentSuccess]);



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tour Name',
            dataIndex: 'tour_name',
            key: 'tour_name',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Transportation',
            dataIndex: 'transportation',
            key: 'transportation',
        },
        {
            title: 'Max Customer',
            dataIndex: 'max_customer',
            key: 'max_customer',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Destinations',
            dataIndex: 'destination',
            key: 'destination',
            render: (destinations) => (
                <ul>
                    {destinations.map((dest) => (
                        <li key={dest.id}>{dest.name}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Assigned Guide',
            dataIndex: 'assignedGuideId',
            key: 'assignedGuide',
            render: (assignedGuideId) => getGuideName(assignedGuideId),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleShowAssignModal(record)}>
                    Assign/Edit Guide
                </Button>
            ),
        },
    ];

    const handleShowAssignModal = (tour) => {
        setSelectedTour(tour);
        setAssignedGuide(assignedGuidesMap[tour.id] || null);
        setIsAssignModalVisible(true);
    };

    const handleHideAssignModal = () => {
        setIsAssignModalVisible(false);
        setSelectedTour(null);
        setAssignedGuide(null);
    };

    const handleGuideChange = (value) => {
        setAssignedGuide(value);
    };

    const handleAssign = async () => {
        if (!selectedTour) {
            toast.error('Please select a tour first.');
            return;
        }
        if (!assignedGuide && assignedGuide !== null) {
            toast.info('No guide selected for assignment.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(API_URL + '/assign/assign-employee', {
                "tourScheduleId":selectedTour.id,
                "employeeId":assignedGuide
            });

            toast.success(
                `Tour "${selectedTour.tour_name}" ${
                    assignedGuide
                        ? `assigned to guide "${
                            tourGuides.find((guide) => guide.id === assignedGuide)?.name
                        }"`
                        : 'unassigned'
                } successfully!`
            );

            setAssignmentSuccess(true);
            handleHideAssignModal();
        } catch (error) {
            toast.error('Failed to assign/unassign tour guide.');
            console.error('Assignment error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Tour List</h2>
            <Table
                dataSource={tours}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 12 }}
            />

            <Modal
                title={selectedTour ? 'Assign/Edit Tour Guide' : 'Assign Tour Guide'}
                open={isAssignModalVisible}
                onCancel={handleHideAssignModal}
                footer={[
                    <Button key="cancel" onClick={handleHideAssignModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="assign"
                        type="primary"
                        onClick={handleAssign}
                        loading={loading}
                        icon={<UserOutlined />}
                    >
                        {assignedGuide ? 'Assign Guide' : 'Unassign Guide'}
                    </Button>,
                ]}
            >
                {selectedTour ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">
                            Tour: {selectedTour.tour_name}
                        </h3>
                        <div className="mb-2">
                            <label htmlFor="tourGuide" className="block text-gray-700 text-sm font-bold mb-2">
                                Select Tour Guide:
                            </label>
                            <Select
                                id="tourGuide"
                                className="w-full"
                                placeholder="Select a tour guide"
                                onChange={handleGuideChange}
                                value={assignedGuide}
                                allowClear
                            >
                                {tourGuides.map((guide) => (
                                    <Option key={guide.id} value={guide.id}>
                                        {guide.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                ) : (
                    <p>Click on "Assign/Edit Guide" for a tour to assign a tour guide.</p>
                )}
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default AssignTours;