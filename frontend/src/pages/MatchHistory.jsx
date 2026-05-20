import { useEffect, useState } from "react";

import {
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  X
} from "lucide-react";

function MatchHistory() {

  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedMatch, setSelectedMatch] =
    useState(null);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/match-history"
        );

        const data = await res.json();

        const currentUser =
          localStorage.getItem("name");

        // PERSONAL MATCHES
        const filtered = data.filter(match => {

          // NEW MATCHES
          if (
            Array.isArray(
              match.participants
            )
          ) {

            return match.participants.includes(
              currentUser
            );
          }

          // OLD MATCHES
          return (

            match.winnerName ===
              currentUser

            ||

            match.rankings?.some(
              (player) =>
                player.name ===
                currentUser
            )
          );
        });

        setMatches(filtered);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchHistory();

  }, []);

  return (

    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">

          <Trophy size={14} />

          Battle Archive

        </div>

        <h1 className="text-5xl md:text-7xl font-black italic tracking-tight uppercase">
          Match History
        </h1>

        <p className="text-slate-500 mt-3 font-mono uppercase tracking-widest text-sm">
          Your personal contest history
        </p>

      </div>

      {/* CONTENT */}
      {loading ? (

        <div className="text-slate-500">
          Loading history...
        </div>

      ) : matches.length === 0 ? (

        <div className="text-slate-500">
          No previous battles found.
        </div>

      ) : (

        <div className="grid gap-6">

          {matches.map((match) => (

            <div
              key={match.id}
              className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-blue-500/20 transition-all"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                {/* LEFT */}
                <div className="space-y-4">

                  <div>

                    <h2 className="text-3xl font-black tracking-tight italic text-white">
                      {match.roomName}
                    </h2>

                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mt-1">
                      Room Code: {match.roomCode}
                    </p>

                  </div>

                  {/* INFO */}
                  <div className="flex flex-wrap gap-4">

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold">

                      <Trophy size={16} />

                      Winner: {match.winnerName}

                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold">

                      <Users size={16} />

                      {match.participantCount} Players

                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold">

                      <Calendar size={16} />

                      {new Date(
                        match.createdAt
                      ).toLocaleDateString()}

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <button
                  onClick={() =>
                    setSelectedMatch(match)
                  }
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold flex items-center gap-2"
                >

                  View Rankings

                  <ChevronRight size={18} />

                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}
      {selectedMatch && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6">

          <div className="w-full max-w-3xl bg-[#0f172a] border border-white/10 rounded-3xl p-8 relative">

            {/* CLOSE */}
            <button
              onClick={() =>
                setSelectedMatch(null)
              }
              className="absolute top-5 right-5 text-slate-500 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* TITLE */}
            <div className="mb-8">

              <h2 className="text-4xl font-black italic tracking-tight text-white">
                {selectedMatch.roomName}
              </h2>

              <p className="text-slate-500 uppercase tracking-widest text-xs mt-2">
                Final Rankings
              </p>

            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl border border-white/5">

              <table className="w-full">

                <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-widest">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Rank
                    </th>

                    <th className="px-6 py-4 text-left">
                      Player
                    </th>

                    <th className="px-6 py-4 text-left">
                      Solved
                    </th>

                    <th className="px-6 py-4 text-left">
                      Time
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedMatch.rankings.map(
                    (user, index) => (

                    <tr
                      key={index}
                      className="border-t border-white/5"
                    >

                      <td className="px-6 py-5 font-black text-xl text-yellow-400">
                        #{index + 1}
                      </td>

                      <td className="px-6 py-5 font-bold text-white uppercase">
                        {user.name}
                      </td>

                      <td className="px-6 py-5 text-emerald-400 font-mono">
                        {user.solved}
                      </td>

                      <td className="px-6 py-5 text-blue-400 font-mono">
                        {Math.floor(
                          user.timeTakenMs / 1000
                        )}s
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MatchHistory;