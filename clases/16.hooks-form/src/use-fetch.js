import {useState, useEffect} from 'react'; 

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let cancelar = new AbortController();
        
        async function fetchData() {
            try {
                const response = await fetch(url, { signal: cancelar.signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }   
                const result = await response.json();
                if (isMounted) setData(result);
            } catch (error) {
                if (isMounted) setError(error);
                setData(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        }               
        fetchData();
        return () => {
            cancelar.abort();
            isMounted = false;
        };
    }, [url]);

    return { data, loading, error };
}

export default useFetch;