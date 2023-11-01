import React from 'react'
import Layout from '../Components/Layout/Layout'
import { AiTwotoneMail } from 'react-icons/ai';
import {BsFillTelephoneOutboundFill} from 'react-icons/bs'
import {AiOutlineMail} from 'react-icons/ai'
const Contact = () => {
  return (
    <Layout title="ContactUs-Swift Bazaar">
      <div className="container mt-5">
      <h1 className="mb-4">Contact Us</h1>
      <div className="row">
        <div className="col-md-6">
          <img src="/images/contactus.jpg" alt="Contact Us" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h4>Contact Information</h4>
          <p>
            <AiTwotoneMail/> Address: Heggala village and post,571218,Kodagu
            <br />
            <BsFillTelephoneOutboundFill/> Phone: 8971582431 
            <br />
            <AiOutlineMail/> Email: rojinid99@gmail.com
          </p>
          <h4>Office Hours</h4>
          <p>
            Monday - Friday: 9:00 AM - 5:00 PM
            <br />
            Saturday: 10:00 AM - 2:00 PM
            <br />
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Contact
