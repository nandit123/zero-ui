import React, { useState, useEffect } from 'react'
import Blockies from 'react-blockies';
import { Address, Balance, AddressInput, EtherInput } from "."
import { Transactor } from "../helpers"
import { BarcodeOutlined, WalletOutlined, QrcodeOutlined, SendOutlined } from '@ant-design/icons';
import { Typography, Skeleton, Tooltip, Spin, Modal, Button } from 'antd';
import QR from 'qrcode.react';
import { ethers } from "ethers";
const { Text } = Typography;


export default function Wallet(props) {

  const [open, setOpen] = useState()
  const [selectedAddress, setSelectedAddress] = useState()
  const [signer, setSigner] = useState()
  const [qr, setQr] = useState()

  let providerSend = ""
  if(props.provider){

    providerSend = (
      <Tooltip title={"Wallet"}>
        <BarcodeOutlined onClick={()=>{
          setOpen(!open)
        }} rotate={0} style={{padding:7,color:props.color?props.color:"black",cursor:"pointer",fontSize:28,verticalAlign:"middle"}}/>
      </Tooltip>
    )
  }


  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState()


  useEffect(()=>{
    const getAddress = async ()=>{
      if(props.provider){
        let loadedSigner
        try{
          //console.log("SETTING SIGNER")
          loadedSigner = props.provider.getSigner()
          setSigner(loadedSigner)
        }catch(e){
          //console.log(e)
        }
        if(props.address){
          setSelectedAddress(props.address)
        }else{
          if(!selectedAddress && loadedSigner){
            //console.log("GETTING ADDRESS FOR WALLET PROVIDER",loadedSigner)
            let result = await loadedSigner.getAddress()
            if(result) {
              setSelectedAddress(result)
            }
          }
        }
      }
      //setQr("")
    }
    getAddress()
  },[props])

  let display
  let receiveButton
  if(qr){
    display = (
      <QR value={selectedAddress} size={"450"} level={"H"} includeMargin={true} renderAs={"svg"} imageSettings={{excavate:false}}/>
    )
    receiveButton = (
      <Button key="hide" onClick={()=>{setQr("")}}>
        <QrcodeOutlined /> Hide
      </Button>
    )
  }else{

    const inputStyle = {
      padding:10
    }

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
             autoFocus={true}
            ensProvider={props.ensProvider}
            placeholder="to address"
            value={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput

            price={props.price}
            value={amount}
            onChange={(value)=>{
              setAmount(value)
            }}
          />
        </div>

      </div>
    )
    receiveButton = (
      <Button className="primary bl-border" key="receive" onClick={()=>{setQr(selectedAddress)}}>
        <QrcodeOutlined /> Receive
      </Button>
    )
  }

  return (
    <span>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div className="br-round">
            {selectedAddress?(
              <Address value={selectedAddress} ensProvider={props.ensProvider}/>
            ):<Spin />}
            <div style={{float:"right",paddingRight:25}}>
              <Balance address={selectedAddress} provider={props.provider} dollarMultiplier={props.price}/>
            </div>
          </div>
        }
        onOk={()=>{setOpen(!open)}}
        onCancel={()=>{
          setOpen(!open)

        }}
        footer={[
          receiveButton,
          <Button className="btn success fl-left gr-border" key="submit" type="success" disabled={!amount || !toAddress || qr} loading={false} onClick={()=>{
            const tx = Transactor(props.provider)
            tx({
              to: toAddress,
              value: ethers.utils.parseEther(""+amount),
            })
            setOpen(!open)
          }}>
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
