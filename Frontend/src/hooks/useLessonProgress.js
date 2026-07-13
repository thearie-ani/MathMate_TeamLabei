import { useState, useEffect } from 'react';

/**
 * Hook to manage user progress through a long lesson with multiple sections.
 * Tracks which sections have been viewed.
 */
export function useLessonProgress(sectionIds = []) {
  const [completedSections, setCompletedSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);

  const markSectionComplete = (sectionId) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(sectionId);
      markSectionComplete(sectionId);
    }
  };

  // Calculate overall progress percentage
  const progressPercentage = sectionIds.length === 0 
    ? 0 
    : Math.round((completedSections.length / sectionIds.length) * 100);

  return {
    completedSections,
    currentSection,
    progressPercentage,
    markSectionComplete,
    scrollToSection,
    setCurrentSection // For manual updates (e.g., via IntersectionObserver)
  };
}
