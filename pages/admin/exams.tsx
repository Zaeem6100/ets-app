import AdminLayout from "../../components/AdminLayout";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faEdit} from "@fortawesome/free-solid-svg-icons";
import {FormEvent, Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import axios from "axios";
import LoaderContext from "../../context/LoaderContext";
import format from 'date-fns/format';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {isPast} from "date-fns";

type Subject = {
  id: number,
  name: string,
}

type Exam = {
  id: string,
  name: string,
  subjectId: number,
  Subject: Subject,
  status: string,
  examStart: Date,
  examEnd: Date,
  amountDifficulty1: number,
  amountDifficulty2: number,
  amountDifficulty3: number,
  amountDifficulty4: number,
  amountDifficulty5: number,
  createdAt: Date,
  _count?: {
    StudentExam: number,
  }
};

export default function ExamsPage(): JSX.Element {
  let [isOpenModal, setIsOpenModal] = useState(false);
  let [editExam, setEditExam] = useState<Exam | undefined>(undefined);
  let [subjects, setSubjects] = useState<Subject[]>([]);

  let [exams, setExams] = useState<Exam[]>([]);
  const {setLoading} = useContext(LoaderContext);

  function loadData() {
    setLoading(true);

    const requests = [
      axios.get("/api/subjects"),
      axios.get("/api/exams"),
    ];

    axios
      .all(requests)
      .then(axios.spread((resSubject, resExam) => {
        if (resSubject.status === 200 && resExam.status === 200) {
          setExams(resExam.data);
          setSubjects(resSubject.data);
          setLoading(false);
        }
      }))
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleDelete(id: string) {
    setLoading(true);
    axios.delete(`/api/exams/${id}`).then(res => {
      if (res.status === 200) {
        setExams(exams.filter(s => s.id !== id));
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
        <ExamModal/>

        <div className='py-16 px-4 container max-w-6xl mx-auto'>
          <div className='flex justify-between'>
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-3xl font-bold'>Exams</h2>
              <span className="indicator-item badge">{exams.length}</span>
            </div>
            <div className='tooltip tooltip-left' data-tip="Add new exam">
              <button onClick={() => {
                setEditExam(undefined);
                setIsOpenModal(true);
              }} className='btn btn-primary gap-2'>
                <FontAwesomeIcon icon={faAdd}/>
                <span className='hidden sm:block'>Add Exam</span>
              </button>
            </div>
          </div>
          <div className='overflow-y-auto my-8 shadow-xl'>
            <ExamsTable/>
          </div>
        </div>
      </AdminLayout>
    </>
  )

  function ExamsTable() {
    return (
      <table className="table w-full">
        <thead>
        <tr className='text-center'>
          <th>Name</th>
          <th>Subject</th>
          <th>Exam Start</th>
          <th>Exam End</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {exams.map((exam, index) => (
          <tr key={index}>
            <td>{exam.name}</td>
            <td>{exam.Subject.name}</td>
            <td>{format(new Date(exam.examStart), 'dd/MM/yyyy hh:mm')}</td>
            <td>{format(new Date(exam.examEnd), 'dd/MM/yyyy hh:mm')}</td>
            <td>{format(new Date(exam.createdAt), 'dd/MM/yyyy hh:mm')}</td>
            <td className='text-right space-x-2 flex items-center'>
              {exam.status === 'draft' && <button className='btn btn-success'>Generate</button>}
              {exam.status === 'generated' && isPast(new Date(exam.examEnd)) &&
                (<button className='btn btn-warning'>Publish</button>)
              }
              {exam.status === 'draft' && (
                <div className="tooltip" data-tip="Edit">
                  <button onClick={() => {
                    setEditExam(exam);
                    setIsOpenModal(true);
                  }} className='btn btn-primary gap-2 btn-square'>
                    <FontAwesomeIcon icon={faEdit}/>
                  </button>
                </div>
              )}
              {exam.status !== 'published' && (
                <div className='tooltip' data-tip="Delete">
                  <button onClick={() => handleDelete(exam.id)} className='btn btn-error btn-square'>
                    <FontAwesomeIcon icon={faTrash}/>
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }

  function ExamModal() {
    const [name, setName] = useState<string>(editExam ? editExam.name : "");
    const [subjectId, setSubjectId] = useState<number>(editExam ? editExam.subjectId : subjects[0]?.id);
    const [examStart, setExamStart] = useState<Date>(editExam ? new Date(editExam.examStart) : new Date());
    const [examEnd, setExamEnd] = useState<Date>(editExam ? new Date(editExam.examEnd) : new Date());
    const [amountDifficulty1, setAmountDifficulty1] = useState<number>(editExam ? editExam.amountDifficulty1 : 0);
    const [amountDifficulty2, setAmountDifficulty2] = useState<number>(editExam ? editExam.amountDifficulty2 : 0);
    const [amountDifficulty3, setAmountDifficulty3] = useState<number>(editExam ? editExam.amountDifficulty3 : 0);
    const [amountDifficulty4, setAmountDifficulty4] = useState<number>(editExam ? editExam.amountDifficulty4 : 0);
    const [amountDifficulty5, setAmountDifficulty5] = useState<number>(editExam ? editExam.amountDifficulty5 : 0);


    function handleSubmit(e: FormEvent) {
      setLoading(true);

      const data = {
        name,
        subjectId,
        examStart,
        examEnd,
        amountDifficulty1,
        amountDifficulty2,
        amountDifficulty3,
        amountDifficulty4,
        amountDifficulty5,
      };

      let req = editExam ?
        axios.put(`/api/exams/${editExam.id}`, data) :
        axios.post('/api/exams', data);

      req
        .then(res => {
          if (res.status === 200) loadData();
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
          setIsOpenModal(false);
        });

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
                      <h3 className="card-title">{editExam ? "Edit Student" : "Create New Student"}</h3>
                      <form onSubmit={handleSubmit} className='py-4 space-y-8'>

                        <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                          <div className='input-group'>
                            <span className='w-full'>Name</span>
                            <input onChange={(e) => setName(e.target.value)}
                                   value={name}
                                   type="text"
                                   placeholder="Final Exam"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span className=''>Subject</span>
                            <select
                              className="flex-1 select select-bordered"
                              value={subjectId}
                              onChange={e => setSubjectId(Number(e.target.value))}
                            >
                              {subjects.map(
                                (subject, index) => (
                                  <option key={index} value={subject.id}>
                                    {subject.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className='input-group'>
                            <span>Start Time</span>
                            <input onChange={(e) => {
                              console.log(e.target.value);
                              setExamStart(new Date(e.target.value));
                            }}
                                   value={format(examStart, "yyyy-MM-dd'T'HH:mm")}
                                   type="datetime-local"
                                   placeholder="5"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span>End Time</span>
                            <input onChange={(e) => setExamEnd(new Date(e.target.value))}
                                   value={format(examEnd, "yyyy-MM-dd'T'HH:mm")}
                                   type="datetime-local"
                                   placeholder="5"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <p className='md:col-span-2'>Amount of Questions</p>

                          <div className='input-group'>
                            <span className='w-full'>Difficulty 1</span>
                            <input onChange={(e) => setAmountDifficulty1(Number(e.target.value))}
                                   value={amountDifficulty1}
                                   type="number"
                                   placeholder="5"
                                   min="0"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span className='w-full'>Difficulty 2</span>
                            <input onChange={(e) => setAmountDifficulty2(Number(e.target.value))}
                                   value={amountDifficulty2}
                                   type="number"
                                   placeholder="5"
                                   min="0"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span className='w-full'>Difficulty 3</span>
                            <input onChange={(e) => setAmountDifficulty3(Number(e.target.value))}
                                   value={amountDifficulty3}
                                   type="number"
                                   placeholder="5"
                                   min="0"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span className='w-full'>Difficulty 4</span>
                            <input onChange={(e) => setAmountDifficulty4(Number(e.target.value))}
                                   value={amountDifficulty4}
                                   type="number"
                                   placeholder="5"
                                   min="0"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                          <div className='input-group'>
                            <span className='w-full'>Difficulty 5</span>
                            <input onChange={(e) => setAmountDifficulty5(Number(e.target.value))}
                                   value={amountDifficulty5}
                                   type="number"
                                   placeholder="5"
                                   min="0"
                                   required={true}
                                   className="input input-bordered"/>
                          </div>

                        </div>

                        <div className='flex w-full space-x-4 items-end justify-end'>
                          <button onClick={() => setIsOpenModal(false)} type='reset'
                                  className='btn btn-primary btn-outline justify-self-end'>Cancel
                          </button>
                          <button type='submit' className='btn btn-primary justify-self-end'>
                            {editExam ? 'Update' : 'Create'}
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
