import {useState} from "react";
import {mockBlogs, mockTours} from "../mockdata/mockData.ts";
import SearchBar from "./SearchBar.tsx";
import {Carousel} from "antd";
import TourList from "./TourList.tsx";
import BlogList from "./BlogList.tsx";

const MainContent = () => {
    const [filteredTours, setFilteredTours] = useState(mockTours);

    const handleSearch = (destination: string) => {
        if (destination) {
            const filtered = mockTours.filter(tour =>
                tour.destination.toLowerCase().includes(destination.toLowerCase())
            );
            setFilteredTours(filtered);
        } else {
            setFilteredTours(mockTours);
        }
    };

    return (
        <>
            <SearchBar onSearch={handleSearch} />
            <Carousel autoplay className="w-full">
                {/* Add your slider images here */}
                <div>
                    <img src="https://placehold.co/1200x400/EEE/31343C" alt="Slider 1" className="w-full h-auto object-cover" />
                </div>
                <div>
                    <img src="https://placehold.co/1200x400/EEE/31343C" alt="Slider 2" className="w-full h-auto object-cover" />
                </div>
                <div>
                    <img src="https://placehold.co/1200x400/EEE/31343C" alt="Slider 3" className="w-full h-auto object-cover" />
                </div>
            </Carousel>
            <TourList tours={filteredTours} />
            <BlogList blogs={mockBlogs} />
        </>
    );
};

export default MainContent;