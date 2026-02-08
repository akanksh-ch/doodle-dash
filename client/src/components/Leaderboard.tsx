'use client';

import { useEffect, useState } from 'react';

interface Score {
    id: number;
    username: string;
    score: number;
    created_at: string;
}

export default function Leaderboard() {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
            try {
                const res = await fetch(`${SERVER_URL}/api/leaderboard`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setScores(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div>Loading Leaderboard...</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">🏆 Leaderboard</h3>
            <ul>
                {scores.length === 0 ? (
                    <li className="text-gray-500">No scores yet. Be the first!</li>
                ) : (
                    scores.map((s, index) => (
                        <li key={s.id} className="flex justify-between py-2 border-b last:border-0">
                            <span className="font-medium text-gray-700">
                                {index + 1}. {s.username}
                            </span>
                            <span className="font-bold text-blue-600">{s.score} pts</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
