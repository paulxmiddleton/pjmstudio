// portfolio-data.js - Comprehensive Project Data Structure
// Backend foundation for future navigation implementation

export const portfolioData = {
    categories: {
        directing: {
            id: 'directing',
            title: 'Directing',
            slug: 'directing',
            description: 'Visual storytelling through direction and creative vision',
            projects: [
                {
                    id: 'feature-film-1',
                    title: 'Feature Film Project',
                    slug: 'feature-film-project',
                    description: 'Narrative feature exploring human connections through visual poetry',
                    year: '2024',
                    type: 'Feature Film',
                    tags: ['narrative', 'drama', 'feature'],
                    coverImage: '/src/assets/images/projects/directing/feature-film-1.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'commercial-series',
                    title: 'Commercial Series',
                    slug: 'commercial-series',
                    description: 'High-end commercial work focusing on brand storytelling',
                    year: '2024',
                    type: 'Commercial',
                    tags: ['commercial', 'brand', 'series'],
                    coverImage: '/src/assets/images/projects/directing/commercial-series.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'music-video-collection',
                    title: 'Music Video Collection',
                    slug: 'music-video-collection',
                    description: 'Creative music videos blending performance with artistic vision',
                    year: '2023-2024',
                    type: 'Music Video',
                    tags: ['music-video', 'performance', 'creative'],
                    coverImage: '/src/assets/images/projects/directing/music-videos.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'documentary-work',
                    title: 'Documentary Work',
                    slug: 'documentary-work',
                    description: 'Truth-focused documentary storytelling with cinematic approach',
                    year: '2023',
                    type: 'Documentary',
                    tags: ['documentary', 'truth', 'cinematic'],
                    coverImage: '/src/assets/images/projects/directing/documentary.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'short-film-collection',
                    title: 'Short Film Collection',
                    slug: 'short-film-collection',
                    description: 'Experimental short films exploring visual narrative techniques',
                    year: '2022-2024',
                    type: 'Short Film',
                    tags: ['short-film', 'experimental', 'narrative'],
                    coverImage: '/src/assets/images/projects/directing/short-films.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'experimental-work',
                    title: 'Experimental Work',
                    slug: 'experimental-work',
                    description: 'Boundary-pushing experimental visual content',
                    year: '2023',
                    type: 'Experimental',
                    tags: ['experimental', 'avant-garde', 'visual'],
                    coverImage: '/src/assets/images/projects/directing/experimental.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                }
            ]
        },
        
        'video-editing': {
            id: 'video-editing',
            title: 'Video Editing',
            slug: 'video-editing',
            description: 'Precision editing and post-production excellence',
            projects: [
                {
                    id: 'narrative-editing',
                    title: 'Narrative Editing',
                    slug: 'narrative-editing',
                    description: 'Story-driven editing for films and series',
                    year: '2024',
                    type: 'Narrative',
                    tags: ['narrative', 'story', 'feature'],
                    coverImage: '/src/assets/images/projects/video-editing/narrative.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'commercial-editing',
                    title: 'Commercial Editing',
                    slug: 'commercial-editing',
                    description: 'Fast-paced commercial and advertising content',
                    year: '2024',
                    type: 'Commercial',
                    tags: ['commercial', 'advertising', 'fast-paced'],
                    coverImage: '/src/assets/images/projects/video-editing/commercial.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'music-video-editing',
                    title: 'Music Video Editing',
                    slug: 'music-video-editing',
                    description: 'Rhythmic editing synchronized with musical elements',
                    year: '2023-2024',
                    type: 'Music Video',
                    tags: ['music-video', 'rhythm', 'sync'],
                    coverImage: '/src/assets/images/projects/video-editing/music-video.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'documentary-editing',
                    title: 'Documentary Editing',
                    slug: 'documentary-editing',
                    description: 'Truth-driven documentary post-production',
                    year: '2023',
                    type: 'Documentary',
                    tags: ['documentary', 'truth', 'story'],
                    coverImage: '/src/assets/images/projects/video-editing/documentary.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                }
            ]
        },
        
        videography: {
            id: 'videography',
            title: 'Videography',
            slug: 'videography',
            description: 'Cinematographic excellence in visual capture',
            projects: [
                {
                    id: 'cinematic-work',
                    title: 'Cinematic Work',
                    slug: 'cinematic-work',
                    description: 'Film-quality cinematography for various productions',
                    year: '2024',
                    type: 'Cinematic',
                    tags: ['cinematic', 'film-quality', 'production'],
                    coverImage: '/src/assets/images/projects/videography/cinematic.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'event-videography',
                    title: 'Event Videography',
                    slug: 'event-videography',
                    description: 'Professional event documentation and coverage',
                    year: '2023-2024',
                    type: 'Event',
                    tags: ['event', 'documentation', 'live'],
                    coverImage: '/src/assets/images/projects/videography/events.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'corporate-videography',
                    title: 'Corporate Videography',
                    slug: 'corporate-videography',
                    description: 'Professional corporate video content',
                    year: '2024',
                    type: 'Corporate',
                    tags: ['corporate', 'professional', 'business'],
                    coverImage: '/src/assets/images/projects/videography/corporate.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                }
            ]
        },
        
        photography: {
            id: 'photography',
            title: 'Photography',
            slug: 'photography',
            description: 'Visual storytelling through still imagery',
            projects: [
                {
                    id: 'portrait-photography',
                    title: 'Portrait Photography',
                    slug: 'portrait-photography',
                    description: 'Character-driven portrait work',
                    year: '2024',
                    type: 'Portrait',
                    tags: ['portrait', 'character', 'people'],
                    coverImage: '/src/assets/images/projects/photography/portraits.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'event-photography',
                    title: 'Event Photography',
                    slug: 'event-photography',
                    description: 'Moments captured with journalistic precision',
                    year: '2023-2024',
                    type: 'Event',
                    tags: ['event', 'journalistic', 'moments'],
                    coverImage: '/src/assets/images/projects/photography/events.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'commercial-photography',
                    title: 'Commercial Photography',
                    slug: 'commercial-photography',
                    description: 'Brand-focused commercial photography',
                    year: '2024',
                    type: 'Commercial',
                    tags: ['commercial', 'brand', 'product'],
                    coverImage: '/src/assets/images/projects/photography/commercial.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                }
            ]
        },
        
        'graphic-design': {
            id: 'graphic-design',
            title: 'Graphic Design',
            slug: 'graphic-design',
            description: 'Visual communication through design excellence',
            projects: [
                {
                    id: 'brand-identity',
                    title: 'Brand Identity',
                    slug: 'brand-identity',
                    description: 'Complete brand identity systems and guidelines',
                    year: '2024',
                    type: 'Brand Identity',
                    tags: ['brand', 'identity', 'system'],
                    coverImage: '/src/assets/images/projects/graphic-design/branding.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'print-design',
                    title: 'Print Design',
                    slug: 'print-design',
                    description: 'Editorial and print design solutions',
                    year: '2023-2024',
                    type: 'Print',
                    tags: ['print', 'editorial', 'layout'],
                    coverImage: '/src/assets/images/projects/graphic-design/print.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                },
                {
                    id: 'digital-design',
                    title: 'Digital Design',
                    slug: 'digital-design',
                    description: 'Web and digital interface design',
                    year: '2024',
                    type: 'Digital',
                    tags: ['digital', 'web', 'interface'],
                    coverImage: '/src/assets/images/projects/graphic-design/digital.jpg',
                    assets: {
                        gallery: [],
                        video: null
                    }
                }
            ]
        }
    }
};

// Utility Functions for Future Navigation Implementation

export function getProjectBySlug(categorySlug, projectSlug) {
    const category = portfolioData.categories[categorySlug];
    if (!category) return null;
    
    return category.projects.find(project => project.slug === projectSlug) || null;
}

export function getProjectsByCategory(categorySlug) {
    const category = portfolioData.categories[categorySlug];
    return category ? category.projects : [];
}

export function getAdjacentProjects(categorySlug, currentProjectSlug) {
    const projects = getProjectsByCategory(categorySlug);
    const currentIndex = projects.findIndex(project => project.slug === currentProjectSlug);
    
    if (currentIndex === -1) return { prev: null, next: null };
    
    return {
        prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
        next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
    };
}

export function getAllCategories() {
    return Object.values(portfolioData.categories);
}

export function getCategoryBySlug(slug) {
    return portfolioData.categories[slug] || null;
}

export function getProjectById(projectId) {
    for (const category of Object.values(portfolioData.categories)) {
        const project = category.projects.find(p => p.id === projectId);
        if (project) return project;
    }
    return null;
}

export function getFeaturedProjects(limit = 6) {
    const allProjects = [];
    
    Object.values(portfolioData.categories).forEach(category => {
        allProjects.push(...category.projects);
    });
    
    // Sort by year (descending) and take the most recent
    return allProjects
        .sort((a, b) => {
            const yearA = parseInt(a.year.split('-')[0]);
            const yearB = parseInt(b.year.split('-')[0]);
            return yearB - yearA;
        })
        .slice(0, limit);
}

export function searchProjects(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    Object.values(portfolioData.categories).forEach(category => {
        category.projects.forEach(project => {
            if (
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            ) {
                results.push({
                    ...project,
                    category: category
                });
            }
        });
    });
    
    return results;
}

// Export data structure for external access
export default portfolioData;