import type {NextPage} from 'next'
import DashboardLayout from "../../components/DashboardLayout";
import format from "date-fns/format";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import LoaderContext from "../../context/LoaderContext";
import {isFuture, isPast} from "date-fns";
import Link from "next/link";


type Subject = {
  id: number,
  name: string,
}

type Exam = {
  id: number,
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
};

type StudentExam = {
  id: number,
  Exam: Exam,
  score?: number,
  _count?: {
    ComputedQuestion: number
  }
}

function getAverageDifficulty(exam: Exam): string {
  const weightedSum =
    exam.amountDifficulty1 +
    (exam.amountDifficulty2 * 2) +
    (exam.amountDifficulty3 * 3) +
    (exam.amountDifficulty4 * 4) +
    (exam.amountDifficulty5 * 5);

  const sum =
    exam.amountDifficulty1 +
    exam.amountDifficulty2 +
    exam.amountDifficulty3 +
    exam.amountDifficulty4 +
    exam.amountDifficulty5;

  return (weightedSum / sum).toFixed(2);
}

const Dashboard: NextPage = () => {
  const [exams, setExams] = useState<StudentExam[]>([]);
  const {setLoading} = useContext(LoaderContext);

  function loadExams() {
    setLoading(true);
    axios
      .get('/api/exams')
      .then(res => {
        if (res.status === 200) {
          setExams(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className='py-16 mx-auto container px-4'>
          <StudentExamsTable/>
        </div>
      </DashboardLayout>
    </>
  )

  function StudentExamsTable() {
    return (
      <table className="table w-full shadow-xl">
        <thead>
        <tr>
          <th>Name</th>
          <th>Subject</th>
          <th>Difficulty</th>
          <th>Exam End</th>
          <th>Questions</th>
          <th>Score</th>
        </tr>
        </thead>
        <tbody>
        {exams.map((exam, index) => (
          <tr key={index}>
            <td>{exam.Exam.name}</td>
            <td>{exam.Exam.Subject.name}</td>
            <td>{getAverageDifficulty(exam.Exam)}</td>
            <td>{format(new Date(exam.Exam.examEnd), 'dd/MM/yyyy hh:mm a')}</td>
            <td>{exam._count?.ComputedQuestion}</td>
            <td className='text-right space-x-2 flex items-center justify-center'>
              {renderScoreAction(exam)}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );

    function renderScoreAction(exam: StudentExam) {
      if (exam.Exam.status === 'published') {
        return (
          <>
            {exam.score !== null ? `${exam.score} / ${exam._count?.ComputedQuestion}` : 'Absent'}
          </>
        );
      } else if (exam.score !== null || isPast(new Date(exam.Exam.examEnd))) {
        return (
          <>
            Result Awaited
          </>
        );
      } else if (isFuture(new Date(exam.Exam.examStart))) {
        return (
          <>
            Not Started Yet
          </>
        );
      } else {
        return (
          <>
            <Link href={`/student/exam/${exam.Exam.id}`}>
              <div className='btn btn-primary'>Start</div>
            </Link>
          </>
        );
      }
    }
  }
}

export default Dashboard;
