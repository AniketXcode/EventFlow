import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/events");
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          ⚡ EventFlow
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <a href="#dashboard" className="text-indigo-600">
            Dashboard
          </a>
          <a href="#calendar" className="hover:text-indigo-600 transition">
            Calendar
          </a>
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
            JD
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sydney Events
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track upcoming local events.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                🔍
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchEvents}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wide">
                    {event.source}
                  </span>
                  <span className="text-xs text-gray-400">Today</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4 leading-snug">
                  {event.title}
                </h3>

                {/* Meta */}
                <div className="mt-auto border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-700">
                      {event.city}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex gap-3">
                  <a
                    href={event.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 rounded-md border border-gray-300 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    View Details
                  </a>

                  <button className="w-9 h-9 rounded-md border border-gray-300 text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition">
                    ♡
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h3 className="text-lg font-semibold text-gray-700">
                No events found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* Skeleton Loader */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
    </div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
    <div className="mt-6 flex gap-3">
      <div className="h-9 flex-1 bg-gray-200 rounded"></div>
      <div className="h-9 w-9 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default App;