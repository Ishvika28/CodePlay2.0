import { useState } from "react"

function SubmitCode({ problemId }) {

  const [code, setCode] = useState("")
  const [result, setResult] = useState("")

  const handleSubmit = async () => {
    try {
      if (!code.trim()) {
  alert("Write some code first")
  return
}
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId,
          code
        })
      })

      const data = await res.json()

      setResult(data.result)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mt-10">

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        className="w-full h-60 p-4 bg-black/40 border border-white/10 rounded-lg"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-white text-black rounded-lg"
      >
        Submit Code
      </button>

      {result && (
        <p className="mt-4 text-lg">
          Result: {result}
        </p>
      )}

    </div>
  )
}

export default SubmitCode