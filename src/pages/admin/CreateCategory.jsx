import toast from "react-hot-toast";
import Layout from '../../components/Layouts/Layout';
import axios from "axios";
import { useEffect, useState } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from 'antd';
import { useAuth } from "../../context/auth";

export const CreateCategory = () => {

    const [auth] = useAuth()
    const [name, setName] = useState("")
    const [updatedNameCat, setUpdatedNameCat] = useState(" ")
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(" ")

    const handleDelete = async(dId)=> {
      try{
          const {data} = await axios.delete(`${import.meta.env.VITE_APP_API}/api/v1/category/delete/${dId}`,{
            headers: {
            Authorization: auth?.token // Ensure token is passed here
            }
          })
          if(data.success){
            toast.success(`${data.message} is updated Successfully `)
            setVisible(false);
            setUpdatedNameCat(" ")
            getAllCategories();
          }else{
            toast.error(data.message)
          }
      }catch(error){
        console.log(error)
        toast.error('something in with delete operation ')
      }
    }

    const handleUpdate = async(e) => {
      e.preventDefault()
      
      try{
        const {data} = await axios.put(`${import.meta.env.VITE_APP_API}/api/v1/category/update-category/${selected._id}`,
          {name: updatedNameCat}, {
            headers: {
            Authorization: auth?.token // Ensure token is passed here
            }
          }
        )   
        if(data.success){
          toast.success(`${updatedNameCat} is updated Successfully `)
          setVisible(false);
          setUpdatedNameCat(" ")
          getAllCategories();
        }else{
          toast.error(data.message)
        }
       console.log(e)
      }catch(error){
        toast.error('something went wrong '),
        console.log(error)
      }
    }

    const handleSubmit = async(e)=> {
      e.preventDefault()
      try{
        const {data} = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/category/create-category` , 
          {name}, {
            headers: {
            Authorization: auth?.token // Ensure token is passed here
            }
          }
        );
        if(data?.success){
          toast.success(`${data.name} is created`)
          getAllCategories()
        }else{
          toast.error(data.message)
        }
      }catch(error){
        console.log(error)
        toast.error('something in with input form')
      }
    }
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/category/findAll`);
      const data = response.data;

      if (data?.success) {
        setCategories(data?.category);
        
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error('Something went wrong when getting categories');
      console.log(error); // Proper logging of the error
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);


  return (
    <Layout title={"Dashboard create-category"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm    handleSubmit={handleSubmit} value={name} setValue={setName}/>
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}> {/* Correct placement of key prop */}
                      <td>{c.name}</td> {/* Move category name into a td */}
                      <td>
                        <button className="btn btn-primary ms-2" onClick={() =>{ 
                                  setVisible(true); 
                                  setUpdatedNameCat(c.name)
                                  setSelected(c)  }
                                  }>
                          Edit
                          </button>
                        <button className="btn btn-danger ms-2" 
                          onClick ={ ()=> { handleDelete(c._id)}}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                  <Modal 
                    onCancel={()=> setVisible(false)}
                    footer = {null}
                    visible={visible}
                  >
                        <CategoryForm  handleSubmit={handleUpdate} value={updatedNameCat} setValue={setUpdatedNameCat}/>
                  </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;
