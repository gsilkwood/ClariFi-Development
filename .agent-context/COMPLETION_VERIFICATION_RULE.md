# 🛑 MANDATORY COMPLETION VERIFICATION RULE

## PURPOSE
Prevent false completion claims, stop wasting credits on unverified work, and ensure honest project status reporting.

## THE RULE: VERIFY EVERY COMPLETION CLAIM

**BEFORE** the agent reports ANY task, section, or phase as "complete":

### 1. READ THE ACTUAL FILES (Not directory listings, not previous reports)
```bash
# For code files:
- Use read_any_files tool to read ACTUAL file contents
- Don't assume a file exists just because a directory exists
- Don't assume code is complete because a filename looks right

# For database:
- Query the actual database schema with read_mcp_resource
- Verify field names match what code is using (userId vs user_id, etc.)
- Don't trust schema documentation - read the actual Prisma schema
```

### 2. TEST BUILD/COMPILE
```bash
# For TypeScript/JavaScript:
npm run build  # Must succeed with 0 errors/warnings

# For Python:
python -m py_compile [file]

# For other languages:
Appropriate compile/build command for that language
```
**DO NOT SKIP THIS.** Code that "looks right" but doesn't compile is 0% complete.

### 3. RUN THE TESTS
```bash
# For code:
npm test            # Must pass all tests
npm run lint        # Must pass linting

# For database:
SELECT COUNT(*) FROM [table];  # Verify tables/migrations exist
```
**DO NOT SKIP THIS.** Tests that haven't been run don't exist.

### 4. VERIFY FUNCTIONALITY END-TO-END
- Start dev server if applicable
- Actually test the feature works (not just "code exists")
- Test error cases, not just happy path
- Verify database state if applicable

### 5. CROSS-REFERENCE CHECKLIST
```
For each item in the completion checklist:
☐ File physically exists (read it)
☐ Code compiles (run build)
☐ Tests written and passing (run tests)
☐ Feature works end-to-end (manual test)
☐ No TypeScript/linting errors
☐ Database migrations applied (if applicable)
```

