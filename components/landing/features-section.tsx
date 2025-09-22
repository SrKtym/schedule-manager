'use client';

import { Card, CardBody } from "@heroui/react";
import { features } from "@/constants/definitions";
import { motion } from "framer-motion";

export function FeaturesSection() {
    return (
        <section 
            className="px-4 py-20 bg-gradient-to-b from-gray-200 to-background" 
            id="features"
        >
            <div className="container mx-auto max-w-6xl">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                        amount: 0.5,
                        once: true
                    }}
                >
                    <h2 className="text-3xl mb-4">
                        このアプリの特徴
                    </h2>
                </motion.div>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                        amount: 0.5,
                        once: true
                    }}
                >
                    {features.map((feature) => (
                        <Card 
                            key={feature.title}
                            isHoverable
                        >
                            <CardBody className="text-center p-6">
                                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary"/>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-default-600">
                                    {feature.description}
                                </p>
                            </CardBody>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}