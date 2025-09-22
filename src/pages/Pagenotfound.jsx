import {Link} from "react-router-dom"
import Layout from "../components/Layouts/Layout"
 const Pagenotfound = () => {
  return (

    <Layout title={"Page not found"}>
        <div className='pnf'>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <Link   to='/'>Go Back</Link>
        </div>
    </Layout>
  )
}


export default Pagenotfound