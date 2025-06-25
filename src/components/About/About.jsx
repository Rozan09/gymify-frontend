import React, { useState } from 'react'
import { FaDumbbell, FaHeartbeat, FaUsers, FaMedal, FaStopwatch, FaCheckCircle, FaRunning, FaBolt } from 'react-icons/fa'

export default function About() {
  const [activeTab, setActiveTab] = useState('philosophy')

  const milestones = [
    { year: '2018', achievement: 'Grand Opening', description: 'Started with state-of-the-art equipment and certified trainers' },
    { year: '2019', achievement: 'Community Recognition', description: 'Voted "Best Gym in the City" by Local Fitness Magazine' },
    { year: '2020', achievement: 'Virtual Training Launch', description: 'Introduced online classes and personal training sessions' },
    { year: '2021', achievement: 'Expansion', description: 'Added specialized CrossFit and yoga studios' },
    { year: '2022', achievement: 'Elite Training Center', description: 'Launched professional athlete training programs' },
    { year: '2023', achievement: 'Wellness Integration', description: 'Introduced nutrition counseling and recovery services' }
  ]

  const trainers = [
    {
      name: 'Mike Thompson',
      role: 'Head Trainer & CrossFit Expert',
      bio: 'Former Olympic athlete with 12 years of elite training experience.',
      expertise: ['CrossFit Level 3', 'Olympic Lifting', 'Strength & Conditioning']
    },
    {
      name: 'Sarah Chen',
      role: 'Nutrition & Wellness Coach',
      bio: 'Certified nutritionist and wellness expert helping members achieve their health goals.',
      expertise: ['Sports Nutrition', 'Meal Planning', 'Weight Management']
    },
    {
      name: 'David Rodriguez',
      role: 'Fitness Programming Director',
      bio: 'Specialist in functional training and rehabilitation programs.',
      expertise: ['Functional Training', 'Injury Prevention', 'Group Fitness']
    },
    {
      name: 'Emma Wilson',
      role: 'Yoga & Mindfulness Coach',
      bio: 'Bringing balance to high-intensity training with mindful movement practices.',
      expertise: ['Power Yoga', 'Meditation', 'Flexibility Training']
    }
  ]

  const stats = [
    { number: '5000+', label: 'Active Members', icon: <FaUsers /> },
    { number: '50+', label: 'Weekly Classes', icon: <FaStopwatch /> },
    { number: '25+', label: 'Expert Trainers', icon: <FaDumbbell /> },
    { number: '98%', label: 'Success Rate', icon: <FaMedal /> }
  ]

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Welcome to gymify</h1>
        <p className="subtitle">Transform Your Life Through Fitness Excellence</p>
      </div>

      <section className="company-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <h3>{stat.number}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="about-tabs">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'philosophy' ? 'active' : ''} 
            onClick={() => setActiveTab('philosophy')}
          >
            Our Philosophy
          </button>
          <button 
            className={activeTab === 'approach' ? 'active' : ''} 
            onClick={() => setActiveTab('approach')}
          >
            Training Approach
          </button>
          <button 
            className={activeTab === 'facilities' ? 'active' : ''} 
            onClick={() => setActiveTab('facilities')}
          >
            Our Facilities
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'philosophy' && (
            <div>
              <h3>More Than Just a Gym</h3>
              <p>At PowerFit Elite, we believe fitness is a journey of personal transformation. Our philosophy centers on creating a supportive community where everyone – from beginners to elite athletes – can achieve their fitness goals.</p>
              <div className="vision-points">
                <div><FaHeartbeat /> Health First</div>
                <div><FaBolt /> Peak Performance</div>
                <div><FaCheckCircle /> Lasting Results</div>
              </div>
            </div>
          )}
          {activeTab === 'approach' && (
            <div>
              <h3>Scientific Training Methods</h3>
              <p>Our training approach combines cutting-edge exercise science with personalized attention:</p>
              <ul>
                <li>Customized workout programs based on your goals</li>
                <li>Regular progress tracking and program adjustment</li>
                <li>Integration of strength, cardio, and recovery</li>
                <li>Nutrition guidance and lifestyle coaching</li>
              </ul>
            </div>
          )}
          {activeTab === 'facilities' && (
            <div>
              <h3>State-of-the-Art Equipment</h3>
              <p>Our facility features everything you need for a complete fitness experience:</p>
              <ul>
                <li>Premium strength training equipment</li>
                <li>Dedicated CrossFit and functional training areas</li>
                <li>Specialized cardio zones with smart technology</li>
                <li>Yoga and group fitness studios</li>
                <li>Recovery and stretching areas</li>
                <li>Luxurious locker rooms and shower facilities</li>
              </ul>
            </div>
          )}
        </div>
      </section>






      <section className="join-section">
        <h2>Our Specialized Programs</h2>
                  <p>We offer a wide range of programs to meet your fitness goals:</p>

        <div className="programs-text">
           <ul>
              <li>Personal Training</li>
              <li>Group Fitness Classes</li>
              <li>CrossFit</li>
              <li>Strength & Conditioning</li>
              <li>Yoga & Flexibility</li>
              <li>Nutrition Coaching</li>
            </ul>
        </div>
      </section>
    </div>
  )
}