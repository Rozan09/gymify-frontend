import React, { useState } from 'react';
import { useFormik } from 'formik';
import { FaCalculator, FaFireAlt, FaRunning, FaWeight, FaChartLine } from 'react-icons/fa';

const exerciseData = {
  running: 10,
  cycling: 8,
  swimming: 9.5,
  walking: 4,
  jumpingRope: 12,
  yoga: 3,
  dancing: 6.5,
  hiking: 7,
  elliptical: 7.5,
  strengthTraining: 6,
  aerobics: 7,
  boxing: 11,
  pilates: 4,
  stairClimbing: 8.5,
  rowing: 9,
};

export default function CombinedCalculator() {
  const [burnedCalories, setBurnedCalories] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [calories, setCalories] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const exerciseFormik = useFormik({
    initialValues: {
      exercise: 'running',
      duration: '',
    },
    onSubmit: (values) => {
      const { exercise, duration } = values;
      const minutes = parseFloat(duration);
      const rate = exerciseData[exercise] || 0;
      const total = rate * minutes;
      setBurnedCalories(total.toFixed(0));
    },
  });

  const sortedExerciseEntries = Object.entries(exerciseData).sort(
    (a, b) => b[1] - a[1]
  );

  const calorieFormik = useFormik({
    initialValues: {
      age: '',
      gender: 'male',
      weight: '',
      weightUnit: 'kg',
      height: '',
      heightUnit: 'cm',
      activity: '1.2',
    },
    onSubmit: (values) => {
      let { age, gender, weight, weightUnit, height, heightUnit, activity } = values;
      let w = parseFloat(weight);
      let h = parseFloat(height);
      const a = parseFloat(age);
      const act = parseFloat(activity);

      if (weightUnit === 'lbs') w *= 0.453592;
      if (heightUnit === 'in') h *= 2.54;

      let bmr = 0;
      if (gender === 'male') bmr = 10 * w + 6.25 * h - 5 * a + 5;
      else bmr = 10 * w + 6.25 * h - 5 * a - 161;

      const totalCalories = bmr * act;
      setCalories(totalCalories.toFixed(0));

      const hMeters = h / 100;
      const bmiValue = w / (hMeters * hMeters);
      setBmi(bmiValue.toFixed(1));

      let category = '';
      if (bmiValue < 18.5) category = 'Underweight';
      else if (bmiValue < 24.9) category = 'Normal';
      else if (bmiValue < 29.9) category = 'Overweight';
      else category = 'Obese';
      setBmiCategory(category);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <FaCalculator className="mx-auto h-12 w-12 text-[#ff4857]" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Fitness Calculator Hub
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Calculate your daily calorie needs, BMI, and exercise calories burned - all in one place
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Daily Calorie Calculator */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#ff4857] to-[#ff6b77] px-6 py-4">
                <div className="flex items-center">
                  <FaFireAlt className="h-6 w-6 text-white" />
                  <h2 className="ml-3 text-xl font-bold text-white">Daily Calorie Calculator</h2>
                </div>
                <p className="mt-1 text-sm text-white opacity-90">Calculate your daily calorie needs based on your body metrics</p>
              </div>

              <div className="p-6">
                <form onSubmit={calorieFormik.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        placeholder="Enter your age"
                        onChange={calorieFormik.handleChange}
                        value={calorieFormik.values.age}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        onChange={calorieFormik.handleChange}
                        value={calorieFormik.values.gender}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="weight"
                          placeholder="Weight"
                          onChange={calorieFormik.handleChange}
                          value={calorieFormik.values.weight}
                          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                        />
                        <select
                          name="weightUnit"
                          onChange={calorieFormik.handleChange}
                          value={calorieFormik.values.weightUnit}
                          className="border border-l-0 border-gray-300 rounded-r-lg pr-6 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="height"
                          placeholder="Height"
                          onChange={calorieFormik.handleChange}
                          value={calorieFormik.values.height}
                          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                        />
                        <select
                          name="heightUnit"
                          onChange={calorieFormik.handleChange}
                          value={calorieFormik.values.heightUnit}
                          className="border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                        >
                          <option value="cm">cm</option>
                          <option value="in">inches</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select
                      name="activity"
                      onChange={calorieFormik.handleChange}
                      value={calorieFormik.values.activity}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff4857] focus:border-transparent"
                    >
                      <option value="1.2">Sedentary (little/no exercise)</option>
                      <option value="1.375">Lightly active (1–3 days/week)</option>
                      <option value="1.55">Moderately active (3–5 days/week)</option>
                      <option value="1.725">Very active (6–7 days/week)</option>
                      <option value="1.9">Super active (hard training + physical job)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff4857] to-[#ff6b77] text-white py-3 rounded-lg font-semibold shadow-lg hover:from-[#ff3847] hover:to-[#ff5b67] transition-all duration-300"
                  >
                    Calculate Daily Calories
                  </button>
                </form>

                {calories && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#ff4857]">
                        {calories} kcal/day
                      </h3>
                      <p className="text-gray-600 mt-1">Recommended Daily Calories</p>
                    </div>
                    {bmi && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-gray-600">BMI Score: <span className="font-semibold text-gray-900">{bmi}</span></p>
                          <p className="text-sm text-gray-500 mt-1">Category: <span className={`font-medium ${
                            bmiCategory === 'Normal' ? 'text-green-600' :
                            bmiCategory === 'Underweight' ? 'text-blue-600' :
                            bmiCategory === 'Overweight' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>{bmiCategory}</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Exercise Calculator */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#FFB404] to-[#FFD004] px-6 py-4">
                <div className="flex items-center">
                  <FaRunning className="h-6 w-6 text-white" />
                  <h2 className="ml-3 text-xl font-bold text-white">Exercise Calorie Calculator</h2>
                </div>
                <p className="mt-1 text-sm text-white opacity-90">Calculate calories burned during different exercises</p>
              </div>

              <div className="p-6">
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="w-full mb-6 bg-gradient-to-r from-[#FFB404] to-[#FFD004] text-white py-3 rounded-lg font-semibold shadow-lg hover:from-[#FFA404] hover:to-[#FFC004] transition-all duration-300 flex items-center justify-center"
                >
                  <FaChartLine className="mr-2" />
                  {showTable ? 'Hide Calorie Burn Rates' : 'Show Calorie Burn Rates'}
                </button>

                {showTable && (
                  <div className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Exercise Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Calories/Hour
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sortedExerciseEntries.map(([name, rate]) => (
                            <tr key={name} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                {name.replace(/([A-Z])/g, ' $1')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(rate * 60).toFixed(0)} kcal
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <form onSubmit={exerciseFormik.handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Exercise</label>
                    <select
                      name="exercise"
                      onChange={exerciseFormik.handleChange}
                      value={exerciseFormik.values.exercise}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB404] focus:border-transparent"
                    >
                      {sortedExerciseEntries.map(([exercise]) => (
                        <option key={exercise} value={exercise}>
                          {exercise.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + exercise.replace(/([A-Z])/g, ' $1').slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      placeholder="Enter exercise duration"
                      onChange={exerciseFormik.handleChange}
                      value={exerciseFormik.values.duration}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB404] focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FFB404] to-[#FFD004] text-white py-3 rounded-lg font-semibold shadow-lg hover:from-[#FFA404] hover:to-[#FFC004] transition-all duration-300"
                  >
                    Calculate Calories Burned
                  </button>
                </form>

                {burnedCalories && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#FFB404]">
                        {burnedCalories} kcal
                      </h3>
                      <p className="text-gray-600 mt-1">Calories Burned</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}