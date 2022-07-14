import type {NextPage} from 'next'
import AdminLayout from "../../components/AdminLayout";


const Dashboard: NextPage = () => {
  return (
    <>
      <AdminLayout>
        <div className='flex flex-col items-center justify-center space-y-4 py-8 container mx-auto'>
          <div className="stats shadow-lg">

            <div className="stat">
              <div className="stat-title">Total Students</div>
              <div className="stat-value">89,400</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Teachers</div>
              <div className="stat-value">89,400</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Questions</div>
              <div className="stat-value">89,400</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Exams</div>
              <div className="stat-value">89,400</div>
            </div>

          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default Dashboard
