import AdminLayout from "../../components/AdminLayout";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faEdit} from "@fortawesome/free-solid-svg-icons";
import {FormEvent, Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import axios from "axios";
import LoaderContext from "../../context/LoaderContext";

type Teacher = {
  id: string,
  User: {
    cnic: string,
    name: string,
    role: string,
  },
  institute: string,
  gender: string,
  _count?: {
    Question: number,
    TeacherSubject: number,
  }
};

export default function TeachersPage(): JSX.Element {
  let [isOpenModal, setIsOpenModal] = useState(false);
  let [editTeacher, setEditTeacher] = useState<Teacher | undefined>(undefined);

  let [teachers, setTeachers] = useState<Teacher[]>([]);
  const {setLoading} = useContext(LoaderContext);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/teachers").then(res => {
      if (res.status === 200) {
        setTeachers(res.data);
        setLoading(false);
      }
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  function handleDelete(id: string) {
    setLoading(true);
    axios.delete(`/api/teachers/${id}`).then(res => {
      if (res.status === 200) {
        setTeachers(teachers.filter(s => s.id !== id));
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
        <TeacherModal/>

        <div className='py-16 px-4 container max-w-4xl mx-auto'>
          <div className='flex justify-between'>
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-3xl font-bold'>Teachers</h2>
              <span className="indicator-item badge">{teachers.length}</span>
            </div>
            <div className='tooltip tooltip-left' data-tip="Add new subject">
              <button onClick={() => {
                setEditTeacher(undefined);
                setIsOpenModal(true);
              }} className='btn gap-2'>
                <FontAwesomeIcon icon={faAdd}/>
                <span className='hidden sm:block'>Add Teacher</span>
              </button>
            </div>
          </div>
          <div className='overflow-y-auto my-8 shadow-xl'>
            <TeachersTable/>
          </div>
        </div>
      </AdminLayout>
    </>
  )

  function TeachersTable() {
    return (
      <table className="table w-full">
        <thead>
        <tr className='text-center'>
          <th>Name</th>
          <th>Institute</th>
          <th>Gender</th>
          <th>Subjects</th>
          <th>Questions</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {teachers.map((teacher, index) => (
          <tr key={index}>
            <td>{teacher.User.name}</td>
            <td>{teacher.institute}</td>
            <td className='capitalize'>{teacher.gender}</td>
            <td className='text-right'>
              <button className='btn gap-2 btn-outline flex flex-nowrap'>
                Subjects
                <span className='badge'>{teacher._count?.TeacherSubject || 0}</span>
              </button>
            </td>
            <td className='text-right'>
              <button className='btn gap-2 btn-outline flex flex-nowrap'>
                Questions
                <span className='badge'>{teacher._count?.Question || 0}</span>
              </button>
            </td>
            <td className='text-right space-x-2'>
              <div className="tooltip" data-tip="Edit">
                <button onClick={() => {
                  setEditTeacher(teacher);
                  setIsOpenModal(true);
                }} className='btn gap-2 btn-square'>
                  <FontAwesomeIcon icon={faEdit}/>
                </button>
              </div>
              <div className="tooltip" data-tip="Delete">
                <button onClick={() => handleDelete(teacher.id)} className='btn btn-error btn-square'>
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

  function TeacherModal() {
    const [name, setName] = useState(editTeacher ? editTeacher.User.name : "");
    const [cnic, setCnic] = useState(editTeacher ? editTeacher.id : "");
    const [password, setPassword] = useState("");
    const [institute, setInstitute] = useState(editTeacher ? editTeacher.institute : "");
    const [gender, setGender] = useState(editTeacher ? editTeacher.gender : "male");

    function handleSubmit(e: FormEvent) {
      setLoading(true);
      if (editTeacher) {
        axios.put(
          `/api/teachers/${editTeacher.id}`,
          {name, password, institute, gender}
        )
          .then(res => {
            if (res.status === 200) {
              setTeachers(teachers.map(teacher => teacher.id === editTeacher?.id ? {
                ...teacher,
                User: {
                  ...teacher.User,
                  name: name,
                },
                institute: institute,
                gender: gender
              } : teacher));
              setLoading(false);
            }
          })
          .catch(e => {
            console.error(e);
            setLoading(false);
          });
      } else {
        axios.post(
          "/api/teachers",
          {name, cnic: cnic.replace(/\D/g, ''), password, institute, gender}
        )
          .then(r => {
            if (r.status === 200) {
              setTeachers([...teachers, r.data]);
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

    function formatCnic(cnic: string): string {
      const cnicParts = cnic
        .replace(/\D/g, '')
        .match(/(\d{1,5})(\d{0,7})(\d?)/);

      if (cnicParts) {
        cnic = ""
        if (cnicParts[1]) cnic += cnicParts[1];
        if (cnicParts[2]) cnic += "-" + cnicParts[2];
        if (cnicParts[3]) cnic += "-" + cnicParts[3];
      }
      return cnic;
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
                      <h3 className="card-title">{editTeacher ? "Edit Teacher" : "Create New Teacher"}</h3>
                      <form onSubmit={handleSubmit} className='py-4 space-y-4'>

                        <div className='input-group'>
                          <span className='w-full'>Name</span>
                          <input onChange={(e) => setName(e.target.value)}
                                 value={name}
                                 type="text"
                                 placeholder="Dr. Shafqat Ali"
                                 required={true}
                                 className="input input-bordered"/>
                        </div>

                        <div className='input-group'>
                          <span className='w-full'>CNIC</span>
                          <input onChange={(e) => setCnic(e.target.value)}
                                 value={formatCnic(cnic)}
                                 minLength={15}
                                 maxLength={15}
                                 pattern={"^[0-9]{5}-[0-9]{7}-[0-9]$"}
                                 type="text"
                                 placeholder="35200-2222222-2"
                                 required={!editTeacher}
                                 disabled={!!editTeacher}
                                 className="input input-bordered"/>
                        </div>

                        <div className='input-group'>
                          <span className='w-full'>Password</span>
                          <input onChange={(e) => setPassword(e.target.value)}
                                 value={password}
                                 minLength={6}
                                 type="password"
                                 placeholder={editTeacher ? '(unchanged)' : "********"}
                                 required={!editTeacher}
                                 className="input input-bordered"/>
                        </div>

                        <div className='input-group'>
                          <span className='w-full'>Institute</span>
                          <input onChange={(e) => setInstitute(e.target.value)}
                                 value={institute}
                                 type="text"
                                 placeholder="University of Management and Technology"
                                 required={true}
                                 className="input input-bordered"/>
                        </div>

                        <div>
                          <div className="form-control">
                            <label className="label justify-start gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                className="radio"
                                onChange={(checked) => checked && setGender("male")}
                                checked={gender === 'male'}
                              />
                              <span className="label-text">Male</span>
                            </label>
                            <label className="label justify-start gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                className="radio"
                                onChange={(checked) => checked && setGender("female")}
                                checked={gender === 'female'}
                              />
                              <span className="label-text">Female</span>
                            </label>
                          </div>
                        </div>

                        <div className='flex w-full space-x-4 items-end justify-end'>
                          <button onClick={() => setIsOpenModal(false)} type='reset'
                                  className='btn btn-outline justify-self-end'>Cancel
                          </button>
                          <button type='submit' className='btn justify-self-end'>
                            {editTeacher ? 'Update' : 'Create'}
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
