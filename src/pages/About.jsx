import React from 'react'
import '../styles/About.css'
import Cars from '../pages/Cars'
import Chat from '../pages/Chat'


export default function Home() {
    return (
       <div style={{backgroundColor:"black"}}>
        <div className="image">
                <div className="text-content">
                    <h1 className="text-white">Unlock your dreams!</h1>
                    <h4 className="text-white">Drive home your new car</h4>
                </div>
            </div>
            <Cars />
            <Chat/>
       </div>
    )
}
