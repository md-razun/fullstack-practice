import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDisplay = ({ profile }) => {
  if (!profile) {
    return <div>Loading...</div>;
  }

  const {
    bio,
    location,
    website,
    skills,
    social,
    user,
    experience,
    education
  } = profile;

  return (
    <div className="profile-grid my-1">
      {/* Top */}
      <div className="profile-top bg-primary p-2">
        <h1 className="large">{user?.name}</h1>
        <p className="lead">{location && <span>{location}</span>}</p>
        <p>{bio && <span>{bio}</span>}</p>
        <div className="icons my-1">
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x"></i>
            </a>
          )}
          {social && social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
          )}
          {social && social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </a>
          )}
          {social && social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
          )}
          {social && social.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
          )}
          {social && social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github fa-2x"></i>
            </a>
          )}
        </div>
      </div>

      {/* About */}
      <div className="profile-about bg-light p-2">
        <h2 className="text-primary">Skills</h2>
        <div className="skills">
          {skills.map((skill, index) => (
            <div key={index} className="p-1">
              <i className="fas fa-check"></i> {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="profile-exp bg-white p-2">
        <h2 className="text-primary">Experience</h2>
        {experience && experience.length > 0 ? (
          experience.map((exp, index) => (
            <div key={index}>
              <h3>{exp.company}</h3>
              <p>
                {new Date(exp.from).toLocaleDateString()} -{' '}
                {exp.to ? new Date(exp.to).toLocaleDateString() : 'Now'}
              </p>
              <p>
                <strong>Position: </strong> {exp.title}
              </p>
              <p>
                <strong>Description: </strong> {exp.description}
              </p>
            </div>
          ))
        ) : (
          <p>No experience credentials</p>
        )}
      </div>

      {/* Education */}
      <div className="profile-edu bg-white p-2">
        <h2 className="text-primary">Education</h2>
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index}>
              <h3>{edu.school}</h3>
              <p>
                {new Date(edu.from).toLocaleDateString()} -{' '}
                {edu.to ? new Date(edu.to).toLocaleDateString() : 'Now'}
              </p>
              <p>
                <strong>Degree: </strong> {edu.degree}
              </p>
              <p>
                <strong>Field Of Study: </strong> {edu.fieldOfStudy}
              </p>
              <p>
                <strong>Description: </strong> {edu.description}
              </p>
            </div>
          ))
        ) : (
          <p>No education credentials</p>
        )}
      </div>

      <div className="profile-buttons my-2">
        <Link to="/dashboard" className="btn btn-light">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProfileDisplay;
