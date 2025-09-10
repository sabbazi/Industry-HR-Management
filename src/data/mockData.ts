import { faker } from '@faker-js/faker';
import { Employee, LeaveRequest, TrainingProgram, PerformanceReview, AttendanceRecord, PayrollRecord, JobPosting, Candidate, InsurancePolicy, WorkAccident, WorkCertificate } from '../types';

const departments = [
  'engineering', 'manufacturing', 'quality', 'maintenance', 
  'safety', 'logistics', 'finance', 'hr', 'it', 'management'
];

const positions = {
  engineering: ['Senior Engineer', 'Design Engineer', 'Process Engineer', 'Project Engineer'],
  manufacturing: ['Production Manager', 'Line Supervisor', 'Machine Operator', 'Quality Inspector'],
  quality: ['QA Manager', 'Quality Inspector', 'Test Engineer', 'Compliance Officer'],
  maintenance: ['Maintenance Manager', 'Technician', 'Electrician', 'Mechanic'],
  safety: ['Safety Manager', 'Safety Inspector', 'HSE Coordinator', 'Safety Officer'],
  logistics: ['Logistics Manager', 'Warehouse Supervisor', 'Inventory Specialist', 'Dispatcher'],
  finance: ['Finance Manager', 'Accountant', 'Financial Analyst', 'Payroll Specialist'],
  hr: ['HR Manager', 'HR Specialist', 'Recruiter', 'Training Coordinator'],
  it: ['IT Manager', 'System Administrator', 'Developer', 'Help Desk Technician'],
  management: ['Plant Manager', 'Operations Director', 'General Manager', 'Department Head']
};

export const generateMockEmployees = (count: number = 50): Employee[] => {
  return Array.from({ length: count }, () => {
    const department = faker.helpers.arrayElement(departments);
    const position = faker.helpers.arrayElement(positions[department as keyof typeof positions]);
    const gender = faker.helpers.arrayElement(['male', 'female'] as const);
    
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(gender),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      department,
      position,
      hireDate: faker.date.past({ years: 10 }).toISOString().split('T')[0],
      salary: parseInt(faker.finance.amount({ min: 30000, max: 120000, dec: 0 })),
      status: faker.helpers.arrayElement(['active', 'inactive', 'on-leave'] as const),
      avatar: faker.image.avatar(),
      address: faker.location.streetAddress(),
      emergencyContact: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        relationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
      },
      skills: faker.helpers.arrayElements([
        'Leadership', 'Problem Solving', 'Communication', 'Technical Skills',
        'Project Management', 'Quality Control', 'Safety Protocols', 'Equipment Operation'
      ], { min: 2, max: 5 }),
      certifications: faker.helpers.arrayElements([
        'ISO 9001', 'Six Sigma', 'PMP', 'OSHA 30', 'Lean Manufacturing',
        'First Aid', 'Forklift Operation', 'Welding Certification'
      ], { min: 1, max: 3 }),
      gender,
      dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    };
  });
};

export const generateMockLeaveRequests = (employees: Employee[], count: number = 20): LeaveRequest[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 14 }));
    
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: faker.helpers.arrayElement(['annual', 'sick', 'personal', 'maternity', 'emergency'] as const),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reason: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected'] as const),
      approvedBy: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.7 }),
      createdAt: faker.date.recent().toISOString()
    };
  });
};

export const generateMockTrainingPrograms = (count: number = 15): TrainingProgram[] => {
  return Array.from({ length: count }, () => {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 30 }));
    
    return {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement([
        'Safety Training Workshop', 'Leadership Development', 'Technical Skills Enhancement',
        'Quality Management System', 'Lean Manufacturing Principles', 'Emergency Response Training',
        'Communication Skills', 'Project Management Fundamentals', 'Equipment Operation Training',
        'Health and Safety Protocols'
      ]),
      description: faker.lorem.paragraph(),
      instructor: faker.person.fullName(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      capacity: faker.number.int({ min: 10, max: 50 }),
      enrolled: faker.number.int({ min: 5, max: 45 }),
      category: faker.helpers.arrayElement(['Safety', 'Technical', 'Management', 'Compliance', 'Soft Skills']),
      status: faker.helpers.arrayElement(['upcoming', 'ongoing', 'completed'] as const)
    };
  });
};

