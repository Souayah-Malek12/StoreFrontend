import { useEffect, useState } from "react";
import api from "../config/axios";

export const useCategory = () => {
    const [result, setResult] = useState([]);

    const getCategories = async () => {
        try {
            const { data } = await api.get('/category/findAll');
            setResult(data?.category || []);
        } catch (error) {
            console.error("Error in useCategory hook:", error);
            setResult([]);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return result;
};
