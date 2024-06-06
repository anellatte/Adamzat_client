import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import socket from '../services/socket';

const WaitingRoom = () => {
    const [players, setPlayers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomPin } = useParams();
    const { playerNickname } = location.state;
    const isListenerAdded = useRef(false); // Track if listener is added

    useEffect(() => {
        // Emit joinRoom only once
        socket.emit('joinRoom', { roomPin, nickname: playerNickname });

        if (!isListenerAdded.current) {
            // Listen for player updates
            const handlePlayerJoined = (data) => {
                console.log("Player joined data:", data); // Debugging: log the received data
                setPlayers(data.players || []);
            };
            socket.on('playerJoined', handlePlayerJoined);

            // Listen for game start
            const handleGameStarted = () => {
                navigate(`/gameplay/${roomPin}/1`, { state: { playerNickname } }); // Redirect to the first round
            };
            socket.on('gameStarted', handleGameStarted);

            isListenerAdded.current = true; // Mark listeners as added

            // Cleanup on component unmount
            return () => {
                socket.off('playerJoined', handlePlayerJoined);
                socket.off('gameStarted', handleGameStarted);
                isListenerAdded.current = false; // Mark listeners as removed
            };
        }
    }, [roomPin, playerNickname, navigate]);

    const handleStartGame = () => {
        socket.emit('startGame', { roomPin });
    };

    useEffect(() => {
        // Check if the player is the owner
        if (players.length > 0) {
            setIsOwner(players[0].nickname === playerNickname);
        }
    }, [players, playerNickname]);

    return (
        <div className='container'>
            <h2 className='title'>Waiting Room</h2>
                <div className='waiting'>
                    <div className='wait__left'>
                        <h3 className='wait__pin'>Room PIN: {roomPin}</h3>
                        {isOwner && <button className='button wait__btn' onClick={handleStartGame}>Start Game</button>}
                    </div>
                    <div className='wait__right'>
                        <h3 className='wait__title'>Players:</h3>
                        <ul className='wait__players'>
                            {players.map((player) => (
                                <li
                                    key={player.nickname}
                                    style={{ color: player.nickname === playerNickname ? 'black' : 'white' }}
                                >
                                    {player.nickname}
                                </li>
                            ))}
                        </ul>
                    </div>
            </div>
            
        </div>
    );
};

export default WaitingRoom;