export const generateMockAttendanceRecords = (employees: Employee[], count: number = 100): AttendanceRecord[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    const date = faker.date.recent({ days: 30 });
    const checkInTime = faker.date.between({
      from: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 0),
      to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30)
    });
    const checkOutTime = faker.date.between({
      from: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0),
      to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 19, 0)
    });
    const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: date.toISOString().split('T')[0],
      checkIn: checkInTime.toTimeString().slice(0, 5),
      checkOut: checkOutTime.toTimeString().slice(0, 5),
      totalHours: parseFloat(totalHours.toFixed(2)),
      status: faker.helpers.arrayElement(['present', 'late', 'half-day'] as const),
      location: faker.helpers.arrayElement(['Main Factory', 'Office Building', 'Warehouse', 'Remote'])
    };
  });
};

export const generateMockPayrollRecords = (employees: Employee[], count: number = 50): PayrollRecord[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    const baseSalary = employee.salary / 12;
    const overtime = faker.number.float({ min: 0, max: 2000, fractionDigits: 2 });
    const bonuses = faker.number.float({ min: 0, max: 1500, fractionDigits: 2 });
    const deductions = faker.number.float({ min: 200, max: 800, fractionDigits: 2 });
    const grossPay = baseSalary + overtime + bonuses;
    const netPay = grossPay - deductions;
    
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      period: faker.date.recent({ days: 30 }).toISOString().slice(0, 7),
      baseSalary: parseFloat(baseSalary.toFixed(2)),
      overtime,
      bonuses,
      deductions,
      grossPay: parseFloat(grossPay.toFixed(2)),
      netPay: parseFloat(netPay.toFixed(2)),
      status: faker.helpers.arrayElement(['draft', 'processed', 'paid'] as const),
      payDate: faker.helpers.maybe(() => faker.date.recent().toISOString().split('T')[0], { probability: 0.8 })
    };
  });
};

export const generateMockPerformanceReviews = (employees: Employee[], count: number = 30): PerformanceReview[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      reviewPeriod: faker.helpers.arrayElement(['Q1 2025', 'Q2 2024', 'Q3 2024', 'Q4 2024']),
      overallRating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      goals: faker.helpers.arrayElements([
        'Improve production efficiency', 'Complete safety certification',
        'Lead team training sessions', 'Reduce equipment downtime',
        'Enhance quality control processes', 'Develop new procedures'
      ], { min: 2, max: 4 }),
      achievements: faker.helpers.arrayElements([
        'Exceeded production targets', 'Zero safety incidents',
        'Successful project completion', 'Team leadership excellence',
        'Process improvement implementation', 'Cost reduction initiative'
      ], { min: 1, max: 3 }),
      improvementAreas: faker.helpers.arrayElements([
        'Communication skills', 'Time management',
        'Technical knowledge', 'Leadership development',
        'Problem-solving approach', 'Documentation practices'
      ], { min: 1, max: 2 }),
      reviewedBy: faker.person.fullName(),
      date: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
      status: faker.helpers.arrayElement(['draft', 'completed', 'approved'] as const)
    };
  });
};

export const generateMockJobPostings = (count: number = 10): JobPosting[] => {
  return Array.from({ length: count }, () => {
    const department = faker.helpers.arrayElement(departments);
    const position = faker.helpers.arrayElement(positions[department as keyof typeof positions]);
    
    return {
      id: faker.string.uuid(),
      title: position,
      department,
      location: faker.helpers.arrayElement(['Main Plant', 'Office Building', 'Remote', 'Warehouse']),
      type: faker.helpers.arrayElement(['full-time', 'part-time', 'contract', 'intern'] as const),
      description: faker.lorem.paragraphs(2),
      requirements: faker.helpers.arrayElements([
        'Bachelor\'s degree in relevant field', '3+ years experience',
        'Safety certification required', 'Leadership experience',
        'Technical expertise in manufacturing', 'Strong communication skills',
        'Problem-solving abilities', 'Team collaboration skills'
      ], { min: 3, max: 6 }),
      salary: {
        min: faker.number.int({ min: 40000, max: 60000 }),
        max: faker.number.int({ min: 70000, max: 120000 })
      },
      status: faker.helpers.arrayElement(['open', 'closed', 'filled'] as const),
      postedDate: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
      applications: faker.number.int({ min: 5, max: 50 })
    };
  });
};

