import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination }) => {
    return (
        <div className='flex'>
            <Link to={destination}
                className='relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-100 rounded-lg group bg-gradient-to-br from-pink-800 to-pink-600 group-hover:to-pink-500 hover:text-black dark:text-black focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-black-800'>
                <span className='relative px-4 py-1.5 transition-all ease-in duration-75 bg-black dark:bg-gray-100 rounded-md group-hover:bg-opacity-0'>
                    <BsArrowLeft className='text-lg' />
                </span>
            </Link>
        </div>
    );
};

export default BackButton;
