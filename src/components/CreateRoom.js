import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../services/api';
import socket from '../services/socket'; // Import the socket instance

const allCategories = [
    'Адам есімі',
    'Қала',
    'Жануар',
    'Кино',
    'Танымал адамның есімі',
    'Актер',
    'Ән',
    'Кітап',
    'Іс-әрекет',
    'Сын есім',
    'Киім',
    'Тарихи тұлға',
    'Әдеби кітап',
    'Адам мүшесі',
    'Мамандық',
    'Көңіл-күй эмоциялары',
];

const CreateRoom = () => {
    const [pin, setPin] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Add any event listeners for socket here if needed

        return () => {
            // Clean up event listeners if added
        };
    }, []);

    const handleCheckboxChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pin || !nickname || !password || !confirmPassword || selectedCategories.length !== 5) {
            setErrorMessage('Please fill in all fields and choose exactly 5 categories');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const data = await createRoom(pin, nickname, password, confirmPassword, selectedCategories);
            setSuccessMessage('Room created successfully');

            socket.emit('createRoom', { roomPin: data.roomPin, nickname });

            navigate(`/waiting-room/${data.roomPin}`, { state: { playerNickname: nickname } });
        } catch (error) {
            setErrorMessage(error.message || 'Error creating room');
            console.error(error.message);
        }
    };

    return (
        <div className='container'>
            <h2 className='title'>Create Room</h2>
            <form className='room' onSubmit={handleSubmit}>
                <div className='form'>
                    <input type="number" placeholder="Room PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
                    <input type="text" placeholder="Your Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className='create__category'>
                    <h2 className='create__title'>Choose Categories</h2>
                    <div className='category__table'>
                        {allCategories.map((category) => (
                            <div
                                key={category}
                                className={`category__item ${selectedCategories.includes(category) ? 'selected' : ''}`}
                                onClick={() => handleCheckboxChange(category)}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit">Create</button>
            </form>
            {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
            {successMessage && <p className='successMessage'>{successMessage}</p>}
        </div>
    );
};

export default CreateRoom;
