import Table from 'react-bootstrap/Table';
import "../ComponentStyle/List.css"
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import rughalt from "../artifacts/contracts/RugHalt.sol/RugHalt.json"
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";


function List({ App }) {
    const [list, setList] = useState([])
    const navigate = useNavigate()
    const [add, setAdd] = useState('')
    const [voting, setVotings] = useState([])
    const [sort, setSort] = useState(false)



    useEffect(() => {
        const Address = "0x80fB4fC2A24b878e604C3eB55479109763Ca0D70"





        async function getList() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const signer = await provider.getSigner()
            const add = await signer.getAddress()
            setAdd(add)
            const tx = await contracts.filters.ProjectCreated()
            const txData = await contracts.queryFilter(tx);
            setList(txData)

        }



        getList()


        console.log('sort', voting)
    }, [])


    console.log('list', list)





    function sorting() {

        setVotings(list.sort((a, b) => {
            return b.args.timestamp - a.args.timestamp
        }))


    }
    console.log('sort', voting)


    return (

        <div className='list'>
            <h1>All Collections</h1>
            <div className='filters'>
                <Button className='button' variant="outline-info">All</Button>
                <Button className='button' variant="outline-info">ACTIVE</Button>
                <Button className='button' variant="outline-info">MODERATE</Button>
                <Button className='button' variant="outline-info">BAD</Button>
                <Button className='button' variant="outline-info">RUGGED</Button>
            </div>
            < HiOutlineArrowsUpDown style={{ marginTop: '4%', marginLeft: '2%' }} cursor='pointer' color='pink' size={46} onClick={sorting} />
           
            <Table className='top' responsive="lg">
                <thead>
                    <tr className='listHeader' >
                        <th>#NO</th>
                        <th>IMAGE</th>
                        <th>NAME</th>
                        <th>DATE</th>
                        <th>ORGANIZER</th>
                        <th>STAGE</th>
                        <th>UPDATE</th>


                    </tr>
                </thead>



                <tbody >

                    {!sort ?
                        list.map((e, id) => {
                            return (

                                <tr onClick={() => navigate(`/project/${e.args.ProjectId}`)} className='listColors'>
                                    <td>{id}</td>
                                    <td><img className='img' src={'https://gateway.pinata.cloud/ipfs/' + e.args.desc} alt='img' /></td>
                                    <td >{e.args.url.toString()}</td>
                                    <td>{new Date(e.args.timestamp * 1000).toLocaleTimeString()}</td>
                                    <td>{e.args.organizer.toString().slice(0, 9)}...</td>
                                    {e.args.status === 0 && <td style={{ color: 'greenyellow' }}>New</td>}
                                    <td>{e.args.organizer.toString() === add ? <Button variant="info">Update</Button> : <BsFillQuestionSquareFill size={25} color='pink' />}</td>



                                </tr>

                            )

                        })
                        :
                        voting.map((e, id) => {
                            return (

                                <tr onClick={() => navigate(`/project/${e.args.ProjectId}`)} className='listColors'>
                                    <td>{id}</td>
                                    <td><img className='img' src={'https://gateway.pinata.cloud/ipfs/' + e.args.desc} alt='img' /></td>
                                    <td >{e.args.url.toString()}</td>
                                    <td>{new Date(e.args.timestamp * 1000).toLocaleTimeString()}</td>
                                    <td>{e.args.organizer.toString().slice(0, 9)}...</td>
                                    {e.args.status === 0 && <td style={{ color: 'greenyellow' }}>New</td>}
                                    <td>{e.args.organizer.toString() === add ? <Button variant="info">Update</Button> : <BsFillQuestionSquareFill size={25} color='pink' />}</td>



                                </tr>

                            )

                        })}


                </tbody>








            </Table>
        </div>
    );
}

export default List;

