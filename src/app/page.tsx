"use client";
import React, {useState, ChangeEvent} from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain } from "react-icons/fa6";

type Subject = {
  id?: number;
  name: string;
  score: string;
  nextExam: string;
  priority: "high" | "medium" | "low";
}

const StudyDashboard = () => {
  // Sample data for the dashboard
  const initialSubjects: Subject[] = [
    {id: 1, name: "Mathematics", score: "68", nextExam: "2025-05-15", priority: "high"},
    {id: 2, name: "Physics", score: "72", nextExam: "2025-06-20", priority: "medium"},
    {id: 3, name: "Chemistry", score: "85", nextExam: "2025-07-10", priority: "low"},
    {id: 4, name: "Biology", score: "60", nextExam: "2025-05-30", priority: "high"},
    {id: 5, name: "History", score: "75", nextExam: "2025-06-05", priority: "medium"},
  ];

  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [newSubject, setNewSubject] = useState({
    name: "",
    score: "",
    nextExam: "",
    priority: "medium" as "high" | "medium" | "low",
  });
  const [editSubject, setEditSubject] = useState({ ...newSubject });
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showModal, setShowModal] = useState(false);


  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  // Process data for the chart
  const chartData = subjects.map((subject) => ({
    name: subject.name.substring(0, 3),
    score: subject.score,
    fullName: subject.name,
  }));

  const validateSubject = (subject: Subject) => {
    if (!subject.name) {
      return "Please enter a subject name.";
    }
    if (!subject.score || isNaN(parseInt(subject.score)) || parseInt(subject.score) < 0 || parseInt(subject.score) > 100) {
      return "Please enter a valid score between 0 and 100.";
    }
    if (!subject.nextExam) {
      return "Please select the next exam date.";
    }
    return "";
  }

  const handleEditNewSubject = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setNewSubject({...newSubject, [name]: value});
  };

  const handleEditSubject = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setEditSubject({...editSubject, [name]: value});
  };

  const handleAddSubject = () => {
    const subject: Subject = {
      id: subjects.length + 1,
      name: newSubject.name,
      score: newSubject.score,
      nextExam: newSubject.nextExam,
      priority: newSubject.priority as "high" | "medium" | "low",
    };
    const error = validateSubject(subject);
    if (error) setErrorMessage(error);
    else {
      setErrorMessage("");
      setSubjects([...subjects, subject]);
      setNewSubject({
        name: "",
        score: "",
        nextExam: "",
        priority: "medium",
      });
    }
  };

  const handleDeleteSubject = (id?: number) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#D6283920] text-[#D62839]";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const modalInputStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

  const filteredSubjects = [...subjects].sort((a, b) => {
    // Sort by priority (high first) and then by score (low first)
    const priorityOrder = {high: 1, medium: 2, low: 3};
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    console.log(a, b);
    return a.score.localeCompare(b.score);
  });

  const upcomingExams = [...subjects]
      .filter((subject) => new Date(subject.nextExam) > new Date())
      .sort((a, b) => new Date(a.nextExam).getTime() - new Date(b.nextExam).getTime());

  const daysUntilExam = (examDate: string) => {
    const diffTime = Math.abs(new Date(examDate).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const initiateEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setEditSubject({
      name: subject.name,
      score: subject.score.toString(),
      nextExam: subject.nextExam,
      priority: subject.priority,
    });
    setShowModal(true);
  };

  const handleUpdateSubject = () => {
    const error = validateSubject(editSubject);
    if (error) setEditErrorMessage(error);
    else {
      setEditErrorMessage("");
      const updatedSubjects = subjects.map((subject) =>
          subject.id === selectedSubject?.id
              ? {
                ...subject,
                name: editSubject.name,
                score: editSubject.score,
                nextExam: editSubject.nextExam,
                priority: editSubject.priority,
              }
              : subject
      ) as Subject[];
      setSubjects(updatedSubjects);
      setShowModal(false);
      setSelectedSubject(null);
    }
  };


  return (
      <>
        <header className="flex justify-center items-center h-16 bg-[#6184D8]">
            <h1 className="text-3xl font-bold text-white flex items-center">Assist AI <FaBrain className="ml-3"/></h1>
        </header>

        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[#0F8B8D]">Study Performance Dashboard</h1>
            <p className="text-gray-600 mt-2 mb-6">
              Track your test results and upcoming exams to prioritize your study plan
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Summary Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold text-[#0F8B8D]">
                      {Math.round(subjects.reduce((sum, subject) => sum + parseInt(subject.score, 10), 0) / subjects.length) || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weakest Subject</p>
                    <p className="text-xl font-semibold text-[#D62839]">
                      {subjects.reduce((min, subject) => (subject.score < min.score ? subject : min), subjects[0])?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Exam In</p>
                    <p className={`text-xl font-semibold ${getPriorityColor(upcomingExams[0]?.priority || "").split(" ")[1]}`}>
                      {upcomingExams.length > 0 ? `${upcomingExams[0].name} (${daysUntilExam(upcomingExams[0].nextExam)} days)` : "No upcoming exams"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Subject Performance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3"/>
                      <XAxis dataKey="name"/>
                      <YAxis domain={[0, 100]}/>
                      <Tooltip
                          labelStyle={{color: "#000"}}
                          formatter={(value) => [`${value}%`]}
                          labelFormatter={(value) => subjects.find((s) => s.name.substring(0, 3) === value)?.name || ""}
                      />
                      <Bar dataKey="score" fill="#6184D8" name="Score"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Exams */}
              <div className="bg-white rounded-lg shadow p-6 ">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Exams</h2>
                <div className="space-y-3 max-h-88 overflow-y-auto pe-3">
                  {upcomingExams.length > 0 ? (
                      upcomingExams.map((subject) => (
                          <div key={subject.id} className="border-b pb-3 last:border-b-0">
                            <div className="flex justify-between items-center text-gray-500">
                              <span className="font-medium">{subject.name}</span>
                              <span className="text-sm">{daysUntilExam(subject.nextExam)} days</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{new Date(subject.nextExam).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(subject.priority)}`}>
                        {subject.priority}
                      </span>
                            </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-gray-500 italic">No upcoming exams scheduled</p>
                  )}
                </div>
              </div>

              {/* Study Priority Queue */}
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Study Priority Queue</h2>
                <div className="overflow-x-auto max-h-88 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Exam
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className={`px-6 py-4 whitespace-nowrap`}>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(subject.priority)}`}>
                          {subject.priority}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.score}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(subject.nextExam).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => initiateEditSubject(subject)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#6184D840] text-[#6184D8] hover:text-[#6184D8A0] focus:outline-none focus:ring-2 focus:ring-[#6184D870] mr-2"
                            >
                              Edit
                            </button>
                            <button
                                onClick={() => handleDeleteSubject(subject.id)}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor("high")} hover:text-[#D6283990] focus:outline-none focus:ring-2 focus:ring-[#D6283970]`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add New Subject Form */}
            <div className="bg-white rounded-lg shadow p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Subject</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Subject Name
                  </label>
                  <input
                      type="text"
                      id="name"
                      name="name"
                      value={newSubject.name}
                      onChange={handleEditNewSubject}
                      className={modalInputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="score" className="block text-gray-700 text-sm font-bold mb-2">
                    Score (%)
                  </label>
                  <input
                      type="number"
                      id="score"
                      name="score"
                      value={newSubject.score}
                      onChange={handleEditNewSubject}
                      className={modalInputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="nextExam" className="block text-gray-700 text-sm font-bold mb-2">
                    Next Exam Date
                  </label>
                  <input
                      type="date"
                      id="nextExam"
                      name="nextExam"
                      value={newSubject.nextExam}
                      onChange={handleEditNewSubject}
                      className={modalInputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
                    Priority
                  </label>
                  <select
                      id="priority"
                      name="priority"
                      value={newSubject.priority}
                      onChange={handleEditNewSubject}
                      className={modalInputStyle}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <button
                  onClick={handleAddSubject}
                  className="bg-[#6184D8] hover:bg-[#6184D890] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
              >
                Add Subject
              </button>
              <AnimatePresence>
                {errorMessage && (
                    <motion.p
                        className="text-[#D62839] text-sm mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                      {errorMessage}
                    </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Edit Modal */}
            {showModal && selectedSubject && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div className="fixed flex justify-center items-center min-h-screen min-w-screen">
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Edit Subject
                          </h3>
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="edit-name" className="block text-gray-700 text-sm font-bold mb-2">
                                Subject Name
                              </label>
                              <input
                                  type="text"
                                  name="name"
                                  value={editSubject.name}
                                  onChange={handleEditSubject}
                                  className={modalInputStyle}
                              />
                            </div>
                            <div>
                              <label htmlFor="edit-score" className="block text-gray-700 text-sm font-bold mb-2">
                                Score (%)
                              </label>
                              <input
                                  type="number"
                                  name="score"
                                  value={editSubject.score}
                                  onChange={handleEditSubject}
                                  className={modalInputStyle}
                              />
                            </div>
                            <div>
                              <label htmlFor="edit-nextExam" className="block text-gray-700 text-sm font-bold mb-2">
                                Next Exam Date
                              </label>
                              <input
                                  type="date"
                                  name="nextExam"
                                  value={editSubject.nextExam}
                                  onChange={handleEditSubject}
                                  className={modalInputStyle}
                              />
                            </div>
                            <div>
                              <label htmlFor="edit-priority" className="block text-gray-700 text-sm font-bold mb-2">
                                Priority
                              </label>
                              <select
                                  name="priority"
                                  value={editSubject.priority}
                                  onChange={handleEditSubject}
                                  className={modalInputStyle}
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                            <AnimatePresence>
                              {editErrorMessage && (
                                  <motion.p
                                      className="text-[#D62839] text-sm mt-1"
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -5 }}
                                      transition={{ duration: 0.2 }}
                                  >
                                    {editErrorMessage}
                                  </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#6184D8] text-base font-medium text-white hover:bg-[#6184D8A0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6184D8A0] sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={handleUpdateSubject}
                          >
                            Update
                          </button>
                          <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6184D8A0] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default StudyDashboard;