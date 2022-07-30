import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {CSSProperties, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {RadioGroup} from "@headlessui/react";
import LoaderContext from "../../../context/LoaderContext";
import axios from "axios";
import DashboardLayout from "../../../components/DashboardLayout";
import {intervalToDuration} from "date-fns";

let options = [
  "Option A",
  "Option B",
  "Option C",
  "Option D",
];

type Exam = {
  id: number,
  name: string,
  status: string,
  examStart: Date,
  examEnd: Date,
};

type Question = {
  statement: string,
  op1: string,
  op2: string,
  op3: string,
  op4: string,
};

type ComputedQuestion = {
  id: number,
  Question: Question,
  markedAnswer?: number,
};

type StudentExam = {
  id: number,
  Exam: Exam,
  ComputedQuestion: ComputedQuestion[],
  score?: number,
}

const CountDownTimer = ({endTime}: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState<Duration | undefined>(undefined);

  function updateTime() {
    const duration = intervalToDuration({
      start: new Date(),
      end: new Date(endTime)
    })
    setTimeLeft(duration);
  }

  useEffect(() => {
    const x = setInterval(updateTime, 1000);
    return () => {
      clearInterval(x);
    };
  }, []);

  return <div className="grid grid-flow-col px-16 gap-3 text-center place-items-center">
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl font-bold">
        <span style={{"--value": timeLeft?.days} as CSSProperties}/>
      </span>
      days
    </div>
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl font-bold">
        <span style={{"--value": timeLeft?.hours} as CSSProperties}/>
      </span>
      hours
    </div>
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl font-bold">
        <span style={{"--value": timeLeft?.minutes} as CSSProperties}/>
      </span>
      min
    </div>
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl font-bold">
        <span style={{"--value": timeLeft?.seconds} as CSSProperties}/>
      </span>
      sec
    </div>
  </div>;
};

export default function StudentExamPage() {
  const router = useRouter();

  const [studentExam, setStudentExam] = useState<StudentExam | undefined>(undefined);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map<number, number>());

  const {setLoading} = useContext(LoaderContext);

  function loadExam() {
    const {eid} = router.query;
    if (!eid) return;
    setLoading(true);
    axios
      .get(`/api/exams/${eid}`)
      .then(res => {
        if (res.status === 200) {
          setStudentExam(res.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false)
      });
  }

  useEffect(() => {
    if (router.isReady) loadExam();
  }, [router.isReady]);

  function handleSubmit() {
    const {eid} = router.query;
    if (!eid) return;
    setLoading(true);
    axios
      .post(`/api/exams/${eid}/submit`, {
        answers: Array.from(answers, ([qid, answer]) => ({qid, answer: answer + 1}))
      })
      .then(res => {
        if (res.status === 200) router.push('/');
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <DashboardLayout>
        <div className='mx-auto container'>
          <div className='fixed top-0 left-0 right-0 bg-base-100 w-screen z-10 border-b border-base-300'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-24 pb-4 px-8 max-w-4xl mx-auto'>
              {studentExam?.Exam?.examEnd &&
                  <CountDownTimer endTime={studentExam.Exam.examEnd}/>
              }
              <button onClick={handleSubmit} className='btn btn-primary gap-2'>
                Submit
                <FontAwesomeIcon icon={faPaperPlane}/>
              </button>
            </div>
          </div>
          <div className='space-y-16 sm:pt-40 pt-52 pb-16 px-4'>
            {studentExam && studentExam.ComputedQuestion.map(renderQuestion)}
          </div>
        </div>
      </DashboardLayout>
    </>
  );

  function renderQuestion(question: ComputedQuestion, index: number) {
    return (
      <div key={question.id} className='w-full shadow-xl card'>
        <div className='card-body'>
          {/*Options*/}
          <RadioGroup value={answers.get(question.id)} onChange={(value) => {
            if (value !== undefined) {
              setAnswers(new Map(answers.set(question.id, value)))
            }
          }}>
            <RadioGroup.Label>
              <h6 className='font-bold'>
                Question {index + 1}
              </h6>
              <p>{question.Question.statement}</p>
            </RadioGroup.Label>

            <div className='mt-4 grid sm:grid-cols-2 gap-4'>
              {
                [question.Question.op1, question.Question.op2, question.Question.op3, question.Question.op4].map((opt, index) => (
                  <RadioGroup.Option className='card' key={index} value={index}>
                    {({checked}) => (
                      <div
                        className={`relative flex justify-between cursor-pointer px-5 py-4 focus:outline-none ${checked ? 'bg-primary text-primary-content' : 'bg-base-300'}`}>
                        <div>
                          <p
                            className={`text-xs ${checked ? 'text-primary-content' : ''}`}>{options[index]}</p>
                          <p className='text-sm'>{opt}</p>
                        </div>

                        {checked && (
                          <FontAwesomeIcon
                            className="h-6 w-6 self-center shrink-0 text-primary-content"
                            icon={faCheck}/>
                        )}
                      </div>
                    )}
                  </RadioGroup.Option>
                ))
              }
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }
}
