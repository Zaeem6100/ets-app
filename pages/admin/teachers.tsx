import AdminLayout from "../../components/AdminLayout";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faEdit, faPlus, faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
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

type Subject = {
  id?: number,
  name: string,
};

type TeacherSubject = {
  id?: number,
  Subject: Subject,
};

export default function TeachersPage(): JSX.Element {
  const [subjectTeacherId, setSubjectTeacherId] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [editTeacher, setEditTeacher] = useState<Teacher | undefined>(undefined);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);

  const {setLoading} = useContext(LoaderContext);

  function refreshData() {
    setLoading(true);

    let requests = [
      axios.get("/api/subjects"),
      axios.get("/api/teachers")
    ];

    axios
      .all(requests)
      .then(axios.spread((subjectRes, teacherRes) => {
        if (subjectRes.status === 200 && teacherRes.status === 200) {
          setTeachers(teacherRes.data);
          setAllSubjects(subjectRes.data);
        }
      }))
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    refreshData();
  }, []);

  function handleDelete(id: string) {
    setLoading(true);
    axios
      .delete(`/api/teachers/${id}`)
      .then(res => {
        if (res.status === 200) {
          setTeachers(teachers.filter(s => s.id !== id));
        }
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function openTeacherSubjectModal(teacherId: string) {
    if (teacherId === "") return;
    setLoading(true);

    axios
      .get(`/api/teachers/${teacherId}/subjects`)
      .then(res => {
        if (res.status === 200) {
          setTeacherSubjects(res.data);
          setSubjectTeacherId(teacherId);
        }
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <AdminLayout>
        <TeacherModal/>
        <TeacherSubjectModal/>

        <div className='py-16 px-4 container max-w-4xl mx-auto'>
          <div className='flex justify-between'>
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-3xl font-bold'>Teachers</h2>
              <span className="indicator-item badge">{teachers.length}</span>
            </div>
            <div className='tooltip tooltip-left' data-tip="Add new teacher">
              <button onClick={() => {
                setEditTeacher(undefined);
                setIsOpenModal(true);
              }} className='btn btn-primary gap-2'>
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
              <button onClick={() => openTeacherSubjectModal(teacher.id)}
                      className='btn gap-2 btn-primary btn-outline flex flex-nowrap'>
                Subjects
                <span className='badge'>{teacher._count?.TeacherSubject || 0}</span>
              </button>
            </td>
            <td className='text-right'>
              <button className='btn btn-primary gap-2 btn-outline flex flex-nowrap'>
                Questions
                <span className='badge'>{teacher._count?.Question || 0}</span>
              </button>
            </td>
            <td className='text-right space-x-2'>
              <div className="tooltip" data-tip="Edit">
                <button onClick={() => {
                  setEditTeacher(teacher);
                  setIsOpenModal(true);
                }} className='btn btn-primary gap-2 btn-square'>
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

  function TeacherSubjectModal() {
    const [selectSubject, setSelectSubjectId] = useState<number | undefined>(allSubjects[0]?.id);

    function handleSubmit() {
      setLoading(true);
      axios
        .put(`/api/teachers/${subjectTeacherId}/subjects`, {subjects: teacherSubjects?.map(s => s.Subject.id)})
        .then(res => {
          if (res.status === 200) {
            refreshData();
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
          setSubjectTeacherId("");
        });
    }

    return (
      <Transition appear show={subjectTeacherId !== ""} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => setSubjectTeacherId("")}>
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
                      <h3 className="card-title flex justify-between">Subjects
                        <div className='ml-8 space-x-2 flex items-center'>
                          <button
                            onClick={handleSubmit}
                            className='btn btn-primary gap-2'>
                            Save
                            <FontAwesomeIcon icon={faSave}/>
                          </button>
                          <button
                            onClick={() => setSubjectTeacherId("")}
                            className='btn btn-primary btn-outline btn-square'>
                            <FontAwesomeIcon icon={faTimes}/>
                          </button>
                        </div>
                      </h3>

                      <div className='w-full mt-8'>
                        <div className='w-full input-group flex items-center'>
                          <select
                            className="flex-1 select select-bordered"
                            value={selectSubject}
                            onChange={e => setSelectSubjectId(Number(e.target.value))}
                          >
                            {allSubjects.map(
                              (subject, index) => (
                                <option key={index} value={subject.id}>
                                  {subject.name}
                                </option>
                              )
                            )}
                          </select>
                          <button
                            onClick={() => {
                              const sub = allSubjects.find(s => s.id === selectSubject);
                              let newSubjects = [...teacherSubjects].filter(s => s.Subject.id !== selectSubject);
                              if (sub) {
                                newSubjects.push({Subject: sub});
                                setTeacherSubjects(newSubjects);
                              }
                            }}
                            className='btn btn-primary justify-self-end'>
                            <FontAwesomeIcon icon={faPlus}/>
                          </button>
                        </div>
                      </div>

                      <div>
                        {teacherSubjects?.map((subject, index) => (
                          <div key={index}>
                            <div className='flex items-center justify-between space-x-2'>
                              <div className='flex flex-col'>
                                <span className='text-sm'>{subject.Subject.name}</span>
                              </div>
                              <div className='flex flex-col'>
                                <button onClick={() => {
                                  const newSubjects = [...teacherSubjects];
                                  newSubjects.splice(index, 1);
                                  setTeacherSubjects(newSubjects);
                                }} className='btn btn-ghost btn-square'>
                                  <FontAwesomeIcon icon={faTrash}/>
                                </button>
                              </div>
                            </div>
                            <div className='border-t border-gray-300'/>
                          </div>
                        ))}
                      </div>
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
                                  className='btn btn-primary btn-outline justify-self-end'>Cancel
                          </button>
                          <button type='submit' className='btn btn-primary justify-self-end'>
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
