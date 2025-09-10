export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills: string[];
  certifications: string[];
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  createdAt: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  overallRating: number;
  goals: string[];
  achievements: string[];
  improvementAreas: string[];
  reviewedBy: string;
  date: string;
  status: 'draft' | 'completed' | 'approved';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  location: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  payDate?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'intern';
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
  };
  status: 'open' | 'closed' | 'filled';
  postedDate: string;
  applications: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  experience: number;
  skills: string[];
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department: string;
  avatar?: string;
}

export interface InsurancePolicy {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'health' | 'life' | 'disability';
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  monthlyPremium: number;
  startDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface WorkAccident {
  id: string;
  employeeId: string;
  employeeName: string;
  accidentDate: string;
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  status: 'reported' | 'investigating' | 'closed';
  followUpActions: string;
}

export interface WorkCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'work' | 'salary';
  requestDate: string;
  issueDate?: string;
  status: 'requested' | 'issued' | 'downloaded';
  issuedBy?: string;
}
