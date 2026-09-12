/**
 * Server Project Repository
 */
const staticProjects = [
  { id: "01", title: "Visual Story — 01", category: "VIDEO", description: "Creative video concept prepared for cinematic storytelling.", image: "/projects.png", tag: "VIDEO", link: "#" },
  { id: "02", title: "Visual Study — 02", category: "PHOTO", description: "Photography and image-editing concept with high-end color grading.", image: "/about.png", tag: "PHOTO", link: "#" },
  { id: "03", title: "Production Story — 03", category: "SHOOTING", description: "Indoor and outdoor production coverage for creative campaigns.", image: "/service.png", tag: "SHOOTING", link: "#" },
  { id: "04", title: "Digital Space — 04", category: "WEBSITE", description: "Modern, responsive, high-performance website design and digital experience.", image: "/projects.png", tag: "WEBSITE", link: "#" },
  { id: "05", title: "Brand Direction — 05", category: "BRANDING", description: "Comprehensive brand identity concept and visual style guide.", image: "/about.png", tag: "BRANDING", link: "#" },
  { id: "06", title: "Creative Frame — 06", category: "DESIGN", description: "Visual design exploration and digital artwork production.", image: "/service.png", tag: "DESIGN", link: "#" },
  { id: "07", title: "Motion Experiment — 07", category: "VIDEO", description: "Motion graphics and visual effects editing experiment.", image: "/projects.png", tag: "VIDEO", link: "#" },
  { id: "08", title: "Creative Concept — 08", category: "OTHER", description: "A flexible creative production concept for custom media projects.", image: "/service.png", tag: "OTHER", link: "#" }
];

module.exports = {
  findAll: async () => staticProjects,
  findByCategory: async (cat) => cat === 'ALL' ? staticProjects : staticProjects.filter(p => p.category.toUpperCase() === cat.toUpperCase())
};
