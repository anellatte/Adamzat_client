import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getRoomDetails } from '../services/api';
import socket from '../services/socket';
import Confetti from 'react-confetti';
import useWindowSize from './useWindowSize'; // Adjust the path as needed

const Results = () => {
    const { roomPin } = useParams();
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const playerNickname = location.state?.playerNickname;
    const [showConfetti, setShowConfetti] = useState(true);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const details = await getRoomDetails(roomPin, playerNickname);
                // Sort players by overall points in descending order
                const sortedPlayers = details.players.sort((a, b) => b.overallPoints - a.overallPoints);
                setPlayers(sortedPlayers);
            } catch (error) {
                setError('Error fetching room details');
                console.error('Error fetching room details:', error);
            }
        };

        fetchRoomDetails();

        const handlePointsUpdate = ({ players }) => {
            // Sort updated players by overall points in descending order
            const sortedPlayers = players.sort((a, b) => b.overallPoints - a.overallPoints);
            setPlayers(sortedPlayers);
        };

        socket.on('pointsUpdated', handlePointsUpdate);

        return () => {
            socket.off('pointsUpdated', handlePointsUpdate);
        };
    }, [roomPin, playerNickname]);

    useEffect(() => {
        setTimeout(() => setShowConfetti(false), 20000); // Stop confetti after 20 seconds
    }, []);

    return (
        <div className='container results'>
            {showConfetti && <Confetti width={width} height={height} gravity={0.2} />} {/* Increase gravity to speed up confetti */}
            <h2 className='title'>RESULTS</h2>

            <div className='pedestal'>
                <div className='pedestal__inner'>
                    {players.length > 1 && (
                        <div className='place'>
                            <h3 className='place__title'>{players[1].nickname}</h3>
                            <div className='second place__box'>
                                <div className='place__point'>
                                    <span>{players[1].overallPoints}</span>
                                </div>
                                <p className='place__number'>2 out of {players.length}</p>
                            </div>
                        </div>
                    )}
                    {players.length > 0 && (
                        <div className='place'>
                            <h3 className='place__title'>{players[0].nickname}</h3>
                            <div className='first place__box'>
                                <div className='place__point'>
                                    <span>{players[0].overallPoints}</span>
                                </div>
                                <p className='place__number'>1 out of {players.length}</p>
                            </div>
                        </div>
                    )}
                    {players.length > 2 && (
                        <div className='place'>
                            <h3 className='place__title'>{players[2].nickname}</h3>
                            <div className='third place__box'>
                                <div className='place__point'>
                                    <span>{players[2].overallPoints}</span>
                                </div>
                                <p className='place__number'>3 out of {players.length}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error ? (
                <div>{error}</div>
            ) : (
                <table className='results__table'>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Overall Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.nickname}>
                                <td>{player.nickname}</td>
                                <td>{player.overallPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Results;
