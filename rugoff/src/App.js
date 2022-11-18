import Home from './demo/Home';
import './App.css'
import { Projects } from './Components/Projects';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './form/Main';
import { ProjectsDisplay } from './Components/ProjectsDisplay';
import { useEffect, useState, createContext } from 'react';
import { ethers } from 'ethers';
import rughalt from "./artifacts/contracts/RugHalt.sol/RugHalt.json"
import { ToastContainer, toast } from 'react-toastify';
import { PINATA_API_KEY } from './pinata';
import { PINATA_API_SECRET } from './pinata';
import axios from 'axios';
import Reveal from './Components/Reveal';



//https://gateway.pinata.cloud/ipfs/
export const myApp = createContext();
function App() {

  const { ethereum } = window;
  const [address, setAddress] = useState(localStorage.getItem("address"))
  const [account, setAccount] = useState(false)
  const [chain, setChain] = useState('')
  const [error, setError] = useState('')
  const [ischain, issetChain] = useState()
  const [data, setData] = useState([])
  const [imageurl, setimageurl] = useState('')
  const [profileurl, setProfileurl] = useState('')
  const [loading, setloading] = useState(false)
  const [id, setId] = useState('false')

  //main


  const [positive, setPositive] = useState({
    code: "",
    comment: ""

  });



  const [form, setForm] = useState({
    name: "",
    desc: "",
    url: ""

  });


  const [owner, setOwner] = useState({
    name: "",
    contact: "",
    nic: "",
    discord: "",
    home: ""

  });
  const [image, setImage] = useState('')
  const [profile, setProfile] = useState('')

  //
  useEffect(()=>{

    if(!ethereum){
      alert('plz install metamask')


    }
  },[])

  //pinata
  const sendFileToIPFS = async (e) => {

    const formData = new FormData();
    formData.append("file", image);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        'pinata_api_key': `${PINATA_API_KEY}`,
        'pinata_secret_api_key': `${PINATA_API_SECRET}`,
        "Content-Type": "multipart/form-data"
      },
    });

    const ImgHash = `${resFile.data.IpfsHash}`;
    setimageurl(ImgHash);
    console.log(imageurl)
    //Take a look at your Pinata Pinned section, you will see a new file added to you list.   

  }
  console.log(`https://gateway.pinata.cloud/ipfs/${imageurl}`)


  //send profile to ipfs
  const sendProfileToIPFS = async (e) => {

    const formData = new FormData();
    formData.append("file", profile);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        'pinata_api_key': `${PINATA_API_KEY}`,
        'pinata_secret_api_key': `${PINATA_API_SECRET}`,
        "Content-Type": "multipart/form-data"
      },
    });

    const ImgHash = `${resFile.data.IpfsHash}`;
    setProfileurl(ImgHash);
    toast.success('Uploaded to ipfs Successfully')


  }


  console.log(`https://gateway.pinata.cloud/ipfs/${profileurl}`)

  const Address = "0x80fB4fC2A24b878e604C3eB55479109763Ca0D70"


  async function connectWallet() {
    try {

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setAccount(true)
      const chainId = await ethereum.request({ method: "eth_chainId" })
      setAddress(accounts[0])
      localStorage.setItem("address", address);

      if (chainId === "0x5") {
        setChain("Goerli")
        issetChain(true)


      }


    }
    catch (error) {
      setError(error.message)
    }

  }

 

  //main 
  const FormHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const OwnerHandler = (e) => {
    setOwner({
      ...owner,
      [e.target.name]: e.target.value
    })
  }

  const PositiveCommentHandler = (e) => {
    setPositive({
      ...positive,
      [e.target.name]: e.target.value
    })
  }



  const imageHandler = (e) => {
    setImage(e.target.files[0]);


  }

  const profileHandler = (e) => {
    setProfile(e.target.files[0]);


  }

  async function getData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress()
    console.log(address)
    const contracts = new ethers.Contract(Address, rughalt.abi, provider);
    const tx = await contracts.filters.ProjectCreated(id)
    const txData = await contracts.queryFilter(tx);
    setData(txData)
  }




  const submitProject = async (e) => {

    e.preventDefault()
    console.log('done')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contracts = new ethers.Contract(Address, rughalt.abi, signer);
    const tx = await contracts.CreateProject(form.name, form.desc, profileurl);
    await tx.wait()
    toast.success('Submitted Successfully')
    getData();
    setloading(true)
    // setForm('')

  

  }
  console.log('data',data)


  const submitOwner = async (e) => {

    e.preventDefault()
    sendFileToIPFS()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contracts = new ethers.Contract(Address, rughalt.abi, signer);
    const address = await signer.getAddress()
    const tx = await contracts.AddownersInfo(address, owner.name, imageurl, owner.contact, owner.nic, owner.discord, owner.home);
    await tx.wait()
    getData();
    toast.success('Owner Submitted Successfully')
    setOwner('')


  }
  async function AddProjectPosComment(e) {
    e.preventDefault()

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contracts = new ethers.Contract(Address, rughalt.abi, signer);
    try {
      const tx = await contracts.AddProjectPosComment(positive.code, id, positive.comment)
      await tx.wait()

      toast.success('Comment Submitted Successfully')
    }
    catch (e) {
      setError(e)
    }
    setPositive('')
  }

  async function AddNegativePosComment(e) {
    e.preventDefault()

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contracts = new ethers.Contract(Address, rughalt.abi, signer);
    try {
      const tx = await contracts.AddProjectNegComment(positive.code, id, positive.comment)
      await tx.wait()
      toast.success('Comment Submitted Successfully')
    }
    catch (e) {
      setError(e)
    }
    setPositive('')
  }





  console.log(positive.code, id, positive.comment)
  console.log('sbid', id)

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <myApp.Provider value={{ AddNegativePosComment, id, setId, AddProjectPosComment, PositiveCommentHandler, positive, setPositive, loading, setloading, address, sendFileToIPFS, sendProfileToIPFS, profileHandler, profileurl, setProfileurl, imageHandler, Address, OwnerHandler, submitOwner, owner, setOwner, data, setData, form, setForm, FormHandler, submitProject, error, setError, ischain, issetChain, chain, setChain, address, setAddress, account, setAccount, connectWallet }}>
        <Router>

{
  ethereum?
  <Routes>
            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />
            <Route
              path="/main"
              element={<Main />}
            />
            <Route
              path="/project/:id"
              element={<ProjectsDisplay id={id} />}
            />
            <Route
              path="/reveal/:id"
              element={<Reveal />}
            />
          </Routes>
          :
          <h1>plz install metamsk</h1>


}

     

        </Router>
      </myApp.Provider>
    </div>
  );
}

export default App;
