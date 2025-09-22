import { Link } from "react-router-dom";
import Layout from "../components/Layouts/Layout";
import { useCategory } from "../hooks/useCategory";

export const AllCategories = () => {
  const Result = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">All Categories</h1>
        <ul className="list-group" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {Result?.map((c) => (
            <li
              key={c._id}
              className="list-group-item"
              style={{ 
                textAlign: "center", 
                marginBottom: "10px", 
                transition: "background-color 0.3s ease" 
              }}
            >
              <Link
                to={`/category/${c.slug}`}
                className="text-decoration-none"
                style={{ color: "#007bff", fontSize: "18px", fontWeight: "500" }}
                onMouseOver={(e) => (e.target.style.color = "#0056b3")}
                onMouseOut={(e) => (e.target.style.color = "#007bff")}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AllCategories;
