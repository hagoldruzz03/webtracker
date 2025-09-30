// Shared Data Management System with Event Broadcasting and localStorage
const STORAGE_KEY = 'slsu_alumni_data';
let alumniDatabase = [];
const dataListeners = [];

// Event system for data changes
function notifyDataChange() {
    dataListeners.forEach(listener => listener());
}

function subscribeToDataChanges(callback) {
    dataListeners.push(callback);
}

// Save to localStorage
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alumniDatabase));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load from localStorage
function loadFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            alumniDatabase = JSON.parse(stored);
            return true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return false;
}

// Get sample data
function getSampleData() {
    return [
        {
            id: 1,
            name: "Juan Dela Cruz",
            batch: 2007,
            age: 39,
            iieePosition: "Member",
            email: "juan.delacruz@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Junior Electrical Engineer",
                    company: "ABC Power Corporation",
                    location: "Local",
                    year: "2007-2010",
                    achievements: "Implemented energy-saving solutions reducing costs by 15%"
                }
            ],
            currentWork: {
                position: "Senior Electrical Engineer",
                company: "National Grid Corporation",
                location: "Local",
                year: "2010-Present",
                achievements: "Led major infrastructure projects worth PHP 50M"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2008 }
            ]
        },
        {
            id: 2,
            name: "Maria Santos",
            batch: 2010,
            age: 36,
            iieePosition: "Secretary",
            email: "maria.santos@email.com",
            employmentStatus: "Self-Employed",
            pastJobs: [
                {
                    position: "Electrical Design Engineer",
                    company: "XYZ Engineering Consultancy",
                    location: "Local",
                    year: "2010-2015",
                    achievements: "Designed electrical systems for 20+ commercial buildings"
                }
            ],
            currentWork: null,
            business: {
                name: "Santos Electrical Solutions",
                type: "Electrical Contracting",
                description: "Provides electrical design and installation services",
                location: "Lucban, Quezon"
            },
            licenses: [
                { type: "REE", year: 2011 },
                { type: "PEE", year: 2016 }
            ]
        },
        {
            id: 3,
            name: "Pedro Reyes",
            batch: 2015,
            age: 31,
            iieePosition: "Member",
            email: "pedro.reyes@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Power Systems Engineer",
                company: "Meralco",
                location: "Local",
                year: "2015-Present",
                achievements: "Optimized distribution network efficiency by 20%"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2016 }
            ]
        },
        {
            id: 4,
            name: "Ana Gonzales",
            batch: 2018,
            age: 28,
            iieePosition: "Vice President",
            email: "ana.gonzales@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Automation Engineer",
                company: "Samsung Electronics Philippines",
                location: "South Korea",
                year: "2019-Present",
                achievements: "Developed automation systems for semiconductor manufacturing"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2019 }
            ]
        },
        {
            id: 5,
            name: "Carlos Mendoza",
            batch: 2020,
            age: 26,
            iieePosition: "Member",
            email: "carlos.mendoza@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Project Engineer",
                company: "First Balfour Inc.",
                location: "Local",
                year: "2020-Present",
                achievements: "Managed electrical installations for high-rise buildings"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2021 }
            ]
        },
        {
            id: 6,
            name: "Isabella Cruz",
            batch: 2024,
            age: 23,
            iieePosition: "Member",
            email: "isabella.cruz@email.com",
            employmentStatus: "Job Seeking",
            pastJobs: [],
            currentWork: null,
            business: null,
            licenses: []
        },
        {
            id: 7,
            name: "Roberto Lim",
            batch: 2012,
            age: 34,
            iieePosition: "Treasurer",
            email: "roberto.lim@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "Manila Electric Company",
                    location: "Local",
                    year: "2012-2017",
                    achievements: "Maintained distribution systems across Metro Manila"
                }
            ],
            currentWork: {
                position: "Senior Electrical Consultant",
                company: "Power Engineering Solutions Inc.",
                location: "Local",
                year: "2017-Present",
                achievements: "Consulted on 50+ electrical projects nationwide"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2013 },
                { type: "PEE", year: 2018 }
            ]
        },
        {
            id: 8,
            name: "Sofia Ramirez",
            batch: 2016,
            age: 30,
            iieePosition: "Member",
            email: "sofia.ramirez@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Control Systems Engineer",
                company: "Siemens Philippines",
                location: "Germany",
                year: "2017-Present",
                achievements: "Designed automation systems for manufacturing plants"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2017 }
            ]
        },
        {
            id: 9,
            name: "Michael Torres",
            batch: 2008,
            age: 38,
            iieePosition: "President",
            email: "michael.torres@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "Lopez Group",
                    location: "Local",
                    year: "2008-2013",
                    achievements: "Developed renewable energy projects in Mindanao"
                },
                {
                    position: "Senior Engineer",
                    company: "Energy Development Corporation",
                    location: "Local",
                    year: "2013-2018",
                    achievements: "Led geothermal power plant maintenance programs"
                }
            ],
            currentWork: {
                position: "Engineering Manager",
                company: "Aboitiz Power Corporation",
                location: "Local",
                year: "2018-Present",
                achievements: "Managed engineering teams across 5 power generation facilities"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2009 },
                { type: "PEE", year: 2014 }
            ]
        },
        {
            id: 10,
            name: "Francesca Aguirre",
            batch: 2019,
            age: 27,
            iieePosition: "Member",
            email: "francesca.aguirre@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Telecommunications Engineer",
                company: "Globe Telecom",
                location: "Local",
                year: "2019-Present",
                achievements: "Deployed 5G infrastructure across Metro Manila"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2020 }
            ]
        },
        {
            id: 11,
            name: "Benjamin Chua",
            batch: 2011,
            age: 35,
            iieePosition: "Auditor",
            email: "benjamin.chua@email.com",
            employmentStatus: "Self-Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "DMCI Power Corporation",
                    location: "Local",
                    year: "2011-2016",
                    achievements: "Commissioned coal-fired power plants"
                }
            ],
            currentWork: null,
            business: {
                name: "Chua Engineering Services",
                type: "Engineering Consultancy",
                description: "Specializes in power plant design and energy audits",
                location: "Makati City"
            },
            licenses: [
                { type: "REE", year: 2012 },
                { type: "PEE", year: 2017 }
            ]
        },
        {
            id: 12,
            name: "Elena Navarro",
            batch: 2014,
            age: 32,
            iieePosition: "Member",
            email: "elena.navarro@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Design Engineer",
                    company: "Fluor Daniel Philippines",
                    location: "Local",
                    year: "2014-2017",
                    achievements: "Created electrical layouts for industrial facilities"
                }
            ],
            currentWork: {
                position: "Electrical Project Manager",
                company: "Bechtel Corporation",
                location: "Singapore",
                year: "2017-Present",
                achievements: "Managed electrical scope for LNG terminal projects"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2015 },
                { type: "PEE", year: 2020 }
            ]
        },
        {
            id: 13,
            name: "Gabriel Fernandez",
            batch: 2022,
            age: 24,
            iieePosition: "Member",
            email: "gabriel.fernandez@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Associate Electrical Engineer",
                company: "Ayala Land Inc.",
                location: "Local",
                year: "2022-Present",
                achievements: "Designed electrical systems for residential developments"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2023 }
            ]
        },
        {
            id: 14,
            name: "Patricia Villar",
            batch: 2009,
            age: 37,
            iieePosition: "Member",
            email: "patricia.villar@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "San Miguel Corporation",
                    location: "Local",
                    year: "2009-2014",
                    achievements: "Maintained electrical systems for manufacturing plants"
                }
            ],
            currentWork: {
                position: "Facilities Engineering Manager",
                company: "SM Prime Holdings",
                location: "Local",
                year: "2014-Present",
                achievements: "Oversees electrical operations for 30+ shopping malls"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2010 },
                { type: "PEE", year: 2015 }
            ]
        },
        {
            id: 15,
            name: "Rafael Santiago",
            batch: 2017,
            age: 29,
            iieePosition: "PRO",
            email: "rafael.santiago@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Renewable Energy Engineer",
                company: "Solar Philippines",
                location: "Local",
                year: "2017-Present",
                achievements: "Developed 100MW solar farm projects in Luzon"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2018 }
            ]
        },
        {
            id: 16,
            name: "Carmen Valdez",
            batch: 2013,
            age: 33,
            iieePosition: "Member",
            email: "carmen.valdez@email.com",
            employmentStatus: "Self-Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "Philippine National Railways",
                    location: "Local",
                    year: "2013-2019",
                    achievements: "Maintained railway signaling and power systems"
                }
            ],
            currentWork: null,
            business: {
                name: "Valdez Electrical & Electronics",
                type: "Retail & Services",
                description: "Sales of electrical supplies and troubleshooting services",
                location: "Quezon City"
            },
            licenses: [
                { type: "REE", year: 2014 }
            ]
        },
        {
            id: 17,
            name: "Diego Morales",
            batch: 2021,
            age: 25,
            iieePosition: "Member",
            email: "diego.morales@email.com",
            employmentStatus: "Employed",
            pastJobs: [],
            currentWork: {
                position: "Electrical Design Engineer",
                company: "Monolith Construction & Development Corp.",
                location: "Local",
                year: "2021-Present",
                achievements: "Designed electrical plans for BPO and office buildings"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2022 }
            ]
        },
        {
            id: 18,
            name: "Natalia Pascual",
            batch: 2023,
            age: 23,
            iieePosition: "Member",
            email: "natalia.pascual@email.com",
            employmentStatus: "Job Seeking",
            pastJobs: [],
            currentWork: null,
            business: null,
            licenses: []
        },
        {
            id: 19,
            name: "Antonio Rivera",
            batch: 2006,
            age: 40,
            iieePosition: "Member",
            email: "antonio.rivera@email.com",
            employmentStatus: "Employed",
            pastJobs: [
                {
                    position: "Electrical Engineer",
                    company: "Philippine Long Distance Telephone Company",
                    location: "Local",
                    year: "2006-2010",
                    achievements: "Installed and maintained telecommunications infrastructure"
                },
                {
                    position: "Senior Electrical Engineer",
                    company: "Petron Corporation",
                    location: "Local",
                    year: "2010-2015",
                    achievements: "Managed electrical systems for oil refinery operations"
                },
                {
                    position: "Principal Engineer",
                    company: "Manila Water Company",
                    location: "Local",
                    year: "2015-2020",
                    achievements: "Optimized pump stations and water treatment facility systems"
                }
            ],
            currentWork: {
                position: "Chief Electrical Engineer",
                company: "Metro Pacific Investments Corporation",
                location: "Local",
                year: "2020-Present",
                achievements: "Oversees electrical engineering across multiple infrastructure subsidiaries"
            },
            business: null,
            licenses: [
                { type: "REE", year: 2007 },
                { type: "PEE", year: 2012 }
            ]
        }
    ];
}

