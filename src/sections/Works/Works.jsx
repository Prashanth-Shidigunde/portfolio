import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import './Works.css';

export function Works() {
  const { categories, activeCategory, setActiveCategory, filteredProjects } = useProjects();

  return (
    <section id="work" className="projects-section">
      <div className="projects-header reveal-on-scroll">
        <div className="section-pill-badge">
          <span className="badge-dot"></span>
          <span>PORTFOLIO &amp; SHOWCASE</span>
        </div>
        <h2 className="section-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
          SELECTED CREATIVE WORK
        </h2>
        <p className="section-subtext">
          Browse through project concepts across video editing, photography, shooting, web development and visual design.
        </p>
        <div className="filter-track">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

