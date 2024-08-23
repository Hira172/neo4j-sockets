import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const CounterButton = () => {
    const [value, setValue] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {

        socket.emit('initialize');

        socket.on('counterUpdate', (newValue) => {
            setValue(newValue);
            setError(null);
        });


        socket.on('connect_error', (error) => {
            console.error('Socket.io connection error:', error);
            setError('Socket.io connection error. Please try again later.');
        });

        socket.on('disconnect', () => {
            console.log('Socket.io disconnected');
            setError('Socket.io connection closed unexpectedly. Reconnecting...');
        });





        return () => {
            socket.off('counterUpdate');
            socket.off('connect_error');
            socket.off('disconnect');
        };
    }, []);

    const handleClick = () => {
        socket.emit('increment');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}
                <p className="text-2xl font-semibold text-gray-700 mb-4">Counter: {value}</p>
                <button
                    onClick={handleClick}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                    Increment
                </button>
            </div>
        </div>
    );
};

export default CounterButton;
