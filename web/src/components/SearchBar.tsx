import {useState} from "react";
import {Button, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const SearchBar = ({ onSearch }: { onSearch: (destination: string) => void }) => {
    const [destination, setDestination] = useState('');

    const handleSearch = () => {
        onSearch(destination);
    };

    return (
        <div className="container mx-auto py-12">
            <div className="flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-1"
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined/>}
                    onClick={handleSearch}
                    size="large"
                >
                    Search
                </Button>
            </div>
        </div>
    );
};

export default SearchBar;