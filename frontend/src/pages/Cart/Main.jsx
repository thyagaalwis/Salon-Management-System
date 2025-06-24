import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard'; 

const Main = () => {
    const [store, setStore] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8076/store')
            .then((response) => {
                console.log('API Response:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    setStore(data);
                } else {
                    console.warn('Data is not an array:', data);
                    setStore([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching store data:', error);
                setStore([]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-5">
            <h1 className="text-4xl font-semibold text-center pt-24 pb-10">Our Items</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="flex flex-wrap gap-8 justify-center">
                    {store.length > 0 ? (
                        store.map((item) => (
                            <ItemCard
                                key={item.ItemNo}
                                ItemNo={item.ItemNo}
                                image={item.image}
                                ItemName={item.ItemName}
                                SPrice={item.SPrice}
                            />
                        ))
                    ) : (
                        <div>No items found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Main;
