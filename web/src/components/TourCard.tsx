import {cardVariants, mockTours} from "../mockdata/mockData.ts";
import {Card} from "antd";
import { motion } from 'framer-motion';
const TourCard = ({ tour }: { tour: typeof mockTours[0] }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <Card
                hoverable
                cover={<img alt={tour.title} src={tour.imageUrl} className="h-48 object-cover w-full" />}
                className="mb-6 transition-transform transform hover:scale-105"
            >
                <Card.Meta
                    title={tour.title}
                    description={
                        <div className="flex justify-between">
                            <span>{tour.destination}</span>
                            <span className="font-semibold">${tour.price}</span>
                        </div>
                    }
                />
            </Card>
        </motion.div>
    );
};

export default TourCard;