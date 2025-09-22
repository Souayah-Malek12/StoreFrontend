import {BiSupport, BiPhoneCall, BiMailSend} from "react-icons/bi"
import Layout from "../components/Layouts/Layout"
 const Contact = () => {
  return (
    <Layout title={"Contact"}>
           <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="../../public/images/contactus (2).jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : swayahmalek6@gmail.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : +21654023965 (free call)
          </p>
        </div>
      </div> 

    </Layout>
  )
}

export default Contact