import DashboardLayout from "../../components/DashboardLayout";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {getPayload} from "../../lib/auth";
import LoaderContext from "../../context/LoaderContext";
import Link from "next/link";


export default function TeachersPanel(): JSX.Element {
  type TeacherSubjects = {
    Subject: {
      id: number,
      name: string,
      _count?: {
        Question: number
      }
    }
  };

  const [subjects, setSubjects] = useState<TeacherSubjects[]>([]);
  const {setLoading} = useContext(LoaderContext);

  function refreshSubjects() {
    setLoading(true);
    axios
      .get(`/api/teachers/${getPayload()?.cnic}/subjects`)
      .then(res => {
        if (res.status === 200) {
          setSubjects(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    refreshSubjects();
  }, []);

  return (
    <>
      <DashboardLayout>
        <div
          className='container mx-auto py-16 place-items-center gap-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {subjects.map((subject) => (
            <SubjectCard
              id={subject.Subject.id}
              name={subject.Subject.name}
              count={subject.Subject._count?.Question}
            />
          ))}
        </div>
      </DashboardLayout>
    </>
  )

  function SubjectCard({id, name, count}: { id: number, name: string, count?: number }) {
    return (
      <>
        <Link href={`/teacher/subject/${id}`}>
          <div className="cursor-pointer card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{name}</h2>
              <div className='badge'>{count || 0} Questions</div>
            </div>
          </div>
        </Link>
      </>
    );
  }
}
