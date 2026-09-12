import React from 'react';
import './ProjectCard.css';

export function ProjectCard({ project }) {
  const categoryIcon = {
    VIDEO: '🎥',
    PHOTO: '📸',
    SHOOTING: '🎬',
    WEBSITE: '💻',
    BRANDING: '🎨',
    DESIGN: '🎨',
    OTHER: '✨'
  }[project.category] || '🎬';

  return (
    <div className="project-card reveal-on-scroll" data-tilt>
      <div className="project-card-top">
        <span className="project-id">{project.id}</span>
        <span className="project-tag-pill">{project.tag}</span>
      </div>

      <div className="project-image-container">
        {project.image ? (
          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="project-image-placeholder">
            <span className="placeholder-pattern">{categoryIcon}</span>
            <span className="placeholder-text">STUDIO PREVIEW</span>
          </div>
        )}
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.description}</p>
      </div>

      <div className="project-card-footer">
        <span className="project-category-badge">{project.category}</span>
        <a href={project.link || '#'} className="project-arrow" aria-label={`View ${project.title}`}>
          ↗
        </a>
      </div>
    </div>
  );
}
