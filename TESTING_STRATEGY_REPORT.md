Lexfix Testing Strategy Report

1. Executive Summary
This report outlines the comprehensive testing strategy implemented for the Lexfix platform. The strategy employs a multi-layered approach ensuring:

Functional Correctness (End-to-End & Unit Tests)
Inclusive Design (Accessibility Audits)
System Reliability (API Integration Tests)


2. Testing Levels & Tools

 A. End-to-End (E2E) Testing
Verify the application flows from a real user's perspective.
 Tool: Cypress

   User Registration & Onboarding
   Authentication (Login/Logout)
   Protected Route Navigation
   Dyslexia Font Toggle Functionality

 B. Accessibility (A11y) Testing
Ensure the platform is usable by users with diverse needs (WCAG 2.1 AA Compliance).
 Tool: cypress-axe (Axe-Core engine)

  Current Coverage: Public Pages (Landing, Login, Register).
                    Authenticated Student Pages (Student Dashboard,Line Reader Interface).

 C. Integration & API Testing
  Verify backend logic, data flow, and error handling.
 Tool: Postman & Newman (CLI)

   Auth Routes
   ADHD Routes
   Error Handling 


3. Execution Guide
To run the full suite:

1. Frontend & A11y:

   cd frontend
   npx cypress run
   
2. API Integration:
   
   newman run lexfix_api.postman_collection.json -e lexfix_local.postman_environment.json
   
