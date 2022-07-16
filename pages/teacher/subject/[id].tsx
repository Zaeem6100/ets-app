import DashboardLayout from "../../../components/DashboardLayout";
import {useContext, useEffect, useState} from "react";
import LoaderContext from "../../../context/LoaderContext";
import axios from "axios";
import {useRouter} from "next/router";
import {getPayload} from "../../../lib/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

export default function SubjectQuestionPage() {

  type Question = {
    id: number,
    statement: string,
    answer: number,
    op1: string,
    op2: string,
    op3: string,
    op4: string,
    TeacherId: string,
    SubjectId: string,
  }

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

      <div className='container mx-auto'>
        <div className='flex justify-between'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-3xl font-bold'>Questions</h2>
            <span className="indicator-item badge">{questions.length}</span>
          </div>
          <div className='tooltip tooltip-left' data-tip="Add new subject">
            <button onClick={() => {
              // setEditSubject(undefined);
              // setIsOpenModal(true);
            }} className='btn btn-primary gap-2'>
              <FontAwesomeIcon icon={faAdd}/>
              <span className='hidden sm:block'>Add Question</span>
            </button>
          </div>
        </div>
      </div>

      {questions?.map((question) => (
        <div>{question.statement}</div>
      ))}
    </DashboardLayout>
  );
}