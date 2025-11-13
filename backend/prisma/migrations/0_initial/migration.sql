npm warn Unknown env config "python". This will stop working in the next major version of npm.
-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "roleId" INTEGER NOT NULL,
    "branchId" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "borrowers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "dateOfBirth" DATE,
    "ssnHash" VARCHAR(255),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(2),
    "zip" VARCHAR(10),
    "citizenshipStatus" VARCHAR(50),
    "employmentStatus" VARCHAR(50),
    "employmentInfo" JSONB,
    "financialInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borrowers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_programs" (
    "id" SERIAL NOT NULL,
    "programCode" VARCHAR(50) NOT NULL,
    "programName" VARCHAR(255) NOT NULL,
    "programCategory" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "minAmount" DECIMAL(15,2),
    "maxAmount" DECIMAL(15,2),
    "minTermMonths" INTEGER,
    "maxTermMonths" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requirements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" TEXT NOT NULL,
    "loanNumber" VARCHAR(50) NOT NULL,
    "programId" INTEGER NOT NULL,
    "loanOfficerId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "coBorrowerId" TEXT,
    "loanAmount" DECIMAL(15,2) NOT NULL,
    "loanTermMonths" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,3),
    "purpose" VARCHAR(255),
    "transactionType" VARCHAR(50),
    "propertyAddress" VARCHAR(255),
    "propertyCity" VARCHAR(100),
    "propertyState" VARCHAR(2),
    "propertyZip" VARCHAR(10),
    "propertyType" VARCHAR(50),
    "propertyValue" DECIMAL(15,2),
    "status" VARCHAR(50) NOT NULL DEFAULT 'LEAD',
    "subStatus" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "fundedAt" TIMESTAMP(3),
    "requestedCreditReport" BOOLEAN NOT NULL DEFAULT false,
    "creditScore" INTEGER,
    "estimatedMonthlyPayment" DECIMAL(12,2),

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_status_history" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "fromStatus" VARCHAR(50),
    "toStatus" VARCHAR(50) NOT NULL,
    "fromSubStatus" VARCHAR(100),
    "toSubStatus" VARCHAR(100),
    "changedById" TEXT NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "documentType" VARCHAR(100) NOT NULL,
    "documentName" VARCHAR(255),
    "filePath" VARCHAR(500),
    "fileSize" BIGINT,
    "mimeType" VARCHAR(100),
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,
    "extractionStatus" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "verificationStatus" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "ocrData" JSONB,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_tasks" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "taskType" VARCHAR(100) NOT NULL,
    "taskTitle" VARCHAR(255),
    "taskDescription" TEXT,
    "assignedToId" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "automationMetadata" JSONB,

    CONSTRAINT "workflow_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationType" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(255),
    "body" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "loanId" TEXT,
    "userId" TEXT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "resourceType" VARCHAR(100),
    "resourceId" VARCHAR(255),
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_reports" (
    "id" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "creditScore" INTEGER,
    "triMergeScore" INTEGER,
    "reportData" JSONB,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "requestedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_logs" (
    "id" TEXT NOT NULL,
    "loanId" TEXT,
    "integrationType" VARCHAR(100) NOT NULL,
    "externalId" VARCHAR(255),
    "status" VARCHAR(50),
    "requestBody" JSONB,
    "responseBody" JSONB,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" TEXT NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "eventType" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "externalEventId" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" SERIAL NOT NULL,
    "configKey" VARCHAR(255) NOT NULL,
    "configValue" JSONB,
    "description" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_name_key" ON "user_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_tokenHash_key" ON "user_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "borrowers_email_key" ON "borrowers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "borrowers_ssnHash_key" ON "borrowers"("ssnHash");

-- CreateIndex
CREATE INDEX "borrowers_email_idx" ON "borrowers"("email");

-- CreateIndex
CREATE INDEX "borrowers_firstName_lastName_idx" ON "borrowers"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "loan_programs_programCode_key" ON "loan_programs"("programCode");

-- CreateIndex
CREATE INDEX "loan_programs_isActive_idx" ON "loan_programs"("isActive");

-- CreateIndex
CREATE INDEX "loan_programs_programCategory_idx" ON "loan_programs"("programCategory");

-- CreateIndex
CREATE UNIQUE INDEX "loan_applications_loanNumber_key" ON "loan_applications"("loanNumber");

-- CreateIndex
CREATE INDEX "loan_applications_loanNumber_idx" ON "loan_applications"("loanNumber");

-- CreateIndex
CREATE INDEX "loan_applications_status_loanOfficerId_updatedAt_idx" ON "loan_applications"("status", "loanOfficerId", "updatedAt");

-- CreateIndex
CREATE INDEX "loan_applications_borrowerId_idx" ON "loan_applications"("borrowerId");

-- CreateIndex
CREATE INDEX "loan_applications_status_idx" ON "loan_applications"("status");

-- CreateIndex
CREATE INDEX "loan_applications_createdAt_idx" ON "loan_applications"("createdAt");

-- CreateIndex
CREATE INDEX "loan_applications_programId_idx" ON "loan_applications"("programId");

-- CreateIndex
CREATE INDEX "loan_status_history_loanId_changedAt_idx" ON "loan_status_history"("loanId", "changedAt");

-- CreateIndex
CREATE INDEX "loan_status_history_changedById_idx" ON "loan_status_history"("changedById");

-- CreateIndex
CREATE INDEX "loan_status_history_changedAt_idx" ON "loan_status_history"("changedAt");

-- CreateIndex
CREATE INDEX "documents_loanId_documentType_idx" ON "documents"("loanId", "documentType");

-- CreateIndex
CREATE INDEX "documents_verificationStatus_idx" ON "documents"("verificationStatus");

-- CreateIndex
CREATE INDEX "documents_uploadedAt_idx" ON "documents"("uploadedAt");

-- CreateIndex
CREATE INDEX "documents_extractionStatus_loanId_idx" ON "documents"("extractionStatus", "loanId");

-- CreateIndex
CREATE INDEX "workflow_tasks_loanId_status_idx" ON "workflow_tasks"("loanId", "status");

-- CreateIndex
CREATE INDEX "workflow_tasks_dueDate_idx" ON "workflow_tasks"("dueDate");

-- CreateIndex
CREATE INDEX "workflow_tasks_assignedToId_status_idx" ON "workflow_tasks"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_loanId_createdAt_idx" ON "notifications"("loanId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "activities_loanId_createdAt_idx" ON "activities"("loanId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_userId_createdAt_idx" ON "activities"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_action_createdAt_idx" ON "activities"("action", "createdAt");

-- CreateIndex
CREATE INDEX "activities_createdAt_idx" ON "activities"("createdAt");

-- CreateIndex
CREATE INDEX "credit_reports_borrowerId_requestedAt_idx" ON "credit_reports"("borrowerId", "requestedAt");

-- CreateIndex
CREATE INDEX "credit_reports_loanId_idx" ON "credit_reports"("loanId");

-- CreateIndex
CREATE INDEX "integration_logs_loanId_createdAt_idx" ON "integration_logs"("loanId", "createdAt");

-- CreateIndex
CREATE INDEX "integration_logs_status_createdAt_idx" ON "integration_logs"("status", "createdAt");

-- CreateIndex
CREATE INDEX "integration_logs_integrationType_createdAt_idx" ON "integration_logs"("integrationType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_externalEventId_key" ON "webhook_events"("externalEventId");

-- CreateIndex
CREATE INDEX "webhook_events_source_createdAt_idx" ON "webhook_events"("source", "createdAt");

-- CreateIndex
CREATE INDEX "webhook_events_status_createdAt_idx" ON "webhook_events"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_configKey_key" ON "system_config"("configKey");

-- CreateIndex
CREATE INDEX "system_config_configKey_idx" ON "system_config"("configKey");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_programId_fkey" FOREIGN KEY ("programId") REFERENCES "loan_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loanOfficerId_fkey" FOREIGN KEY ("loanOfficerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "borrowers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_coBorrowerId_fkey" FOREIGN KEY ("coBorrowerId") REFERENCES "borrowers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_status_history" ADD CONSTRAINT "loan_status_history_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_status_history" ADD CONSTRAINT "loan_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tasks" ADD CONSTRAINT "workflow_tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reports" ADD CONSTRAINT "credit_reports_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "borrowers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reports" ADD CONSTRAINT "credit_reports_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reports" ADD CONSTRAINT "credit_reports_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_logs" ADD CONSTRAINT "integration_logs_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

┌─────────────────────────────────────────────────────────┐
│  Update available 5.22.0 -> 6.19.0                      │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
