import { useEffect, useState } from "react";
import api from "../../api/Axios";

const usePagination = (url, initialParams = {}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10);

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10
    });

    const [params, setParams] = useState(initialParams)

    const fetchData = async () => {
        try {
            setLoading(true)

            const res = await api.get(url, {
                params: {
                    ...params,
                    page,
                    limit
                }
            });

            const responseData = res.data

            setData(
                responseData.data || 
                responseData.Product || 
                responseData.users || 
                []
            );

            setPagination({
                total:
                    responseData.pagination?.total ||
                    responseData.pagination?.totalUsers ||
                    responseData.pagination?.totalProducts ||
                    responseData.pagination?.totalOrders ||
                    0,
                totalPages: responseData.pagination?.totalPages || 1,
                currentPage: responseData.pagination?.currentPage || page,
                limit: responseData.pagination?.limit || limit
            });

        } catch (err) {
            console.error("Pagination fetch error: ", err)
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchData();
    }, [page, params])

    return {
        data,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        pagination,
        setParams,
        refetch: fetchData
    }
}

export default usePagination;