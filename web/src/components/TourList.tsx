import {mockTours} from "../mockdata/mockData.ts";
import TourCard from "./TourCard.tsx";

const TourList = ({ tours }: { tours: typeof mockTours }) => {
    return (
        <div className="container mx-auto py-12">
            <h2 className="text-3xl font-semibold mb-8 text-center">Featured Tours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                ))}
            </div>
        </div>
    );
};

export default TourList;
