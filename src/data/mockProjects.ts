import { HandoverProject } from '../types';

export const initialProjects: HandoverProject[] = [
  {
    id: 'proj-nexus-payments',
    name: 'Nexus Payments Core Engine',
    tagline: 'High-throughput multi-currency clearing & settlement microservice',
    departingMember: {
      name: 'Marcus Vance',
      role: 'Staff Distributed Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      departureDate: 'In 4 days (Nov 14, 2026)',
      email: 'marcus.v@nexuspay.io',
    },
    incomingSuccessor: {
      name: 'Chloe Zhang',
      role: 'Senior Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      startDate: 'Active (Shadowing Day 3)',
    },
    completenessScore: 84,
    metrics: {
      decisionsTracked: 6,
      supportedClaimRate: 94,
      unresolvedGaps: 3,
      conflictsDetected: 2,
      hiddenDependencies: 2,
    },
    reviewState: {
      isApproved: false,
      notes: 'Pending resolution of ElastiCache vs Sentinel configuration conflict and bastion cron gotcha.',
    },
    sources: [
      {
        id: 'src-pr-188',
        type: 'GITHUB_PR',
        title: 'PR #188: Implement Stripe Webhook V3 idempotent processing',
        author: 'marcusvance',
        timestamp: '2026-10-28 14:22',
        urlOrRef: 'github.com/nexuspay/core/pull/188',
        excerpt: 'Closes NEX-412. Added idempotency key hashing using SHA-256. Note: Table migration 0089_idempotency_keys.sql is written but requires manual execution with pg_cron.',
        fullContent: `PR #188 by Marcus Vance:
Merged into master by marcusvance on Oct 28, 2026.
Description:
Replaces legacy v2 webhook handler with v3 batch processing.
Solves duplicate webhook deliveries during Stripe burst incidents.
WARNING: Table 0089_idempotency_keys.sql has NOT been auto-migrated via CI because of exclusive table lock timeout in production. It must be executed off-peak with CONCURRENTLY index creation.`,
        tags: ['github', 'payments', 'critical'],
      },
      {
        id: 'src-slack-arch',
        type: 'SLACK_CONVERSATION',
        title: '#arch-infra: ElastiCache Cluster migration debate',
        author: 'Marcus Vance, Priya Patel',
        timestamp: '2026-10-15 11:05',
        urlOrRef: 'slack.com/archives/C048/p1729002300',
        excerpt: 'Marcus: "We must use AWS ElastiCache Valkey Cluster with auto-sharding because Sentinel maxes out at 85k ops/sec." Priya: "Agreed, let us deprecate Sentinel by end of month."',
        fullContent: `[Oct 15, 11:02 AM] Marcus Vance:
Hey team, we profiled the clearing engine under 12k tx/sec. Redis Sentinel reached 98% CPU saturation on the primary node. We decided to switch the settlement engine to AWS ElastiCache Valkey Cluster with cluster-mode enabled.
[Oct 15, 11:05 AM] Priya Patel:
Approved. Let us decommission Sentinel by end of month. All microservices should update REDIS_CLUSTER_URL.`,
        tags: ['slack', 'architecture', 'caching'],
      },
      {
        id: 'src-readme',
        type: 'DOCUMENTATION',
        title: 'services/settlement/README.md',
        author: 'DevOps Automated Docs',
        timestamp: '2026-11-02 09:15',
        urlOrRef: 'repo/services/settlement/README.md',
        excerpt: 'Environment Configuration: REDIS_PRIMARY_HOST must point to the Redis Sentinel master. Setting cluster mode will cause connection rejection.',
        fullContent: `# Settlement Service README
## Prerequisites
- PostgreSQL 16 with pg_partman
- Redis Sentinel (Single master, 2 replicas).
CRITICAL: Do NOT enable cluster mode! The connection pooling library (ioredis v4.28) is locked to sentinel mode in our docker-compose and Kubernetes Helm charts.`,
        tags: ['readme', 'docs', 'devops'],
      },
      {
        id: 'src-adr-004',
        type: 'ADR',
        title: 'ADR-004: Two-Phase Commit vs Outbox Pattern for Settlement',
        author: 'Marcus Vance',
        timestamp: '2026-09-12 16:30',
        urlOrRef: 'docs/adr/ADR-004-settlement-concurrency.md',
        excerpt: 'Status: Accepted. We chose transactional outbox with Debezium CDC over synchronous 2PC to avoid distributed deadlocks across banking rails.',
        fullContent: `Context:
When clearing funds across currency pairs, network timeouts can cause funds to be debited without corresponding bank confirmation.
Decision:
We adopt the Transactional Outbox Pattern backed by Debezium CDC on PostgreSQL.
Why:
Synchronous 2PC locks database rows across multiple services, which caused 4 cascading timeouts during the June Flash Sale.
Alternatives Discarded:
- Synchronous 2PC (Discarded: high latency and deadlock risk)
- Saga without compensation queues (Discarded: impossible to reconcile orphaned debits)`,
        tags: ['adr', 'architecture', 'decisions'],
      },
      {
        id: 'src-jira-412',
        type: 'JIRA_TASK',
        title: 'Jira NEX-412: Webhook Idempotency for Payment Providers',
        author: 'Marcus Vance (Assignee)',
        timestamp: '2026-10-29 18:00',
        urlOrRef: 'jira.nexuspay.io/browse/NEX-412',
        excerpt: 'Status: CLOSED - RESOLVED. Sprint 24. Acceptance criteria fulfilled.',
        fullContent: `Ticket NEX-412:
Status: CLOSED
Assignee: Marcus Vance
Sprint: 24 Core Settlement
Summary: Prevent duplicate webhook deliveries from Stripe and Adyen.
Release Notes: Handled via PR #188. (Note: Closed without recording that database migration 0089 is pending in production).`,
        tags: ['jira', 'sprint', 'tasks'],
      },
      {
        id: 'src-notes-standup',
        type: 'MEETING_NOTES',
        title: 'Senior Staff Sync & Departure Debrief Notes',
        author: 'Chloe Zhang',
        timestamp: '2026-11-08 15:00',
        urlOrRef: 'notion.so/nexus/Marcus-Debrief-Sync',
        excerpt: 'Marcus mentioned there is a silent bash cron job running on bastion-01 (ec2-user) that flushes stale idempotency records every Sunday morning.',
        fullContent: `Sync Attendees: Marcus Vance, Chloe Zhang, Elena Davis (VP Eng)
Discussion Points:
- Bastion secret script: Marcus revealed that table partitioning is augmented by a custom cron job in /opt/scripts/prune_keys.sh on bastion-01. It is not currently in Terraform or Ansible.
- If bastion-01 is terminated during auto-healing, the disk will fill up in ~14 days.
- Chloe must migrate this script into a Kubernetes CronJob immediately.`,
        tags: ['meeting', 'debrief', 'tacit'],
      },
    ],
    decisions: [
      {
        id: 'dec-1',
        title: 'Adopt Transactional Outbox Pattern with Debezium CDC',
        whyItHappened: 'Synchronous Two-Phase Commit (2PC) caused distributed deadlocks and 4 cascading production outages during flash sales.',
        alternativesDiscarded: 'Synchronous 2PC (discarded due to row-level locks across microservices); Sagas without compensation queues (discarded due to unreconcilable debits).',
        status: 'ADOPTED',
        impact: 'Core settlement pipeline, event bus consumers, audit ledger.',
        evidenceQuote: '"We adopt the Transactional Outbox Pattern backed by Debezium CDC on PostgreSQL to avoid distributed deadlocks."',
        sourceId: 'src-adr-004',
        sourceRef: 'ADR-004 (docs/adr/ADR-004-settlement-concurrency.md)',
        confidence: 0.98,
        reviewedBy: 'Chloe Zhang',
        isReviewed: true,
      },
      {
        id: 'dec-2',
        title: 'Valkey / Redis Cluster Transition for Settlement Cache',
        whyItHappened: 'Single-master Redis Sentinel saturated at 98% CPU during load tests beyond 12k tx/second.',
        alternativesDiscarded: 'Vertical scaling of Sentinel master instance (discarded: AWS r6g.4xlarge cost prohibitive and does not solve single-point-of-failure write bottleneck).',
        status: 'IN_REVIEW',
        impact: 'Affects caching layer, Helm deployment manifests, and connection pooling config.',
        evidenceQuote: '"Sentinel reached 98% CPU saturation... switch to AWS ElastiCache Valkey Cluster with cluster-mode enabled."',
        sourceId: 'src-slack-arch',
        sourceRef: 'Slack #arch-infra (Oct 15, 2026)',
        confidence: 0.92,
        isReviewed: false,
      },
      {
        id: 'dec-3',
        title: 'SHA-256 Idempotency Key Hashing for Provider Webhooks',
        whyItHappened: 'Payment provider retries were generating duplicate credit ledger entries during provider network timeouts.',
        alternativesDiscarded: 'Timestamp-based deduplication window (discarded: clock drift between cloud regions exceeded 400ms).',
        status: 'ADOPTED',
        impact: 'Webhook ingress gateway and settlement ledger.',
        evidenceQuote: '"Replaces legacy v2 webhook handler with v3 batch processing. Solves duplicate webhook deliveries during Stripe burst incidents."',
        sourceId: 'src-pr-188',
        sourceRef: 'GitHub PR #188 (commit 98f41e)',
        confidence: 0.96,
        isReviewed: true,
      },
    ],
    ownershipMap: [
      {
        id: 'own-1',
        subsystem: 'Settlement Engine & Clearing Bus',
        primaryDeparting: 'Marcus Vance',
        designatedSuccessor: 'Chloe Zhang',
        riskStatus: 'CRITICAL_RISK',
        complexityScore: 9,
        criticalGotchas: [
          'Debezium connector offset will reset to beginning of WAL if replication slot is dropped without stopping the worker first.',
          'Never restart Kubernetes settlement pod while outbox queue depth exceeds 50k messages without increasing JVM heap to 8GB.',
        ],
        keyFiles: ['services/settlement/worker.go', 'services/settlement/outbox_cdc.go', 'deploy/helm/settlement-values.yaml'],
        reviewed: true,
      },
      {
        id: 'own-2',
        subsystem: 'Webhook Ingress Gateway (Stripe/Adyen)',
        primaryDeparting: 'Marcus Vance',
        designatedSuccessor: 'Chloe Zhang',
        riskStatus: 'NEEDS_SHADOWING',
        complexityScore: 7,
        criticalGotchas: [
          'Table migration 0089_idempotency_keys.sql is NOT in production yet! Must be applied manually before v3 traffic switch.',
          'Stripe webhooks signature secret rotates automatically every 90 days; webhook worker must fetch secret from AWS Secrets Manager with cache TTL <= 5m.',
        ],
        keyFiles: ['services/ingress/webhook_v3.go', 'migrations/0089_idempotency_keys.sql'],
        reviewed: false,
      },
      {
        id: 'own-3',
        subsystem: 'Bastion Cron & Maintenance Automation',
        primaryDeparting: 'Marcus Vance',
        designatedSuccessor: 'DevOps / Chloe Zhang',
        riskStatus: 'CRITICAL_RISK',
        complexityScore: 8,
        criticalGotchas: [
          'Unmanaged script in /opt/scripts/prune_keys.sh on bastion-01 runs every Sunday at 02:00 UTC.',
          'If bastion-01 is terminated by ASG health check, database disk will fill up within 14 days due to unpruned partitions!',
        ],
        keyFiles: ['/opt/scripts/prune_keys.sh (Bastion-01)', 'crontab: ec2-user'],
        reviewed: false,
      },
    ],
    dependencies: [
      {
        id: 'dep-1',
        taskName: 'NEX-412: Webhook Idempotency Rollout',
        state: 'COMPLETED_WITH_HIDDEN_DEP',
        upstreamTask: 'PR #188 (Merged)',
        downstreamImpact: 'If v3 webhook traffic is enabled, all webhook events will fail with Postgres error 42P01 (relation "idempotency_keys" does not exist).',
        unresolvedGotcha: 'Task was closed in Jira as "RESOLVED", but migration 0089 was bypassed in CI due to lock timeout. Requires off-peak execution.',
        evidenceSourceId: 'src-pr-188',
        urgency: 'CRITICAL',
      },
      {
        id: 'dep-2',
        taskName: 'ElastiCache Valkey Cluster Deployment',
        state: 'BLOCKED',
        upstreamTask: 'Helm Chart & ioredis Library Upgrade',
        downstreamImpact: 'Settlement service cannot connect to cluster mode endpoints until ioredis dependency is upgraded from 4.28 to 5.3 in settlement container.',
        unresolvedGotcha: 'README.md explicitly forbids cluster mode because legacy Kubernetes deployment still runs ioredis 4.28.',
        evidenceSourceId: 'src-readme',
        urgency: 'HIGH',
      },
    ],
    gaps: [
      {
        id: 'gap-1',
        category: 'TACIT_ASSUMPTION',
        title: 'Undocumented Bastion Maintenance Cron Job',
        description: 'An unversioned shell script on ec2-user bastion-01 manages Postgres partition pruning. No IaC (Terraform) or Ansible documentation exists.',
        severity: 'CRITICAL',
        recommendedAction: 'SSH into bastion-01, commit /opt/scripts/prune_keys.sh into repo, and convert into a Kubernetes CronJob.',
        detectedFromSourceId: 'src-notes-standup',
        resolved: false,
      },
      {
        id: 'gap-2',
        category: 'MISSING_DOCUMENTATION',
        title: 'Disaster Recovery Secondary Region Failover Runbook',
        description: 'No documentation or step-by-step procedure exists for redirecting clearing traffic to us-west-2 if us-east-1 RDS fails.',
        severity: 'HIGH',
        recommendedAction: 'Schedule a 45-minute DR walkthrough session with Marcus before his last day (Nov 14) and document DNS failover steps.',
        resolved: false,
      },
      {
        id: 'gap-3',
        category: 'SECRET_OR_ACCESS',
        title: 'Adyen Production Merchant Sandbox API Keys',
        description: 'Testing Adyen webhook edge cases requires sandbox credentials stored in Marcus\'s personal 1Password vault rather than corporate AWS Secrets Manager.',
        severity: 'MEDIUM',
        recommendedAction: 'Transfer credentials to the team vault under "Payments-Eng-Shared".',
        resolved: true,
        resolutionNote: 'Transferred by Marcus on Nov 9 to 1Password Shared Vault.',
      },
    ],
    conflicts: [
      {
        id: 'conf-1',
        topic: 'Redis Architecture: ElastiCache Valkey Cluster vs Redis Sentinel',
        claimA: {
          statement: 'Slack #arch-infra: "We decided to switch the settlement engine to AWS ElastiCache Valkey Cluster with cluster-mode enabled."',
          sourceTitle: 'Slack #arch-infra',
          sourceId: 'src-slack-arch',
          author: 'Marcus Vance',
          date: 'Oct 15, 2026',
        },
        claimB: {
          statement: 'Settlement README.md: "CRITICAL: Do NOT enable cluster mode! Connection pooling library (ioredis v4.28) is locked to sentinel mode."',
          sourceTitle: 'services/settlement/README.md',
          sourceId: 'src-readme',
          author: 'DevOps Automated Docs',
          date: 'Nov 02, 2026',
        },
        impact: 'If Chloe deploys cluster mode to staging/production without upgrading ioredis, settlement pods will enter CrashLoopBackOff.',
        status: 'OPEN_CONTRADICTION',
        resolution: 'Target resolution: Upgrade ioredis to v5.3 in PR #192 before toggling cluster mode endpoint in Helm values.',
      },
    ],
    actions: [
      {
        id: 'act-1',
        timeframe: 'DAY_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Inspect and containerize bastion-01 prune script',
        description: 'SSH into bastion-01, copy /opt/scripts/prune_keys.sh, test idempotency, and create k8s-cronjob.yaml.',
        evidenceRef: 'Meeting Notes: Senior Staff Sync (Nov 08)',
        completed: false,
      },
      {
        id: 'act-2',
        timeframe: 'DAY_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Run pending migration 0089_idempotency_keys.sql',
        description: 'Coordinate maintenance window with Lead DBA to apply schema migration 0089 with CONCURRENTLY index creation.',
        evidenceRef: 'GitHub PR #188 & Jira NEX-412',
        completed: false,
      },
      {
        id: 'act-3',
        timeframe: 'WEEK_1',
        targetRole: 'PROJECT_MANAGER',
        title: 'Verify Handover Sign-Off & Knowledge Checkpoints',
        description: 'Ensure Chloe shadow-runs the Wednesday clearing cycle alongside Marcus before final access offboarding.',
        evidenceRef: 'Handover Review Protocol',
        completed: true,
      },
      {
        id: 'act-4',
        timeframe: 'WEEK_1',
        targetRole: 'HR_ADMIN',
        title: 'Revoke Personal Cloud Credentials & Verify Shared Vault',
        description: 'Audit Marcus’s AWS IAM direct user access, GitHub admin rights, and confirm 1Password vault transfer.',
        evidenceRef: 'Trust-by-Design Compliance Standard',
        completed: false,
      },
      {
        id: 'act-5',
        timeframe: 'SPRINT_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Upgrade ioredis to v5.3 & Resolve Valkey Contradiction',
        description: 'Complete the migration to ElastiCache Valkey Cluster and deprecate the Sentinel configuration in Helm values.',
        evidenceRef: 'Conflict #conf-1 (Slack vs README)',
        completed: false,
      },
    ],
  },
  {
    id: 'proj-biocompute-ml',
    name: 'BioCompute Genomic Variant Pipeline',
    tagline: 'Distributed high-throughput DNA sequencing & deep variant calling pipeline',
    departingMember: {
      name: 'Dr. Elena Rostova',
      role: 'Principal ML Bioinformatician',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      departureDate: 'In 7 days (Nov 17, 2026)',
      email: 'e.rostova@biocompute.org',
    },
    incomingSuccessor: {
      name: 'Tariq Al-Mansoor',
      role: 'Staff MLOps & Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      startDate: 'Starting Monday',
    },
    completenessScore: 78,
    metrics: {
      decisionsTracked: 4,
      supportedClaimRate: 88,
      unresolvedGaps: 4,
      conflictsDetected: 1,
      hiddenDependencies: 3,
    },
    reviewState: {
      isApproved: false,
      notes: 'Elena needs to document FP16 quantization calibration dataset before final signoff.',
    },
    sources: [
      {
        id: 'bio-src-1',
        type: 'GITHUB_PR',
        title: 'PR #340: Implement FlashAttention-2 custom kernel for long-read FASTQ',
        author: 'erostova',
        timestamp: '2026-10-18 20:10',
        urlOrRef: 'github.com/biocompute/variants/pull/340',
        excerpt: 'Compiles custom Triton kernel for sequence lengths > 32k bp. Requires CUDA 12.4 and cuDNN 9.1.',
        fullContent: `PR #340: Custom Attention Kernel for Oxford Nanopore Long Reads.
Benchmarked on 8x NVIDIA H100 SXM5 nodes.
NOTE: If running on A100 GPUs, the tile size must be changed from 128 to 64 in kernel_tile.cu or it will throw illegal memory access!`,
        tags: ['github', 'triton', 'cuda'],
      },
      {
        id: 'bio-src-2',
        type: 'SLACK_CONVERSATION',
        title: '#slurm-compute: GPU Cluster Scratch Disk quota issue',
        author: 'Elena, Tariq',
        timestamp: '2026-10-24 14:00',
        urlOrRef: 'slack.com/archives/C_SLURM/p1024',
        excerpt: 'Elena: "Variant calling writes 14TB of uncompressed BAM files to /scratch/tmp during alignment. You must set TMPDIR=/fast_nvme/scratch or the node crashes."',
        fullContent: `Elena:
Notice for whoever takes over cluster runs: The default /scratch NFS partition runs out of inodes during chromosomes 1-22 variant calling. Always export TMPDIR=/fast_nvme/scratch in the Slurm submit script. It is not set in the default bashrc!`,
        tags: ['slurm', 'infrastructure', 'gotcha'],
      },
    ],
    decisions: [
      {
        id: 'bio-dec-1',
        title: 'Adopt FlashAttention-2 Triton Kernels for 32k bp Contexts',
        whyItHappened: 'Standard quadratic attention ran out of VRAM (OOM) on Oxford Nanopore reads exceeding 25k base pairs.',
        alternativesDiscarded: 'Sliding window local attention (discarded: missed distal regulatory element interactions).',
        status: 'ADOPTED',
        impact: 'Variant calling model architecture and GPU requirements.',
        evidenceQuote: '"Compiles custom Triton kernel for sequence lengths > 32k bp. Requires CUDA 12.4."',
        sourceId: 'bio-src-1',
        sourceRef: 'PR #340 (github.com/biocompute/variants/pull/340)',
        confidence: 0.95,
        isReviewed: true,
      },
    ],
    ownershipMap: [
      {
        id: 'bio-own-1',
        subsystem: 'Deep Variant Neural Network Model',
        primaryDeparting: 'Dr. Elena Rostova',
        designatedSuccessor: 'Tariq Al-Mansoor',
        riskStatus: 'CRITICAL_RISK',
        complexityScore: 10,
        criticalGotchas: [
          'If run on A100 instead of H100, tile size MUST be set to 64 in kernel_tile.cu or kernel panics.',
          'Model weights checkpoint v4.2 is hosted on a private HuggingFace repo that requires Elena’s read token.',
        ],
        keyFiles: ['models/variant_transformer.py', 'kernels/attention_tile.cu'],
        reviewed: false,
      },
    ],
    dependencies: [
      {
        id: 'bio-dep-1',
        taskName: 'Quantized INT8 Model Export for Production Inference',
        state: 'BLOCKED',
        upstreamTask: 'Calibration with 1,000 Genome Phase 3 benchmark data',
        downstreamImpact: 'Production API latency will remain at 3.2s per genome instead of target 450ms.',
        unresolvedGotcha: 'Calibration script was stored in /home/erostova on university cluster; needs to be copied into Git repo.',
        evidenceSourceId: 'bio-src-1',
        urgency: 'HIGH',
      },
    ],
    gaps: [
      {
        id: 'bio-gap-1',
        category: 'SECRET_OR_ACCESS',
        title: 'Private HuggingFace Checkpoint Repository Token',
        description: 'Pre-trained checkpoint weights are pulled during Docker build via HF_TOKEN belonging to Elena’s personal academic account.',
        severity: 'CRITICAL',
        recommendedAction: 'Create a BioCompute Organization service account on Hugging Face and transfer repository ownership.',
        resolved: false,
      },
      {
        id: 'bio-gap-2',
        category: 'TACIT_ASSUMPTION',
        title: 'TMPDIR Environment Variable on Slurm Compute Nodes',
        description: 'Unwritten requirement: failure to export TMPDIR=/fast_nvme/scratch leads to Slurm node inode exhaustion.',
        severity: 'HIGH',
        recommendedAction: 'Add TMPDIR validation check inside src/pipeline/align.py startup script.',
        resolved: false,
      },
    ],
    conflicts: [
      {
        id: 'bio-conf-1',
        topic: 'PyTorch Version Support: PyTorch 2.4 vs 2.1 Compatibility',
        claimA: {
          statement: 'Docker container Dockerfile.cuda states: "FROM pytorch/pytorch:2.1.2-cuda12.1-cudnn8-runtime"',
          sourceTitle: 'Dockerfile.cuda',
          sourceId: 'bio-src-1',
          author: 'DevOps Lead',
          date: 'Oct 02, 2026',
        },
        claimB: {
          statement: 'PR #340 commit notes: "Requires PyTorch 2.4+ and cuDNN 9.1 for FlashAttention-2 Triton backward pass."',
          sourceTitle: 'PR #340 commit log',
          sourceId: 'bio-src-1',
          author: 'Dr. Elena Rostova',
          date: 'Oct 18, 2026',
        },
        impact: 'Building the default Docker image results in immediate Triton kernel compilation failure.',
        status: 'OPEN_CONTRADICTION',
        resolution: 'Target resolution: Bump base image to pytorch:2.4.0-cuda12.4-cudnn9-runtime.',
      },
    ],
    actions: [
      {
        id: 'bio-act-1',
        timeframe: 'DAY_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Migrate Hugging Face model checkpoint token to Org account',
        description: 'Regenerate organization-level token and update AWS Secrets Manager key BIOCOMPUTE_HF_TOKEN.',
        evidenceRef: 'Hugging Face weights requirement',
        completed: false,
      },
      {
        id: 'bio-act-2',
        timeframe: 'DAY_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Patch Dockerfile.cuda to PyTorch 2.4 and CUDA 12.4',
        description: 'Align Docker base image with PR #340 Triton kernel requirements to fix compilation errors.',
        evidenceRef: 'Conflict #bio-conf-1',
        completed: false,
      },
    ],
  },
  {
    id: 'proj-sapthagiri-visionx',
    name: 'ContinuityOS - VisionX Core Architecture',
    tagline: 'Sapthagiri NPS University Hackathon Project by Team VisionX',
    departingMember: {
      name: 'Ayushkumar Nayak',
      role: 'Team Leader & Lead Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      departureDate: 'Hackathon Round 1 -> Round 2 Transition',
      email: 'theayushnayak01@gmail.com',
    },
    incomingSuccessor: {
      name: 'Bharath R & Team VisionX',
      role: 'Core Engineering Leads (Bhargavi A, Bhavanashree R)',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
      startDate: 'Round 2 Sprint Active',
    },
    completenessScore: 92,
    metrics: {
      decisionsTracked: 5,
      supportedClaimRate: 98,
      unresolvedGaps: 1,
      conflictsDetected: 1,
      hiddenDependencies: 1,
    },
    reviewState: {
      isApproved: true,
      approvedBy: 'Ayushkumar Nayak & Team VisionX',
      approvedAt: '2026-11-10 16:45',
      signatureHash: 'sha256:e84f29a0c8b31a89c90f84521098dfc3',
      notes: 'Round 1 plan completed; Round 2 acceptance tests fully mapped with evidence backing.',
    },
    sources: [
      {
        id: 'vx-src-1',
        type: 'ADR',
        title: 'VisionX Slide Deck: Continuity When People Move On',
        author: 'Ayushkumar Nayak, Bharath R, Bhargavi A, Bhavanashree R',
        timestamp: '2026-11-10 12:00',
        urlOrRef: 'public/assets/aistudio/Continuity-when-people-move-on.pptx_6022897a.pdf',
        excerpt: 'Official challenge: "Build a system that converts scattered project activity into a usable handover when a team member leaves."',
        fullContent: `KNOWLEDGE CONTINUITY PLATFORM · HACKATHON ROUND 1
Continuity, when people move on: Prevent Critical Knowledge From Leaving With People.
Team: VISIONX · SAPTHAGIRI NPS UNIVERSITY
Leader: AYUSHKUMAR NAYAK
Members: BHARATH R, BHARGAVI A, BHAVANASHREE R
Core Insight: Continuity requires reconstructing context and action, not merely summarising files.
The Core Loop: Connect -> Reconstruct -> Verify -> Review -> Handover.
Round 2 Acceptance Tests:
1. Evidence reliability and contradiction detection (Measure supported-claim coverage and show conflicts instead of merging them).
2. Dependency graph and continuation planning (Demonstrate blocked-task paths and next actions).
3. Role-aware permissions and personalisation (Show different approved handovers for different authorised roles).`,
        tags: ['hackathon', 'visionx', 'sapthagiri', 'deck'],
      },
    ],
    decisions: [
      {
        id: 'vx-dec-1',
        title: 'Evidence-First Knowledge Reconstruction over Simple Summarization',
        whyItHappened: 'Summarization algorithms blur conflicts and hallucinate consensus. In continuity, "missing information must stay missing" and conflicts must be surfaced.',
        alternativesDiscarded: 'Naive RAG summary bot (discarded: hallucinated undocumented procedures and hid critical knowledge gaps).',
        status: 'ADOPTED',
        impact: 'Core pipeline, evidence linking modal, contradiction detector.',
        evidenceQuote: '"Our insight: continuity requires reconstructing context and action, not merely summarising files. Missing information stays missing."',
        sourceId: 'vx-src-1',
        sourceRef: 'VisionX Presentation Slide 5 & 10',
        confidence: 0.99,
        reviewedBy: 'Team VisionX',
        isReviewed: true,
      },
      {
        id: 'vx-dec-2',
        title: 'Role-Aware Personalization for Handover Consumption',
        whyItHappened: 'Incoming developers need unwritten gotchas and PR trails; Project Managers need delivery risks; HR admins need compliance checklists.',
        alternativesDiscarded: 'Single static PDF document (discarded: cognitive overload and irrelevant details for specific stakeholders).',
        status: 'ADOPTED',
        impact: 'Role switcher, personalized action items, role-specific export dossiers.',
        evidenceQuote: '"The incoming member receives a map, not a data dump. Show different approved handovers for different authorised roles."',
        sourceId: 'vx-src-1',
        sourceRef: 'VisionX Presentation Slide 8 & 17',
        confidence: 0.98,
        reviewedBy: 'Ayushkumar Nayak',
        isReviewed: true,
      },
    ],
    ownershipMap: [
      {
        id: 'vx-own-1',
        subsystem: 'Intelligence Pipeline (Extraction & Evidence Verification)',
        primaryDeparting: 'Ayushkumar Nayak',
        designatedSuccessor: 'Bharath R',
        riskStatus: 'SAFE_HANDOFF',
        complexityScore: 8,
        criticalGotchas: [
          'Deterministic checks must validate citation source spans before LLM claims are accepted into the review pool.',
        ],
        keyFiles: ['server.ts', 'src/data/mockProjects.ts', 'src/components/StageVerify.tsx'],
        reviewed: true,
      },
      {
        id: 'vx-own-2',
        subsystem: 'UI / UX & Review Interface',
        primaryDeparting: 'Team VisionX Lead',
        designatedSuccessor: 'Bhargavi A & Bhavanashree R',
        riskStatus: 'SAFE_HANDOFF',
        complexityScore: 7,
        criticalGotchas: [
          'Ensure dark obsidian theme matches the warm amber bronze aesthetic from Round 1 presentation slides.',
        ],
        keyFiles: ['src/App.tsx', 'src/components/Header.tsx', 'src/components/StageHandover.tsx'],
        reviewed: true,
      },
    ],
    dependencies: [
      {
        id: 'vx-dep-1',
        taskName: 'Round 2 Acceptance Test Suite Validation',
        state: 'ACTIVE',
        downstreamImpact: 'Proof of Round 2 delivery for hackathon evaluation.',
        unresolvedGotcha: 'Demonstrate contradiction detection, interactive dependency graph, and role-aware handovers with before/after comparison.',
        evidenceSourceId: 'vx-src-1',
        urgency: 'HIGH',
      },
    ],
    gaps: [
      {
        id: 'vx-gap-1',
        category: 'UNTESTED_FAILURE_MODE',
        title: 'Offline Browser Fallback when Gemini API Quota is Exceeded',
        description: 'If network is unavailable or user lacks API key, system must gracefully fall back to rich client-side deterministic reconstruction.',
        severity: 'MEDIUM',
        recommendedAction: 'Provide intelligent hybrid client/server fallback with precomputed deterministic pipeline.',
        resolved: true,
        resolutionNote: 'Implemented: server handles live Gemini calls with graceful deterministic fallback.',
      },
    ],
    conflicts: [
      {
        id: 'vx-conf-1',
        topic: 'Architecture Layer: Python FastAPI vs Node.js / TypeScript Server',
        claimA: {
          statement: 'Slide 11 & 14 proposed Python FastAPI for backend AI orchestration.',
          sourceTitle: 'Slide 11 Build Plan',
          sourceId: 'vx-src-1',
          author: 'Team VisionX Proposal',
          date: 'Round 1 Concept',
        },
        claimB: {
          statement: 'AI Studio Build environment runs TypeScript/Node.js with Express & @google/genai SDK for real-time reactive execution.',
          sourceTitle: 'AI Studio Environment Spec',
          sourceId: 'vx-src-1',
          author: 'Runtime Architecture',
          date: 'Round 2 Implementation',
        },
        impact: 'Harmonized by implementing fullstack TypeScript Express server with native Gemini 3.8 Flash SDK.',
        status: 'RESOLVED',
        resolution: 'Resolved: Built with unified React + TypeScript + Express stack providing zero-latency live compilation and full feature parity.',
      },
    ],
    actions: [
      {
        id: 'vx-act-1',
        timeframe: 'DAY_1',
        targetRole: 'ALL',
        title: 'Review VisionX Presentation Deck & System Architecture',
        description: 'Verify alignment with the 5 stages of the Core Loop: Connect -> Reconstruct -> Verify -> Review -> Handover.',
        evidenceRef: 'public/assets/aistudio/Continuity-when-people-move-on.pptx_6022897a.pdf',
        completed: true,
      },
      {
        id: 'vx-act-2',
        timeframe: 'WEEK_1',
        targetRole: 'INCOMING_DEVELOPER',
        title: 'Test Interactive Dependency Graph & Contradiction Resolution',
        description: 'Run through Scenario 1 (Nexus Payments) and Scenario 2 (BioCompute) to verify conflict detection and evidence citation inspector.',
        evidenceRef: 'Round 2 Acceptance Test #1 & #2',
        completed: true,
      },
    ],
  },
];
