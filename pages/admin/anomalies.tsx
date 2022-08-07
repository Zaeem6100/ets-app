import AdminLayout from "../../components/AdminLayout";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import loaderContext from "../../context/LoaderContext";
import format from "date-fns/format";

interface User {
  name: string
}

interface Student {
  User: User
}

interface Anomaly {
  id: number,
  cnic: string,
  Student: Student,
  imagePath: string,
  createdAt: string,
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const {setLoading} = useContext(loaderContext);

  function loadData() {
    setLoading(true);
    axios
      .get('/api/anomaly')
      .then(r => {
        if (r.status === 200)
          setAnomalies(r.data);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleUpdate(id: number, fail: boolean = false) {
    setLoading(true);
    axios
      .get(`/api/anomaly/${id}/${fail ? 'fail' : 'resolve'}`)
      .then(r => {
        if (r.status === 200) loadData();
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }

  return (
    <>
      <AdminLayout>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-4 px-8'>
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className='card bg-base-200 shadow-md'>
              <img src={anomaly.imagePath} alt={'anomaly'}/>
              <div className='card-title py-2 px-4 flex flex-col items-start'>
                <p>{anomaly.Student.User.name}</p>
                <p>{format(new Date(anomaly.createdAt), 'dd/MM/yyyy hh:mm:ss a')}</p>
              </div>
              <div className='card-actions px-4 py-4 flex justify-end'>
                <button onClick={() => handleUpdate(anomaly.id, true)} className='btn btn-error'>Fail</button>
                <button onClick={() => handleUpdate(anomaly.id, false)} className='btn btn-success'>Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </>
  )
}
