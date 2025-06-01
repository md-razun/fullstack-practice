const Profile = require('../models/Profile');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all profiles
// @route   GET /api/v1/profiles
// @access  Public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  const profiles = await Profile.find().populate('user', ['name', 'email']);

  res.status(200).json({
    success: true,
    count: profiles.length,
    data: profiles
  });
});

// @desc    Get single profile
// @route   GET /api/v1/profiles/:id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id).populate('user', [
    'name',
    'email'
  ]);

  if (!profile) {
    return next(
      new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Get current user's profile
// @route   GET /api/v1/profiles/me
// @access  Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
    'name',
    'email'
  ]);

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Create or update user profile
// @route   POST /api/v1/profiles
// @access  Private
exports.createProfile = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing profile
  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    // Update
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      data: profile
    });
  }

  // Create
  profile = await Profile.create(req.body);

  res.status(201).json({
    success: true,
    data: profile
  });
});

// @desc    Delete profile
// @route   DELETE /api/v1/profiles
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  await Profile.findOneAndRemove({ user: req.user.id });
  await User.findByIdAndRemove(req.user.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add profile experience
// @route   PUT /api/v1/profiles/experience
// @access  Private
exports.addExperience = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  profile.experience.unshift(req.body);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Delete experience from profile
// @route   DELETE /api/v1/profiles/experience/:exp_id
// @access  Private
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Get remove index
  const removeIndex = profile.experience
    .map(item => item.id)
    .indexOf(req.params.exp_id);

  if (removeIndex === -1) {
    return next(new ErrorResponse('Experience not found', 404));
  }

  profile.experience.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Add profile education
// @route   PUT /api/v1/profiles/education
// @access  Private
exports.addEducation = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  profile.education.unshift(req.body);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Delete education from profile
// @route   DELETE /api/v1/profiles/education/:edu_id
// @access  Private
exports.deleteEducation = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Get remove index
  const removeIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.edu_id);

  if (removeIndex === -1) {
    return next(new ErrorResponse('Education not found', 404));
  }

  profile.education.splice(removeIndex, 1);

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile
  });
});
