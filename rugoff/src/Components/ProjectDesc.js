import React from 'react'
import "../ComponentStyle/ProjectDesc.css"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";
import Footer from '../demo/Footer';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import rughalt from "../artifacts/contracts/RugHalt.sol/RugHalt.json"
import { useContext } from 'react';
import { myApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { ImCross, ImConfused, ImArrowUp2, ImArrowDown2 } from "react-icons/im";



const ProjectDesc = () => {
    const App = useContext(myApp)
    const [projectlist, setProjectList] = useState([])
    const [negativelist, setNegativeList] = useState([])
    const [positivelist, setPositiveList] = useState([])
    const [voting, setVotings] = useState([])
    const [add, setAdd] = useState('')
    const navigate = useNavigate()


    const { id } = useParams();

    const Address = "0x80fB4fC2A24b878e604C3eB55479109763Ca0D70"


    console.log('my', App.address)

    useEffect(() => {
        async function getNegative() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const nx = await contracts.filters.NegativeComments(BigNumber.from(id))
            const nxData = await contracts.queryFilter(nx);
            setNegativeList(nxData)

        }

        async function getPositve() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const px = await contracts.filters.PositiveComments(BigNumber.from(id))
            const pxData = await contracts.queryFilter(px)
            setPositiveList(pxData)

        }
        getNegative()
        getPositve()

    }, [])

    useEffect(() => {
        async function getList() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const signer = await provider.getSigner()
            const add = await signer.getAddress()
            setAdd(add)
            const tx = await contracts.filters.ProjectCreated(BigNumber.from(id))


            App.setId(BigNumber.from(id))
            const txData = await contracts.queryFilter(tx);


            setProjectList(txData)





        }
        async function getVoting() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contracts = new ethers.Contract(Address, rughalt.abi, provider);
            const vx = await contracts.filters.ProjectVoting(BigNumber.from(id))
            const vxData = await contracts.queryFilter(vx);
            setVotings(vxData.splice(-1))


        }


        getList()
        getVoting()


    }, [])



    console.log('pro', projectlist)
    console.log('id', id)
    console.log('voting', voting)
    console.log('neg', negativelist)

    async function PositiveVote(idx) {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(Address, rughalt.abi, signer);
        const tx = await contracts.PositiveVoteOnProjects(BigNumber.from(id), idx);
        await tx.wait()
        alert('voted')


    }

    async function NegativeVote(idx) {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(Address, rughalt.abi, signer);
        const txn = await contracts.NegativeVoteOnProjects(BigNumber.from(id), idx);
        await txn.wait()
        alert('voted')


    }
    return (

        <div className='desc'>
            {projectlist.map((e) => {

                return (
                    <div>
                        <img className='profileImage' src={'https://gateway.pinata.cloud/ipfs/' + e.args.desc} alt='Fuck you' />
                        <h1>{e.args.url}</h1>
                        <p>‶{e.args.name}‶</p>


                        {voting.length < 1 ?
                            <div className='voting'>
                                <div>
                                    <p className='place'>Total</p>
                                    <p>0</p>
                                </div>
                                <div>
                                    <p className='place'>Positive</p>
                                    <p>0</p>
                                </div>
                                <div>
                                    <p className='place'>Negative</p>
                                    <p>0</p>
                                </div>
                                <div>
                                    <p className='place'>Rug Percent</p>
                                    <p>0%</p>
                                </div>
                                <div><p className='place'>Status</p>
                                    <p>NOT STARTED</p>
                                </div>
                                <div><p className='place'>View Identity</p>
                                    <p>Oops <ImConfused color='pink' size={25} /></p>
                                </div>

                            </div>

                            : voting.map((element) => {


                                return (

                                    <div className='voting'>
                                        <div>
                                            <p className='place'>Total</p>
                                            <p>{element.args.NumberOfVotes.toString()}</p>
                                        </div>
                                        <div>
                                            <p className='place'>Positive </p>
                                            <p>{element.args.PositiveVotes.toString()} {element.args.PositiveVotes.toString() > element.args.NegativeVotes.toString() ? <ImArrowUp2 size={17} color='green' /> : ''}</p>
                                        </div>
                                        <div>
                                            <p className='place'>Negative</p>
                                            <p>{element.args.NegativeVotes.toString()} {element.args.NegativeVotes.toString() > element.args.PositiveVotes.toString() ? <ImArrowDown2 size={17} color='red' /> : ''}</p>

                                        </div>
                                        <div>
                                            <p className='place'>Rug Percent</p>
                                            <p>{element.args.NegativeVotes / element.args.NumberOfVotes * 100}%</p>
                                        </div>
                                        <div><p className='place'>Status</p>
                                            <p>{element.args.NegativeVotes / element.args.NumberOfVotes * 100 === 0 ? <p style={{ color: 'greenyellow' }}>ACTIVE</p> : element.args.NegativeVotes / element.args.NumberOfVotes * 100 <= 50 ? <p style={{ color: 'olive' }}>MODERATE</p> : element.args.NegativeVotes / element.args.NumberOfVotes * 100 >= 50 && element.args.NegativeVotes / element.args.NumberOfVotes * 100 <= 80 ? <p style={{ color: 'brown' }}>BAD</p> : <p style={{ color: 'red' }}>RUGGED</p>}</p>
                                        </div>
                                        <div><p className='place'>View Identity</p>
                                            {element.args.NegativeVotes / element.args.NumberOfVotes * 100 >= 80 ? <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/reveal/${e.args.organizer}`)} variant='info'>View</p> : <p> <ImCross color='red' size={16} /></p>}
                                        </div>

                                    </div>
                                )

                            })}










                    </div>
                )
            })}



            <>
                {positivelist.length && negativelist.length >= 2
                    ?
                    <p>Limits Crossed</p>
                    :
                    <Container>

                        <h6>Paste the code and Make A comment</h6>
                        <hr style={{ color: ' rgb(32, 53, 77' }} />

                        <Form className='descScenarios'>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label style={{ color: 'rgb(161, 161, 161)' }}>You Must Need a code from the project Owner to comment on this..</Form.Label>
                                <Form.Control name='code' value={App.positive.code} onChange={App.PositiveCommentHandler} style={{ background: '#0a0e1a' }} as="textarea" rows={2} placeholder='01201182..' />
                            </Form.Group>
                            {App.error}

                        </Form>



                        <Form className='descScenarios'>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label style={{ color: 'rgb(161, 161, 161)' }}>There are no Queries .Now you can create your own queries in favour or against the project<br />Max Limit is 2</Form.Label>
                                <Form.Control name='comment' value={App.positive.comment} onChange={App.PositiveCommentHandler} style={{ background: '#0a0e1a' }} as="textarea" rows={3} />
                            </Form.Group>
                            {App.error}

                            <Button onClick={App.AddProjectPosComment} variant="outline-success" >
                                Add Positive Comment
                            </Button>.
                            <Button onClick={App.AddNegativePosComment} variant="outline-danger">
                                Add Negative Comment
                            </Button>
                        </Form>
                        <p>{App.error}</p>
                    </Container>
                }

                <h1 className='heading'>Vote On Comments</h1>
                <hr style={{ color: ' rgb(32, 53, 77' }} />

                <div className='head'>
                    <h2 className='headings'>Positve Comments</h2>
                    <h2 className='headings'>Negative Comments</h2>
                </div>

                <div className='all'>

                    <div className='pscenarios'>


                        {positivelist.map((e, index) => {
                            return <>

                                <div className='divScenarios'>
                                    <h5>{index + 1}-</h5>
                                    <h5>{e.args.description}</h5>

                                    <div className='votes'>
                                        <BsHandThumbsUp onClick={() => PositiveVote(index)} size={40} color='green' cursor='pointer' />


                                    </div>

                                </div>
                                <hr />

                            </>
                        })}





                    </div>


                    <div className='nscenarios'>
                        {negativelist.map((e, index) => {
                            return <>

                                <div className='divScenarios'>
                                    <h5>{index + 1}-</h5>
                                    <h5>{e.args.description}</h5>
                                    <div className='votes'>
                                        <BsHandThumbsDown onClick={() => NegativeVote(index)} size={40} color='red' cursor='pointer' />

                                    </div>
                                </div>

                                <hr />
                            </>
                        })}


                    </div>
                </div>

            </>


            <Footer />





        </div >

    )
}

export default ProjectDesc


