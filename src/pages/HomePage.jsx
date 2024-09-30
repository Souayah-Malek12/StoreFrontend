import Layout from "../components/Layouts/Layout"
import  {useAuth}  from "../context/auth";

 const HomePage = () => {

    const [auth ] = useAuth() 
  return (

    <Layout>
            <div>HomePage</div>
            <h1>{JSON.stringify(auth)}</h1>
    </Layout>
  )
}

export default HomePage