import toast from "react-hot-toast";
import Layout from '../../components/Layouts/Layout';
import axios from "axios";
import { useEffect, useState } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";

export const CreateCategory = () => {

    const [name, setName] = useState("")

    const handleSubmit = async(e)=> {
      e.preventDefault()
      try{
        const {data} = await axios.post(`${import.meta.env.VITE_APP_API}/api/v1/category/create-category` , 
          {name}
        );
        if(data?.success){
          toast.success(`{data.name} is created`)
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

      if (data.success) {
        setCategories(data.category);
        
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
                        <button className="btn btn-primary">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;
