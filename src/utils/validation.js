const validateAlbum = (data) => {
  const errors = {};

  if (!data.title) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3 || data.title.length > 100) {
    errors.title = 'Title must be between 3 and 100 characters';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateAlbum
};