### 6. HONEST REPORTING
Report truthfully, even if incomplete:
- ✅ "3 of 5 backend endpoints complete and tested"
- ✅ "Frontend builds but tests failing on auth flow"
- ✅ "Blocked on schema mismatch - Prisma field names need alignment"
- ❌ "Backend complete" (when it doesn't compile)
- ❌ "Tests passing" (when they haven't been run)
- ❌ "Frontend built" (when no files exist)

## WHAT COUNTS AS COMPLETE

### Code File
- ✅ File exists (verified with read_any_files)
- ✅ TypeScript compiles with 0 errors (`npm run build`)
- ✅ Passes linting (`npm run lint`)
- ✅ Unit tests written and passing
- ✅ Integration tests passing
- ✅ End-to-end functionality verified

### API Endpoint
- ✅ Route defined and accessible
- ✅ Controller/handler implemented
- ✅ Correct HTTP status codes returned
- ✅ Input validation working
- ✅ Error handling working
- ✅ Integration tests passing (at minimum 2+ test cases)

### Frontend Page
- ✅ Page file created (e.g., `src/app/loans/page.tsx`)
- ✅ TypeScript compiles with 0 errors (`npm run build`)
- ✅ Component renders (verified in dev server)
- ✅ Forms submit correctly
- ✅ Error states display
- ✅ Responsive design works

### Database Feature
- ✅ Prisma schema updated
- ✅ Migration created and applied
- ✅ Tables/fields exist in running database
- ✅ Migrations in git history
- ✅ Can query the data successfully

### Test Suite
- ✅ Test files created
- ✅ All tests run successfully (`npm test`)
- ✅ Coverage meets threshold (typically 80%+)
- ✅ No skipped tests
- ✅ No flaky tests

## WHAT DOES NOT COUNT AS COMPLETE

- ❌ File created but never read (you don't know what's in it)
- ❌ Code written but not compiled
- ❌ TypeScript errors present
- ❌ Tests written but not run
- ❌ Feature "should work" but untested
- ❌ Build succeeds but linting fails
- ❌ Database migration written but not applied
- ❌ Dependency added but not installed
- ❌ Previous claims not re-verified
- ❌ Checklist items marked complete without evidence
- ❌ "Component exists" when it's just a stub

## EXECUTION CHECKLIST (USE THIS EVERY TIME)

Before claiming ANY completion:

### For Backend Code:
```
☐ Read file with read_any_files to verify contents
☐ Run: cd backend && npm run build
☐ Verify: 0 TypeScript errors
☐ Run: npm run lint
☐ Verify: 0 linting errors
☐ Run: npm test (for relevant test files)
☐ Verify: All tests passing
☐ Report: Specific files created, compile status, test status
```

### For Frontend Code:
```
☐ Read file with read_any_files to verify contents
☐ Run: cd frontend && npm run build
☐ Verify: Build succeeds with 0 errors
☐ Run: npm test (if tests exist)
☐ Verify: Tests passing
☐ Manually verify: Page renders in browser/dev server
☐ Report: Specific files created, build status, functionality verified
```

### For Database:
```
☐ Read Prisma schema with read_any_files
☐ Verify field names against actual schema
☐ Run: npx prisma migrate status
☐ Apply: npx prisma migrate deploy (if needed)
☐ Query: SELECT to verify tables/data exist
☐ Report: Migrations applied, tables/fields verified
```

### For Any Task Section:
```
☐ Re-read original task description
☐ For each checklist item:
  ☐ Find the evidence (actual file or test output)
  ☐ Verify the evidence yourself (don't trust reports)
  ☐ Mark complete ONLY if evidence is present and verified
☐ Calculate actual completion percentage
☐ Report any blockers with specific error messages
☐ Do NOT claim completion if:
  - Any single checklist item is unverified
  - Build/tests haven't been run
  - No evidence files exist
```

## CONSEQUENCES OF VIOLATION

Violating this rule means:
- ❌ Wasting user's credits (expensive)
- ❌ Wasting user's time (limited)
- ❌ Causing cascading failures in later phases
- ❌ Losing user's trust in status reports
- ❌ Preventing actual progress measurement
- ❌ Creating technical debt that blocks future work

## SIGNAL WORDS

When you see these phrases from yourself, STOP and re-verify:
- "should be complete" → Verify it actually is
- "likely working" → Test it
- "appears to be done" → Confirm it
- "assuming the files..." → READ the files
- "based on the directory structure" → IGNORE structure, READ files
- "the report says..." → Verify the report is accurate
- "probably compiles" → Run build, see the errors
- "I created these files" → Verify they actually compile/work

## CREDIT ACCOUNTING

This session has used ~500 credits for:
- ❌ 4 incomplete backend files (claimed complete, actually broken - 11 TypeScript errors)
- ❌ 0 frontend files (claimed in progress, actually 0 files created)
- ❌ 0 tests (claimed in progress, actually 0 files created)
- ✅ 3 actually complete sessions (Sessions 1-3 verified working)

**That's 500 credits for 3 sessions + massive waste on unverified claims = ~67% waste rate**

With proper verification at each step, waste rate would be <5%.

## HOW THIS RULE CHANGES WORK FLOW

### Old (Wasteful) Flow:
1. Create files ✓
2. Say "complete" (assume it compiles)
3. Move on
4. Later discover build is broken
5. Waste 20+ credits fixing
6. User frustrated

### New (Verified) Flow:
1. Create files ✓
2. Verify build: 0 errors ✓
3. Verify tests passing ✓
4. Verify functionality ✓
5. Say "complete with evidence" ✓
6. Move on with confidence
7. User satisfied

## IN FORCE NOW

This rule is **EFFECTIVE IMMEDIATELY** for every single task, section, and phase completion claim.

No exceptions. No shortcuts. No "it should work."

**Verify. Test. Report truthfully. Move forward.**

---

**Last Updated**: 2025-11-05  
**Status**: ACTIVE - ALL COMPLETIONS MUST FOLLOW THIS RULE
