import DashboardLayout from "../../../components/DashboardLayout";
import {FormEvent, Fragment, useContext, useEffect, useState} from "react";
import LoaderContext from "../../../context/LoaderContext";
import axios from "axios";
import {useRouter} from "next/router";
import {getPayload} from "../../../lib/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {Dialog, Transition} from "@headlessui/react";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export default function SubjectQuestionPage() {

  type Question = {
    id: number,
    statement: string,
    difficulty: number,
    answer: number,
    op1: string,
    op2: string,
    op3: string,
    op4: string,
    TeacherId: string,
    SubjectId: string,
  }

  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const {setLoading} = useContext(LoaderContext);
  const router = useRouter();

  function loadQuestions() {
    const subject_id = router.query.id as string;
    if (!subject_id) return;
    setLoading(true);
    axios
      .get(`/api/teachers/${getPayload()?.cnic}/subjects/${subject_id}/questions`)
      .then(res => {
        if (res.status === 200) {
          setQuestions(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <DashboardLayout>
      <AddQuestionModal/>

      <div className='py-16 container mx-auto'>
        <div className='flex justify-between'>
          <div className='flex items-center justify-center gap-2'>
            <button onClick={() => router.back()} className='btn btn-ghost btn-square'>
              <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
            <h2 className='text-3xl font-bold'>Questions</h2>
            <span className="indicator-item badge">{questions.length}</span>
          </div>
          <div className='tooltip tooltip-left' data-tip="Add new question">
            <button onClick={() => {
              setAddQuestionModal(true)
            }} className='btn btn-primary gap-2'>
              <FontAwesomeIcon icon={faAdd}/>
              <span className='hidden sm:block'>Add Question</span>
            </button>
          </div>
        </div>

        <div className='pt-8'>
          {questions?.map((question) => (
            <div className='card shadow-md'>
              <div className='card-body'>
                <div>Statement</div>
                <div className='card-title'>
                  <div className='w-full flex flex-col sm:flex-row gap-4 items-center justify-between'>
                    <p>{question.statement}</p>
                    <div className='badge flex-shrink-0'>
                      difficulty: {question.difficulty}
                    </div>
                  </div>
                </div>
                <div className='pt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div
                    className={`${question.answer === 1 && 'border border-2 border-success'} py-2 px-8 rounded-box bg-base-200`}>
                    <div>Option A</div>
                    <div>{question.op1}</div>
                  </div>

                  <div
                    className={`${question.answer === 2 && 'border border-2 border-success'} py-2 px-8 rounded-box bg-base-200`}>
                    <div>Option B</div>
                    <div>{question.op2}</div>
                  </div>

                  <div
                    className={`${question.answer === 3 && 'border border-2 border-success'} py-2 px-8 rounded-box bg-base-200`}>
                    <div>Option C</div>
                    <div>{question.op3}</div>
                  </div>

                  <div
                    className={`${question.answer === 4 && 'border border-2 border-success'} py-2 px-8 rounded-box bg-base-200`}>
                    <div>Option D</div>
                    <div>{question.op4}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );

  function AddQuestionModal() {
    const [statement, setStatement] = useState("");
    const [answer, setAnswer] = useState(1);
    const [difficulty, setDifficulty] = useState(1);
    const [op1, setOp1] = useState("");
    const [op2, setOp2] = useState("");
    const [op3, setOp3] = useState("");
    const [op4, setOp4] = useState("");

    function handleSubmit(e: FormEvent) {
      const sid = router.query.id as string;
      if (!sid) return;

      setLoading(true);
      axios
        .post(`/api/teachers/${getPayload()?.cnic}/subjects/${parseInt(sid)}/questions`, {
          statement, answer, difficulty, op1, op2, op3, op4
        })
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
            setAddQuestionModal(false);
            loadQuestions();
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });

      e.preventDefault();
    }

    return (
      <Transition appear show={addQuestionModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => setAddQuestionModal(false)}>
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
                  <div className="relative bg-base-100 card">
                    <div className="card-body">
                      <h3 className="card-title">Add New Question</h3>
                      <form onSubmit={handleSubmit} className='py-4 space-y-4'>

                        <label className='flex flex-col items-start space-y-2 w-full'>
                          <span className='font-semmibold'>Question Statement</span>
                          <textarea
                            value={statement}
                            onChange={(e) => setStatement(e.target.value)}
                            className="textarea w-full input-bordered"
                            placeholder="Where is tallest building located at?"></textarea>
                        </label>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='input-group'>
                            <span className={`${answer === 1 && 'bg-success'}`}>Option A</span>
                            <input
                              className={`${answer === 1 && 'border-success'} input input-bordered`}
                              value={op1}
                              onChange={(e) => setOp1(e.target.value)}
                            />
                          </div>

                          <div className='input-group'>
                            <span className={`${answer === 2 && 'bg-success'}`}>Option B</span>
                            <input
                              value={op2}
                              onChange={(e) => setOp2(e.target.value)}
                              className={`${answer === 2 && 'border-success'} input input-bordered`}/>
                          </div>

                          <div className='input-group'>
                            <span className={`${answer === 3 && 'bg-success'}`}>Option C</span>
                            <input
                              value={op3}
                              onChange={(e) => setOp3(e.target.value)}
                              className={`${answer === 3 && 'border-success'} input input-bordered`}/>
                          </div>

                          <div className='input-group'>
                            <span className={`${answer === 4 && 'bg-success'}`}>Option D</span>
                            <input
                              value={op4}
                              onChange={(e) => setOp4(e.target.value)}
                              className={`${answer === 4 && 'border-success'} input input-bordered`}/>
                          </div>

                          <label className='flex flex-col items-start space-y-2 w-full'>
                            <span className='font-semmibold'>Correct Answer</span>
                            <select
                              value={answer}
                              onChange={(e) => setAnswer(parseInt(e.target.value))}
                              className="select select-bordered w-full max-w-xs">
                              <option value={1}>Option A</option>
                              <option value={2}>Option B</option>
                              <option value={3}>Option C</option>
                              <option value={4}>Option D</option>
                            </select>
                          </label>

                          <label className='flex flex-col items-start space-y-2 w-full'>
                            <span className='font-semmibold'>Difficulty</span>
                            <input type="range" value={difficulty}
                                   onChange={(e) => setDifficulty(parseInt(e.target.value))}
                                   min="1" max="5" className="range range-primary" step="1"/>
                            <div className="w-full flex justify-between text-xs px-2">
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                          </label>
                        </div>

                        <div className='flex w-full space-x-4 items-end justify-end'>
                          <button onClick={() => setAddQuestionModal(false)} type='reset'
                                  className='btn btn-primary btn-outline justify-self-end'>Cancel
                          </button>
                          <button type='submit' className='btn btn-primary justify-self-end'>
                            Save
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