// Initialize data - load from storage or use sample data
function initializeData() {
    if (!loadFromStorage()) {
        alumniDatabase = getSampleData();
        saveToStorage(); // Save initial data
    }
}

// Data API
const DataAPI = {
    // Get all alumni
    getAllAlumni: function() {
        return [...alumniDatabase];
    },

    // Get alumni by ID
    getAlumniById: function(id) {
        return alumniDatabase.find(a => a.id === id);
    },

    // Get alumni by batch
    getAlumniByBatch: function(batch) {
        return alumniDatabase.filter(a => a.batch === batch);
    },

    // Add new alumni
    addAlumni: function(alumniData) {
        const newAlumni = {
            ...alumniData,
            id: Date.now(),
            pastJobs: alumniData.pastJobs || [],
            licenses: alumniData.licenses || []
        };
        alumniDatabase.push(newAlumni);
        saveToStorage(); // Save after adding
        notifyDataChange();
        return newAlumni;
    },

    // Update alumni
    updateAlumni: function(id, updatedData) {
        const index = alumniDatabase.findIndex(a => a.id === id);
        if (index !== -1) {
            alumniDatabase[index] = { ...alumniDatabase[index], ...updatedData };
            saveToStorage(); // Save after updating
            notifyDataChange();
            return alumniDatabase[index];
        }
        return null;
    },

    // Delete alumni
    deleteAlumni: function(id) {
        const index = alumniDatabase.findIndex(a => a.id === id);
        if (index !== -1) {
            alumniDatabase.splice(index, 1);
            saveToStorage(); // Save after deleting
            notifyDataChange();
            return true;
        }
        return false;
    },

    // Get statistics
    getStatistics: function() {
        const total = alumniDatabase.length;
        const employed = alumniDatabase.filter(a => 
            a.employmentStatus === 'Employed' || a.employmentStatus === 'Self-Employed'
        ).length;
        const licensed = alumniDatabase.filter(a => a.licenses.length > 0).length;
        const batches = [...new Set(alumniDatabase.map(a => a.batch))].length;

        return { total, employed, licensed, batches };
    },

    // Get batch distribution
    getBatchDistribution: function() {
        const distribution = {};
        alumniDatabase.forEach(alumni => {
            distribution[alumni.batch] = (distribution[alumni.batch] || 0) + 1;
        });
        return distribution;
    },

    // Get employment status distribution
    getEmploymentDistribution: function() {
        const distribution = {};
        alumniDatabase.forEach(alumni => {
            distribution[alumni.employmentStatus] = (distribution[alumni.employmentStatus] || 0) + 1;
        });
        return distribution;
    },

    // Search alumni
    searchAlumni: function(query) {
        const lowerQuery = query.toLowerCase();
        return alumniDatabase.filter(alumni => 
            alumni.name.toLowerCase().includes(lowerQuery) ||
            alumni.email.toLowerCase().includes(lowerQuery) ||
            (alumni.currentWork?.company || '').toLowerCase().includes(lowerQuery) ||
            (alumni.business?.name || '').toLowerCase().includes(lowerQuery)
        );
    },

    // Filter alumni
    filterAlumni: function(filters) {
        let filtered = [...alumniDatabase];

        if (filters.batch) {
            filtered = filtered.filter(a => a.batch === parseInt(filters.batch));
        }

        if (filters.employmentStatus) {
            filtered = filtered.filter(a => a.employmentStatus === filters.employmentStatus);
        }

        if (filters.hasLicense) {
            filtered = filtered.filter(a => a.licenses.length > 0);
        }

        return filtered;
    },

    // Subscribe to data changes
    subscribe: subscribeToDataChanges,
    
    // Reset to sample data (for testing)
    resetToSampleData: function() {
        alumniDatabase = getSampleData();
        saveToStorage();
        notifyDataChange();
    }
};

// Initialize data on load
initializeData();

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.DataAPI = DataAPI;
    window.alumniDatabase = alumniDatabase;
}