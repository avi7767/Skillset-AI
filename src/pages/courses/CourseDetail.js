import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        } else {
          setCourse(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="instructor">By {course.instructorName}</span>
          <span className="duration">{course.duration}</span>
          <span className="level">{course.grade}</span>
        </div>
      </div>

      <div className="course-content">
        <h2>Course Content</h2>
        <div className="modules">
          {course.modules?.map((module, index) => (
            <div key={index} className="module">
              <h3>{module.title}</h3>
              <ul>
                {module.lessons?.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <span className="lesson-title">{lesson.title}</span>
                    <span className="lesson-duration">{lesson.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="course-features">
        <h2>What You'll Learn</h2>
        <ul>
          {course.learningObjectives?.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="course-requirements">
        <h2>Requirements</h2>
        <ul>
          {course.requirements?.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>

      <div className="enroll-section">
        <button className="enroll-button">Enroll Now</button>
        <div className="price">${course.price || 0}</div>
      </div>
    </div>
  );
};

export default CourseDetail;
