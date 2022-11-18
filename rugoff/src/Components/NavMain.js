import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import "../ComponentStyle/NavMain.css"
import { useContext } from 'react';
import { myApp } from '../App';
import { Link } from 'react-router-dom';
import { FaEthereum } from "react-icons/fa";
import {useEffect} from 'react'

function NavMain() {
  const { ethereum } = window;
  const App = useContext(myApp)
   useEffect(() => {


    ethereum.on("chainChanged", async (chainId) => {
      App.issetChain(true)
      if (chainId === "0x5") {
        App.setChain("Goerli")


      }
      if (chainId === "0x13881") {
        App.setChain("Polygon")


      }
      else {
        App.setChain('')
      }


    })

    ethereum.on("accountsChanged", async (accounts) => {
      App.setAddress(accounts[0])

    })


  }, [App.connectWallet])

  return (
    <Container>
      <div className='navMain'>

        <div className='start'>
          <Link className='logo' to="/projects">RugHalt</Link>
        </div>

        <div className='center'>

          <Link className='link' to="/main">Organize</Link>

        </div>

        <div className='end'>
          {
            App.ischain &&
            <div className='chain'><Nav.Link className='link' >{App.chain}</Nav.Link>

            </div>
          }

          <Nav.Link className={App.account ? 'link1' : 'blank'} > {App.ischain && <FaEthereum style={{ color: 'pink', background: 'none' }} size={14} />}{App.account && App.address.toString().slice(0, 9)}....</Nav.Link>
          {App.account ? <button className='button' variant="info">Connected</button>
            :
            <button className='button' onClick={App.connectWallet} variant="outline-info">Connect</button>}

        </div>

      </div>
    </Container>

  );
}

export default NavMain;