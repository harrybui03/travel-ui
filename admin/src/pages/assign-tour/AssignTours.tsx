import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Table, Select, Button, Modal, Tag, List } from 'antd';
import { UserOutlined, CalendarOutlined, TeamOutlined, GlobalOutlined, DollarCircleOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'; // Added PlusCircleOutlined
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import moment from 'moment';

const { Option } = Select;

const API_URL = 'http://localhost:8080/api';

const AssignTours = () => {
    const [tours, setTours] = useState([]);
    const [allTourGuides, setAllTourGuides] = useState([]);
    const [selectedTourSchedule, setSelectedTourSchedule] = useState(null);
    // guidesToAssign will now store only the NEWLY selected guides from the dropdown
    const [guidesToAssign, setGuidesToAssign] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [assignmentSuccess, setAssignmentSuccess] = useState(false);

    function convertApiTourSchedules(apiSchedules) {
        return apiSchedules.map((apiSchedule) => {
            const parentTourData = apiSchedule.tour ? {
                id: apiSchedule.tour.id,
                tourName: apiSchedule.tour.tourName,
                transportation: apiSchedule.tour.transportation,
                maxCustomer: apiSchedule.tour.maxCustomer,
                description: apiSchedule.tour.description,
                price: apiSchedule.tour.price,
                tourDuration: apiSchedule.tour.tourDuration,
                destinations: apiSchedule.tour.destinations?.map(dest => ({ ...dest })) || []
            } : null;

            return {
                id: apiSchedule.id,
                startDate: apiSchedule.departureDate ? moment(apiSchedule.departureDate) : null,
                endDate: apiSchedule.returnDate ? moment(apiSchedule.returnDate) : null,
                currentlyAssignedGuideIds: apiSchedule.tourGuides?.map(guide => guide?.id).filter(id => id != null) || [],
                parentTour: parentTourData,
                display_name: parentTourData?.tourName || `Schedule ID: ${apiSchedule.id}`,
                tour_name: parentTourData?.tourName || 'N/A',
                transportation: parentTourData?.transportation || 'N/A',
                max_customer: parentTourData?.maxCustomer || 'N/A',
                description: parentTourData?.description || 'No description available.',
                price: parentTourData?.price !== null && parentTourData?.price !== undefined ? parentTourData.price : 'N/A',
                destinationsFromTour: parentTourData?.destinations || [],
            };
        });
    }

    function convertApiAllTourGuides(apiTourGuides) {
        return apiTourGuides.map((apiTourGuide) => ({
            id: apiTourGuide.id,
            name: apiTourGuide.fullname,
            position: apiTourGuide.position || 'N/A',
            email: apiTourGuide.email,
        }));
    }

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [schedulesResponse, allGuidesResponse] = await Promise.all([
                axios.get(`${API_URL}/assign/tours`),
                axios.get(`${API_URL}/assign/tour-guides`),
            ]);
            const convertedSchedules = convertApiTourSchedules(schedulesResponse.data);
            setTours(convertedSchedules);
            const convertedAllGuides = convertApiAllTourGuides(allGuidesResponse.data);
            setAllTourGuides(convertedAllGuides);
        } catch (error) {
            console.error('Error fetching data:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load initial data.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, [assignmentSuccess]);

    const handleShowAssignModal = (tourSchedule) => {
        setSelectedTourSchedule(tourSchedule);
        // Initialize guidesToAssign as empty, as dropdown is for NEW guides only
        setGuidesToAssign([]);
        setIsAssignModalVisible(true);
    };

    const handleHideAssignModal = () => {
        setIsAssignModalVisible(false);
        setSelectedTourSchedule(null);
        setGuidesToAssign([]);
    };

    const handleGuideSelectionChange = (selectedNewGuideIds) => {
        // These are the IDs of the newly selected guides from the filtered dropdown
        setGuidesToAssign(selectedNewGuideIds);
    };

    const handleAssignGuides = async () => {
        if (!selectedTourSchedule || !selectedTourSchedule.parentTour) {
            toast.error('No tour schedule selected or parent tour data is missing.');
            return;
        }

        setLoading(true);

        const existingGuideIds = selectedTourSchedule.currentlyAssignedGuideIds || [];
        // Combine existing guides with newly selected guides, ensuring uniqueness
        const finalGuideIds = [...new Set([...existingGuideIds, ...guidesToAssign])];

        const payload = {
            id: selectedTourSchedule.parentTour.id,
            tourName: selectedTourSchedule.parentTour.tourName,
            transportation: selectedTourSchedule.parentTour.transportation,
            maxCustomer: selectedTourSchedule.parentTour.maxCustomer,
            description: selectedTourSchedule.parentTour.description,
            price: selectedTourSchedule.parentTour.price,
            tourDuration: selectedTourSchedule.parentTour.tourDuration || null,
            tourSchedule: [
                {
                    id: selectedTourSchedule.id,
                    departureDate: selectedTourSchedule.startDate ? selectedTourSchedule.startDate.toISOString() : null,
                    returnDate: selectedTourSchedule.endDate ? selectedTourSchedule.endDate.toISOString() : null,
                    // Send the complete list (existing + new) to the backend
                    tourGuides: finalGuideIds.map(guideId => ({ id: guideId }))
                }
            ]
        };

        try {
            // Using the /assign/assign-tour-guide endpoint which expects the full tour-like structure
            // and for the backend to replace the schedule's guides with the provided list.
            await axios.post(`${API_URL}/assign/assign-tour-guide`, payload);

            const finalAssignedGuideNames = finalGuideIds
                .map(id => allTourGuides.find(guide => guide.id === id)?.name)
                .filter(Boolean);

            let successMessage = `Guides for "${selectedTourSchedule.display_name}" updated!`;
            if (finalAssignedGuideNames.length > 0) {
                successMessage += ` Now assigned: ${finalAssignedGuideNames.join(', ')}.`;
            } else {
                successMessage += ` All guides unassigned.`; // This case happens if existing were [] and new were []
            }
            toast.success(successMessage);

            setAssignmentSuccess(prev => !prev);
            handleHideAssignModal();
        } catch (error) {
            console.error('Assignment error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to assign guides.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const tourScheduleColumns = [
        {
            title: 'Tour / Schedule',
            dataIndex: 'display_name',
            key: 'display_name',
            ellipsis: true,
        },
        {
            title: 'Departure',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => date ? date.format('MMM DD, YYYY HH:mm') : 'N/A',
            sorter: (a, b) => (a.startDate ? a.startDate.valueOf() : 0) - (b.startDate ? b.startDate.valueOf() : 0),
        },
        {
            title: 'Return',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => date ? date.format('MMM DD, YYYY HH:mm') : 'N/A',
            sorter: (a, b) => (a.endDate ? a.endDate.valueOf() : 0) - (b.endDate ? b.endDate.valueOf() : 0),
        },
        {
            title: 'Assigned Guides',
            key: 'assigned_guides_list',
            dataIndex: 'currentlyAssignedGuideIds',
            render: (guideIds, record) => {
                const assignedNames = guideIds
                    .map(id => allTourGuides.find(guide => guide.id === id)?.name)
                    .filter(Boolean);
                if (assignedNames.length === 0) return <Tag color="orange">None</Tag>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {assignedNames.map(name => <Tag color="blue" key={`${record.id}-${name}`}>{name}</Tag>)}
                    </div>
                );
            },
        },
        {
            title: 'Max Pax',
            dataIndex: ['parentTour', 'maxCustomer'],
            key: 'max_customer',
            align: 'center',
            render: (pax) => pax || 'N/A',
        },
        {
            title: 'Price',
            dataIndex: ['parentTour', 'price'],
            key: 'price',
            render: (price) => (price !== null && price !== undefined) ? `$${Number(price).toFixed(2)}` : 'N/A',
            align: 'right',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 150,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<TeamOutlined />}
                    onClick={() => handleShowAssignModal(record)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    Manage Guides
                </Button>
            ),
        },
    ];

    const getCurrentlyAssignedGuideNamesInModal = () => {
        if (!selectedTourSchedule || !selectedTourSchedule.currentlyAssignedGuideIds) return [];
        return selectedTourSchedule.currentlyAssignedGuideIds
            .map(id => allTourGuides.find(g => g.id === id)?.name)
            .filter(Boolean);
    };

    // Memoize the list of guides available for assignment to prevent re-filtering on every render
    const availableGuidesForAssignment = useMemo(() => {
        if (!selectedTourSchedule || !allTourGuides.length) return [];
        const currentlyAssignedIds = selectedTourSchedule.currentlyAssignedGuideIds || [];
        return allTourGuides.filter(guide => !currentlyAssignedIds.includes(guide.id));
    }, [selectedTourSchedule, allTourGuides]);


    return (
        <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tour Schedule & Guide Assignment</h1>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl">
                <Table
                    dataSource={tours}
                    columns={tourScheduleColumns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true, size: 'default' }}
                    scroll={{ x: 1200 }}
                    className="ant-table-smooth"
                />
            </div>

            {selectedTourSchedule && selectedTourSchedule.parentTour && (
                <Modal
                    title={
                        <div className="flex items-center text-lg font-semibold text-gray-700">
                            <TeamOutlined className="mr-3 text-xl text-blue-600" />
                            Manage Guides for: {selectedTourSchedule.display_name}
                        </div>
                    }
                    open={isAssignModalVisible}
                    onCancel={handleHideAssignModal}
                    width={650}
                    destroyOnClose
                    footer={[
                        <Button key="cancel" onClick={handleHideAssignModal} className="hover:bg-gray-200 transition-colors duration-200">
                            Cancel
                        </Button>,
                        <Button
                            key="assign"
                            type="primary"
                            onClick={handleAssignGuides}
                            loading={loading}
                            icon={<UserOutlined />} // Or <PlusCircleOutlined /> if more appropriate for "add"
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                        >
                            Save Assignments
                        </Button>,
                    ]}
                >
                    <div className="space-y-6 p-2">
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                            <h4 className="text-md font-semibold mb-3 text-gray-700 flex items-center">
                                <InfoCircleOutlined className="mr-2 text-blue-500" /> Schedule Overview
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <p><strong className="font-medium text-gray-600">Tour:</strong> {selectedTourSchedule.parentTour.tourName}</p>
                                <p><strong className="font-medium text-gray-600">Max Pax:</strong> {selectedTourSchedule.parentTour.maxCustomer || 'N/A'}</p>
                                <p><CalendarOutlined className="mr-1 text-green-500" /> <strong className="font-medium text-gray-600">Departure:</strong> {selectedTourSchedule.startDate ? selectedTourSchedule.startDate.format('MMM DD, YYYY HH:mm') : 'N/A'}</p>
                                <p><CalendarOutlined className="mr-1 text-red-500" /> <strong className="font-medium text-gray-600">Return:</strong> {selectedTourSchedule.endDate ? selectedTourSchedule.endDate.format('MMM DD, YYYY HH:mm') : 'N/A'}</p>
                                <p><DollarCircleOutlined className="mr-1 text-yellow-500" /> <strong className="font-medium text-gray-600">Price:</strong> {(selectedTourSchedule.parentTour.price !== null && selectedTourSchedule.parentTour.price !== undefined) ? `$${Number(selectedTourSchedule.parentTour.price).toFixed(2)}` : 'N/A'}</p>
                                {selectedTourSchedule.parentTour.destinations && selectedTourSchedule.parentTour.destinations.length > 0 && (
                                    <p className="sm:col-span-2"><GlobalOutlined className="mr-1 text-purple-500" /> <strong className="font-medium text-gray-600">Destinations:</strong> {selectedTourSchedule.parentTour.destinations.map(d => d.name).join(', ')}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                            <h4 className="text-md font-semibold mb-2 text-gray-700">Currently Assigned Guides:</h4>
                            {getCurrentlyAssignedGuideNamesInModal().length > 0 ? (
                                <List
                                    size="small"
                                    bordered
                                    dataSource={getCurrentlyAssignedGuideNamesInModal()}
                                    renderItem={(name) => (
                                        <List.Item className="py-2">
                                            <Tag color="geekblue" className="text-sm px-2 py-0.5">{name}</Tag>
                                        </List.Item>
                                    )}
                                    className="bg-white rounded"
                                />
                            ) : (
                                <p className="text-gray-500 italic text-sm">No guides currently assigned to this schedule.</p>
                            )}
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                            <label htmlFor="tourGuideSelect" className="block text-md font-semibold mb-2 text-gray-700 flex items-center">
                                <PlusCircleOutlined className="mr-2 text-green-600"/> Add New Tour Guide(s):
                            </label>
                            <Select
                                id="tourGuideSelect"
                                mode="multiple"
                                className="w-full text-sm"
                                placeholder="Select new guides to add..."
                                onChange={handleGuideSelectionChange}
                                value={guidesToAssign} // Tracks ONLY newly selected guides
                                allowClear
                                loading={allTourGuides.length === 0 && loading && !selectedTourSchedule} // Be more specific with loading
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                optionRender={(option) => (
                                    <div className="flex justify-between items-center">
                                        <span>{option.data.label}</span>
                                        <Tag color="volcano" className="text-xs">{option.data.customdata?.position || 'Guide'}</Tag>
                                    </div>
                                )}
                            >
                                {/* Options are now from the filtered list */}
                                {availableGuidesForAssignment.map((guide) => (
                                    <Option key={guide.id} value={guide.id} label={guide.name} customdata={{ position: guide.position }}>
                                        {guide.name}
                                    </Option>
                                ))}
                            </Select>
                            {availableGuidesForAssignment.length === 0 && selectedTourSchedule && (
                                <p className="text-xs text-gray-500 mt-2 italic">All available tour guides are already assigned to this schedule or no other guides are available.</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Only guides not already assigned to this schedule are shown. Selected guides here will be added.
                            </p>
                        </div>
                    </div>
                </Modal>
            )}

            <ToastContainer
                position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"
            />
        </div>
    );
};

export default AssignTours;