export const generateMockCandidates = (jobPostings: JobPosting[], count: number = 25): Candidate[] => {
  return Array.from({ length: count }, () => {
    const job = faker.helpers.arrayElement(jobPostings);
    
    return {
      id: faker.string.uuid(),
      jobId: job.id,
      jobTitle: job.title,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      resume: `${faker.person.lastName()}_Resume.pdf`,
      experience: faker.number.int({ min: 0, max: 15 }),
      skills: faker.helpers.arrayElements([
        'Manufacturing', 'Quality Control', 'Safety Management',
        'Leadership', 'Project Management', 'Technical Skills',
        'Problem Solving', 'Team Work', 'Communication'
      ], { min: 3, max: 7 }),
      status: faker.helpers.arrayElement(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const),
      appliedDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 })
    };
  });
};

export const generateMockInsurancePolicies = (employees: Employee[], count: number = 30): InsurancePolicy[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: faker.helpers.arrayElement(['health', 'life', 'disability'] as const),
      provider: faker.company.name(),
      policyNumber: faker.string.alphanumeric(12).toUpperCase(),
      coverageAmount: faker.number.int({ min: 50000, max: 500000 }),
      monthlyPremium: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      startDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
      status: faker.helpers.arrayElement(['active', 'expired', 'cancelled'] as const),
    };
  });
};

export const generateMockWorkAccidents = (employees: Employee[], count: number = 15): WorkAccident[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      accidentDate: faker.date.recent({ days: 180 }).toISOString(),
      location: faker.helpers.arrayElement(['Assembly Line 3', 'Warehouse B', 'Loading Dock', 'Maintenance Shop']),
      description: faker.lorem.sentence(),
      severity: faker.helpers.arrayElement(['minor', 'moderate', 'severe', 'critical'] as const),
      status: faker.helpers.arrayElement(['reported', 'investigating', 'closed'] as const),
      followUpActions: faker.lorem.sentence(),
    };
  });
};

export const generateMockWorkCertificates = (employees: Employee[], count: number = 25): WorkCertificate[] => {
  return Array.from({ length: count }, () => {
    const employee = faker.helpers.arrayElement(employees);
    const status = faker.helpers.arrayElement(['requested', 'issued', 'downloaded'] as const);
    return {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: faker.helpers.arrayElement(['work', 'salary'] as const),
      requestDate: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
      issueDate: status !== 'requested' ? faker.date.recent({ days: 30 }).toISOString().split('T')[0] : undefined,
      status,
      issuedBy: status !== 'requested' ? faker.person.fullName() : undefined,
    };
  });
};

export const mockEmployees = generateMockEmployees();
export const mockLeaveRequests = generateMockLeaveRequests(mockEmployees);
export const mockTrainingPrograms = generateMockTrainingPrograms();
export const mockAttendanceRecords = generateMockAttendanceRecords(mockEmployees);
export const mockPayrollRecords = generateMockPayrollRecords(mockEmployees);
export const mockPerformanceReviews = generateMockPerformanceReviews(mockEmployees);
export const mockJobPostings = generateMockJobPostings();
export const mockCandidates = generateMockCandidates(mockJobPostings);
export const mockInsurancePolicies = generateMockInsurancePolicies(mockEmployees);
export const mockWorkAccidents = generateMockWorkAccidents(mockEmployees);
export const mockWorkCertificates = generateMockWorkCertificates(mockEmployees);
