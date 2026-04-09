import { UserPlus } from "lucide-react";

export default function RecommendedAlumni({ alumni = [] }) {
    if (!alumni.length) return null;

    return (
        <section className="mt-8">
            <h3 className="mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
                Recommended for You
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {alumni.map((person) => (
                    <div
                        key={person._id}
                        className="min-w-[250px] rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(34,211,238,0.1)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)]"
                    >
                        <div className="mb-4 flex items-center gap-3">
                            {person.profilePic ? (
                                <img
                                    src={person.profilePic}
                                    alt={person.name}
                                    className="h-12 w-12 rounded-full border border-cyan-400/30 object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/15 text-lg font-semibold text-cyan-300">
                                    {person.name?.[0] || "A"}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-gray-200">{person.name}</p>
                                <span className="rounded-full bg-yellow-400/20 px-2 py-1 text-xs text-yellow-300">
                                    {person.role}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400">
                            {person.organization || person.currentRole || person.industry || "Alumni Mentor"}
                        </p>

                        <button
                            type="button"
                            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)]"
                        >
                            <UserPlus size={16} />
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
