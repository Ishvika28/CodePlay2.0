import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SubmitCode from "../components/SubmitCode"

function Problem() {

  const { problemId } = useParams()

  const [problem, setProblem] = useState(null)

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5000/api/problems/${problemId}`)
      const data = await res.json()
      setProblem(data)
    }

    fetchProblem()
  }, [problemId])

  if (!problem) {
    return <p className="text-white p-6">Loading...</p>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-4">
        {problem.title}
      </h1>

      <p className="text-gray-400 mb-6">
        {problem.description}
      </p>

      <SubmitCode problemId={problem._id} />

    </div>
  )
}

export default Problem