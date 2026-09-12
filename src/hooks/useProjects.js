import { useState, useEffect, useMemo } from 'react';
import projectService from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [projData, catData] = await Promise.all([
          projectService.getProjects(),
          projectService.getCategories()
        ]);
        if (isMounted) {
          setProjects(projData);
          setCategories(catData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load projects');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return projects;
    return projects.filter((p) => p.category.toUpperCase() === activeCategory.toUpperCase());
  }, [projects, activeCategory]);

  return {
    projects,
    categories,
    activeCategory,
    setActiveCategory,
    filteredProjects,
    loading,
    error
  };
}

export default useProjects;
