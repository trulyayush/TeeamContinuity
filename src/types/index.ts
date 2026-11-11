export type UserRole = 
  | 'INCOMING_DEVELOPER'
  | 'PROJECT_MANAGER'
  | 'HR_ADMIN'
  | 'DEPARTING_MEMBER';

export type SourceType = 
  | 'GITHUB_PR'
  | 'GITHUB_COMMIT'
  | 'ADR'
  | 'DOCUMENTATION'
  | 'SLACK_CONVERSATION'
  | 'JIRA_TASK'
  | 'MEETING_NOTES';

export interface ProjectSource {
  id: string;
  type: SourceType;
  title: string;
  author: string;
  timestamp: string;
  urlOrRef: string;
  excerpt: string;
  fullContent: string;
  redactedElements?: string[];
  tags: string[];
}

export interface DecisionRecord {
  id: string;
  title: string;
  whyItHappened: string;
  alternativesDiscarded: string;
  status: 'ADOPTED' | 'SUPERSEDED' | 'IN_REVIEW';
  impact: string;
  evidenceQuote: string;
  sourceId: string;
  sourceRef: string;
  confidence: number;
  reviewedBy?: string;
  isReviewed?: boolean;
}

export interface OwnershipItem {
  id: string;
  subsystem: string;
  primaryDeparting: string;
  designatedSuccessor: string;
  riskStatus: 'CRITICAL_RISK' | 'NEEDS_SHADOWING' | 'SAFE_HANDOFF';
  complexityScore: number; // 1-10
  criticalGotchas: string[];
  keyFiles: string[];
  reviewed: boolean;
}

export interface DependencyItem {
  id: string;
  taskName: string;
  state: 'COMPLETED_WITH_HIDDEN_DEP' | 'BLOCKED' | 'IN_PROGRESS' | 'ACTIVE';
  upstreamTask?: string;
  downstreamImpact: string;
  unresolvedGotcha: string;
  evidenceSourceId: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface KnowledgeGap {
  id: string;
  category: 'MISSING_DOCUMENTATION' | 'UNTESTED_FAILURE_MODE' | 'SECRET_OR_ACCESS' | 'TACIT_ASSUMPTION';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  recommendedAction: string;
  detectedFromSourceId?: string;
  resolved: boolean;
  resolutionNote?: string;
}

export interface DetectedConflict {
  id: string;
  topic: string;
  claimA: {
    statement: string;
    sourceTitle: string;
    sourceId: string;
    author: string;
    date: string;
  };
  claimB: {
    statement: string;
    sourceTitle: string;
    sourceId: string;
    author: string;
    date: string;
  };
  impact: string;
  status: 'OPEN_CONTRADICTION' | 'RESOLVED';
  resolution?: string;
}

export interface ContinuationAction {
  id: string;
  timeframe: 'DAY_1' | 'WEEK_1' | 'SPRINT_1';
  targetRole: UserRole | 'ALL';
  title: string;
  description: string;
  evidenceRef: string;
  completed: boolean;
}

export interface HandoverProject {
  id: string;
  name: string;
  tagline: string;
  departingMember: {
    name: string;
    role: string;
    avatar: string;
    departureDate: string;
    email: string;
  };
  incomingSuccessor: {
    name: string;
    role: string;
    avatar: string;
    startDate: string;
  };
  completenessScore: number;
  metrics: {
    decisionsTracked: number;
    supportedClaimRate: number; // percentage
    unresolvedGaps: number;
    conflictsDetected: number;
    hiddenDependencies: number;
  };
  reviewState: {
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    signatureHash?: string;
    notes?: string;
  };
  sources: ProjectSource[];
  decisions: DecisionRecord[];
  ownershipMap: OwnershipItem[];
  dependencies: DependencyItem[];
  gaps: KnowledgeGap[];
  conflicts: DetectedConflict[];
  actions: ContinuationAction[];
}
