/**
 * Server Testimonial Repository
 */
const staticTestimonials = [
  { id: 1, num: "01", name: "Alex Rivera", role: "Founder, Apex Visuals", quote: "Pulse_Blend_Media completely transformed our brand assets. The video editing and motion graphics elevated our product launch to a whole new level.", rating: 5 },
  { id: 2, num: "02", name: "Samantha Chen", role: "Content Director, Lumina Media", quote: "The editing was sharp, fast, and incredibly creative. Communication was seamless, and every single revision request was handled with precision.", rating: 5 },
  { id: 3, num: "03", name: "David Kormendi", role: "E-Commerce Founder", quote: "From concept storyboard to final color grading, the visual storytelling was top tier. Our conversion rates increased significantly after publishing.", rating: 5 },
  { id: 4, num: "04", name: "Elena Rostova", role: "Brand Strategist, Vanguard Studio", quote: "Working with Pulse_Blend_Media was effortless. Their ability to catch brand nuances and translate them into stunning visual content is rare.", rating: 5 },
  { id: 5, num: "05", name: "Marcus Vance", role: "Creative Lead, NextGen Tech", quote: "Very thoughtful creative work with a strong sense of visual balance, pacing, and atmosphere. Delivered ahead of deadline with exceptional quality.", rating: 5 },
  { id: 6, num: "06", name: "Priya Sharma", role: "Marketing Director, Horizon Agency", quote: "Pulse_Blend_Media understood our direction quickly and delivered high-converting ad creatives that exceeded all our performance benchmarks.", rating: 5 }
];

module.exports = {
  findAll: async () => staticTestimonials
};
