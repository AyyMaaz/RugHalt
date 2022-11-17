import React, { useEffect, useState } from 'react'
import NavMain from './NavMain'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import rughalt from "../artifacts/contracts/RugHalt.sol/RugHalt.json"
import "../ComponentStyle/Reveal.css"

const Reveal = () => {
    const { id } = useParams()
    const [owner, setOwner] = useState([])

    useEffect(() => {
        async function getOwner() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const tx = await contracts.filters.OwnerInfo(id)
            const txData = await contracts.queryFilter(tx);


            setOwner(txData)


        }
        getOwner()


    })


    return (
        <div >
            <NavMain />

            {owner.map((e) => {
                return (
                    <div className='reveal'>
                        <h1>Naughty List</h1>
                        <hr />
                        <div className='identity'>
                            <h3>ORGANIZER:</h3><p>{e.args.organizerName}</p>
                        </div>
                        <div className='identity'>
                            <h3>CONTACT:</h3><p>{e.args.contactNum}</p>
                        </div>
                        <div className='identity'>
                            <h3>INFO-NIC:</h3><p>{e.args.cnic}</p>
                        </div>
                        <div className='identity'>
                            <h3>DISCORD-URL:</h3><p>{e.args.discordUrl}</p>
                        </div>
                        <div className='identity'>
                            <h3>ADDRESS:</h3><p>{e.args.Address}</p>
                        </div>
                    </div >
                )
            })}


        </div >
    )
}

export default Reveal
const Address = '0x145D4C4Bc2c1E7bA30E161262313F8D41E1A968d'





