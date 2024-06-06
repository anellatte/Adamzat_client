// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className='adamzat container'>
            <h1 className='title'>ADAMZAT</h1>
            <div className='adamzat__inner'>
                <div className='adamzat__desc'>
                    <h3 className='desc__title'>welcome to <br /> multiplayer game - “ADAMZAT”</h3>
                    <p className='desc__intro text'>The Adamzat game is a simple and enjoyable way to spend time with friends or family.  <br /> <br /> Before starting the game, familiarize yourself with the rules.</p>
                    <p className='desc__text text'>
                        Log into the game room using the code provided by the admin or create the room as an admin. <br /> <br />The admin selects the groups of categories from 1 to 5.<br /> <br /> You are randomly given one letter, on which you must write words by category.<br /> <br /> After the time is over, the admin checks your answers, you get points for each correct word.       
                    </p>
                    <p className='text span'>Time reminder: 20 seconds.</p>
                </div>
                <div className='adamzat__img'>
                    <img className='adamzat__cover' src="./cover.avif" alt="Adamzat" />
                    <div className='adamzat__buttons'>
                        <Link to="/create-room">
                            <button className='button'>Create Room</button>
                        </Link>

                        <Link to="/join-room">
                            <button className='button join_btn'>Join Room</button>
                        </Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default HomePage;
