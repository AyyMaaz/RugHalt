import React from 'react'
import Button from 'react-bootstrap/Button';
import "../demoStyles/Heading.css"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { myApp } from '../App';


const Heading = () => {
    const App = useContext(myApp)

    const navigate = useNavigate()
    return (
        <div className='heading'>
            <h1>Say No To Nft Scams</h1>
            <p style={{marginTop:'1%'}}>``A DAO that minimizes the amount of rugs in the NFT space<br />
                We will be doxxing the founders and taking peoples votes from the community as to whether <br/> a project is a slow rug or a straight up rug
                in case they rug you chainlink automation would reveal their personal information
                <br />
                If everything is fine we just store it.We would like to increase the security of the space, 
                because right now everyone sees it as a scam``</p>
            <Button style={{marginTop:'1%'}} className='button' onClick={() => navigate('/projects')} variant="outline-info">GEt STARTED</Button>{' '}
           {App.account===false?<Button style={{marginTop:'1%'}}  className='button' onClick={App.connectWallet} variant="outline-info">CONNECT WALLET</Button>
           :
           <Button style={{marginTop:'1%'}}  className='button' onClick={App.connectWallet} variant="info">CONNECTED</Button>} 
        
        </div>
        
    )
}

export default Heading