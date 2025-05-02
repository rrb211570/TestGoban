import './NavBar.css';
import { useEffect, useState } from 'react';

function NavBar() {
    useEffect(() => {

    },[]);

    return (
        <div id='navBar'>
            <div id='navBarMenu'>
                <div className='navBarEntry'><button className='navBarItem'>Home</button></div>
                <div className='navBarEntry'><button className='navBarItem'>Play</button></div>
                <div className='navBarEntry'><button className='navBarItem'>Learn</button></div>
                <div className='navBarEntry'><button className='navBarItem'>Watch</button></div>
                <div className='navBarEntry'><button className='navBarItem'>Tools</button></div>
                <p className='navBarFiller'>Filler</p>
                <div className='navBarEntry'><button className='navBarSignIn'>Sign In</button></div>
            </div>
        </div>
    );
}

export default NavBar;