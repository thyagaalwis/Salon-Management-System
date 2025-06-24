import React from 'react';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

export default function ItemCard({ ItemNo, image, ItemName, SPrice }) {
    return (
        <Link
            to={`/itemdis/${ItemNo}`}  // Correct navigation using ItemNo
            className="w-full lg:w-1/4 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg"
        >
            <img className="rounded-xl" src={image} alt={ItemName} />
            <div className="space-y-4">
                <h3 className="font-semibold text-center text-xl pt-6 truncate">
                    {ItemName}
                </h3>
                <div className="flex flex-row justify-center">
                    <BsStarFill className="text-orange-600" />
                    <BsStarFill className="text-orange-600" />
                    <BsStarFill className="text-orange-600" />
                    <BsStarFill className="text-orange-600" />
                    <BsStarHalf className="text-orange-600" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4">
                    <h3 className="font-semibold text-lg">${SPrice}</h3>
                    <Button title="Buy Now" />
                </div>
            </div>
        </Link>
    );
}
