import react, {useEffect, useState} from 'react';
import api from '../components/api/axiosConfig'

const DashboardPage= ()=> {
    const[folders,setFolders]= useState([]);
    const[loading,setLoading]= useState(true);
    const[error,setError]= useState('');

    useEffect(() => {
        const fetchFolders = async () => {
            try{
                const response = await api.get("/folders/");
                setFolders(response.data)
            }
            catch (err){
                setError('Failed to fetch folders. Please try again later');
            }
            finally{
                setLoading(false);

            }
            };
        fetchFolders();
        }, []) 
        if (loading) return <p>Loading Folder...</p>;
        if (error) return <p style={{color:red}}>{error}</p>;
        return (
    <div>
      <h1>Your Document Vault</h1>
      <div className="folder-grid">
        {folders.length > 0 ? (
          folders.map((folder) => (
            <div key={folder.id} className="folder-card">
              <h3>{folder.name}</h3>
              <p>{folder.documents.length} documents</p>
            </div>
          ))
        ) : (
          <p>You don't have any folders yet. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;