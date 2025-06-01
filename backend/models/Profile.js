const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  social: {
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    },
    github: {
      type: String
    }
  },
  experience: [
    {
      title: {
        type: String,
        required: [true, 'Please add a title']
      },
      company: {
        type: String,
        required: [true, 'Please add a company']
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: [true, 'Please add a start date']
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: [true, 'Please add a school']
      },
      degree: {
        type: String,
        required: [true, 'Please add a degree']
      },
      fieldOfStudy: {
        type: String,
        required: [true, 'Please add a field of study']
      },
      from: {
        type: Date,
        required: [true, 'Please add a start date']
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
