const express = require('express');
const {
  getProfiles,
  getProfile,
  getMyProfile,
  createProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation
} = require('../controllers/profiles');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(getProfiles).post(protect, createProfile);

router.route('/me').get(protect, getMyProfile);

router.route('/:id').get(getProfile);

router.route('/').delete(protect, deleteProfile);

router.route('/experience').put(protect, addExperience);

router.route('/experience/:exp_id').delete(protect, deleteExperience);

router.route('/education').put(protect, addEducation);

router.route('/education/:edu_id').delete(protect, deleteEducation);

module.exports = router;
