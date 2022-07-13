import AdminLayout from "../../components/AdminLayout";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faEdit} from "@fortawesome/free-solid-svg-icons";
import {FormEvent, Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import axios from "axios";
import LoaderContext from "../../context/LoaderContext";

type Subject = {
  id: number,
  name: string,
  teacherCount: number,
  questionCount: number
};

export default function SubjectsPage(): JSX.Element {
  let [isOpenModal, setIsOpenModal] = useState(false);
  let [editSubject, setEditSubject] = useState<Subject | undefined>(undefined);

  let [subjects, setSubjects] = useState<Subject[]>([]);
  const {setLoading} = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/subjects").then(res => {
      if (res.status === 200) {
        setSubjects(res.data);
        setLoading(false);
      }
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  function handleDelete(id: number) {
    setLoading(true);
    axios.delete(`/api/subjects/${id}`).then(res => {
      if (res.status === 200) {
        setSubjects(subjects.filter(s => s.id !== id));
        setLoading(false);
      }
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }

  return (
    <>
      <AdminLayout>
        <SubjectModal/>

        <div className='py-16 px-4 container max-w-4xl mx-auto'>
          <div className='flex justify-between'>
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-3xl font-bold'>Subjects</h2>
              <span className="indicator-item badge">{subjects.length}</span>
            </div>
            <div className='tooltip tooltip-left' data-tip="Add new subject">
              <button onClick={() => {
                setEditSubject(undefined);
                setIsOpenModal(true);
              }} className='btn gap-2'>
                <FontAwesomeIcon icon={faAdd}/>
                <span className='hidden sm:block'>Add Subject</span>
              </button>
            </div>
          </div>
          <div className='overflow-y-auto my-8 shadow-xl'>
            <SubjectsTable/>
          </div>
        </div>
      </AdminLayout>
    </>
  )

  function SubjectsTable() {
    return (
      <table className="table w-full">
        <thead>
        <tr className='text-center'>
          <th>Course id</th>
          <th>Subject Title</th>
          <th>Teachers</th>
          <th>Questions</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {subjects.map((subject, index) => (
          <tr key={index}>
            <th>{subject.id}</th>
            <td>{subject.name}</td>
            <td className='text-right'>
              <button className='btn gap-2 btn-outline flex flex-nowrap'>
                Teachers
                <span className='badge'>{subject.teacherCount}</span>
              </button>
            </td>
            <td className='text-right'>
              <button className='btn gap-2 btn-outline flex flex-nowrap'>
                Questions
                <span className='badge'>{subject.questionCount}</span>
              </button>
            </td>
            <td className='text-right space-x-2'>
              <div className="tooltip" data-tip="Edit">
                <button onClick={() => {
                  setEditSubject(subject);
                  setIsOpenModal(true);
                }} className='btn gap-2 btn-square'>
                  <FontAwesomeIcon icon={faEdit}/>
                </button>
              </div>
              <div className="tooltip" data-tip="Delete">
                <button onClick={() => handleDelete(subject.id)} className='btn btn-error btn-square'>
                  <FontAwesomeIcon icon={faTrash}/>
                </button>
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }

  function SubjectModal() {
    const [title, setTitle] = useState(editSubject ? editSubject.name : "");

    function handleSubmit(e: FormEvent) {
      setLoading(true);
      if (editSubject) {
        axios.put(`/api/subjects/${editSubject.id}`, {name: title})
          .then(res => {
            if (res.status === 200) {
              setSubjects(subjects.map(subject => subject.id === editSubject?.id ? {
                ...subject,
                name: title
              } : subject));
              setLoading(false);
            }
          })
          .catch(e => {
            console.error(e);
            setLoading(false);
          });
      } else {
        axios.post("/api/subjects", {name: title})
          .then(r => {
            if (r.status === 200) {
              setSubjects([...subjects, r.data]);
              setLoading(false);
            }
          })
          .catch(e => {
            console.error(e);
            setLoading(false);
          });
      }

      setIsOpenModal(false);
      e.preventDefault();
    }

    return (
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => setIsOpenModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black bg-opacity-25"/>
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel>
                  <div className="relative bg-base-100 card ">
                    <div className="card-body">
                      <h3 className="card-title">{editSubject ? "Edit Subject" : "Create New Subject"}</h3>
                      <form onSubmit={handleSubmit} className='py-4 space-y-8'>

                        <div className='input-group'>
                          <span className='w-full'>Subject Title</span>
                          <input onChange={(e) => setTitle(e.target.value)}
                                 value={title}
                                 type="text"
                                 placeholder="Maths"
                                 required={true}
                                 className="input input-bordered"/>
                        </div>

                        <div className='flex w-full space-x-4 items-end justify-end'>
                          <button onClick={() => setIsOpenModal(false)} type='reset'
                                  className='btn btn-outline justify-self-end'>Cancel
                          </button>
                          <button type='submit' className='btn justify-self-end'>
                            {editSubject ? 'Update' : 'Create'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }
}
