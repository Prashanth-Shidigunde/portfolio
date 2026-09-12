/**
 * Server Testimonial Controller
 */
const testimonialRepository = require('../repositories/testimonialRepository');
const { formatSuccessResponse } = require('../utils/helpers');

module.exports = {
  getAllTestimonials: async (req, res, next) => {
    try {
      const testimonials = await testimonialRepository.findAll();
      res.json(formatSuccessResponse(testimonials));
    } catch (err) {
      next(err);
    }
  }
};
