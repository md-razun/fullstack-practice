import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    skills: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    github: ''
  });

  const {
    bio,
    location,
    website,
    skills,
    twitter,
    facebook,
    linkedin,
    instagram,
    github
  } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);

  useEffect(() => {
    // If there is a profile, fill the form with its data
    if (profile) {
      const profileData = { ...formData };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      if (profile.social) {
        for (const key in profile.social) {
          if (key in profileData) profileData[key] = profile.social[key];
        }
      }
      if (profile.skills) {
        profileData.skills = profile.skills.join(', ');
      }
      setFormData(profileData);
    }
  }, [profile]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    const profileData = {
      ...formData,
      skills: skills.split(',').map(skill => skill.trim())
    };

    // Here you would dispatch an action to create/update profile
    // dispatch(createProfile(profileData, navigate));
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={onChange}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={onChange}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={onChange}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>

        <div className="my-2">
          <button type="button" className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        <div className="form-group social-input">
          <i className="fab fa-twitter fa-2x"></i>
          <input
            type="text"
            placeholder="Twitter URL"
            name="twitter"
            value={twitter}
            onChange={onChange}
          />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-facebook fa-2x"></i>
          <input
            type="text"
            placeholder="Facebook URL"
            name="facebook"
            value={facebook}
            onChange={onChange}
          />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-linkedin fa-2x"></i>
          <input
            type="text"
            placeholder="Linkedin URL"
            name="linkedin"
            value={linkedin}
            onChange={onChange}
          />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-instagram fa-2x"></i>
          <input
            type="text"
            placeholder="Instagram URL"
            name="instagram"
            value={instagram}
            onChange={onChange}
          />
        </div>

        <div className="form-group social-input">
          <i className="fab fa-github fa-2x"></i>
          <input
            type="text"
            placeholder="Github URL"
            name="github"
            value={github}
            onChange={onChange}
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </section>
  );
};

export default ProfileForm;
