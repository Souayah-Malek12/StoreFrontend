import axios from 'axios';
import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';


export const Products = () => {
    
    const [prods, setProds] = useState([])

    const getAllProducts = async()=> {
      try{
        const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/product/getProducts`)
        const data = response.data;
        if(data?.success){
          toast.success(`data fetched Successfully `)
          console.log(data)
          setProds(data.products)
        }else{
          toast.error(data.message)
        }
      }catch(error){
        console.log(error)
        toast.error('something in fetching products  ')
      }
    }

    useEffect(()=> {
      getAllProducts();
    }, [])
  return (
    <Layout title={"Dashboard Update Product"}>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All products list</h1>
                    <div className='d-flex'>
                    <div className="container">
                    <div className="row">
  {prods.map(p => (
    <div className="col-md-4 mb-4" key={p._id}>
      <div className="card" style={{ width: '100%' }}>
        <NavLink to={`/dashboard/admin/Products/${p.slug}`} className='product-link'>
        <img 
  src={`${p.photo.replace('/upload/', '/upload/w_300,h_300,c_scale,q_auto,f_auto/')}`} 
  className="card-img-top" 
  alt={`${p.name} picture`} 
/>



        </NavLink>
        <div className="card-body">
          <h5 className="card-title">{p.name}</h5>
          <p className="card-text">{p.description}</p>
          <p className="card-text">${p.price.toFixed(2)}</p>
          <NavLink to={`/products/${p._id}`} className="btn btn-primary">View Details</NavLink>
        </div>
      </div>
    </div>
  ))}
</div>

</div>
</div>
                </div>
            </div>
    </Layout>
  )
}

export default Products;