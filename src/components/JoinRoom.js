import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../services/api';
import socket from '../services/socket';

const JoinRoom = () => {
    const [pin, setPin] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await joinRoom(pin, password, nickname);
            if (data && data.roomPin) {
                // Emit 'joinRoom' event to the server using the centralized socket instance
                socket.emit('joinRoom', { roomPin: data.roomPin, nickname });

                navigate(`/waiting-room/${data.roomPin}`, { state: { playerNickname: nickname } });
            }
        } catch (error) {
            setErrorMessage(error.message || 'Error joining room');
            console.error(error);
        }
    };

    return (
        <div className='container'>
            <h2 className='title'>Join Room</h2>

            <form className='room' onSubmit={handleSubmit}>
                <div className='form'>
                    <input type="text" placeholder="Room PIN" value={pin} onChange={(e) => setPin(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                    <button type="submit">Join</button>
                </div>

            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default JoinRoom;
