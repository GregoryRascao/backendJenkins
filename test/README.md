# Test Suite Documentation

This folder contains all testing infrastructure and test files for the backend API.

## 📁 Directory Structure

```
test/
├── README.md                      # This file
├── setupTests.ts                  # Jest global setup
├── test-data-source.ts           # SQLite test database configuration
├── test.sqlite                    # SQLite test database (auto-generated, gitignored)
│
├── controllers/                   # Unit tests for controllers
│   ├── item.controller.spec.ts
│   └── user.controller.spec.ts
│
├── integration/                   # Integration tests (API endpoints)
│   ├── api.spec.ts               # Legacy tests (skipped)
│   └── basket.user.spec.ts       # 8 comprehensive API tests
│
├── repository/                    # Repository tests with real database
│   └── repository.spec.ts        # 22 database operation tests
│
└── Documentation/
    ├── TEST_SUMMARY.md           # Quick reference
    ├── TESTING_COMPLETE.md       # Comprehensive guide
    └── VERIFICATION_CHECKLIST.md # Implementation checklist
```

## 🧪 Test Categories

### 1. Controller Tests (6 tests)
**Location:** `test/controllers/`

Unit tests for controller logic with mocked dependencies.
- User controller operations
- Item controller operations

### 2. Integration Tests (8 tests)
**Location:** `test/integration/basket.user.spec.ts`

API endpoint tests using mocked repositories:
- ✅ Register a new user
- ✅ Get basket empty
- ✅ Add an item to the basket
- ✅ Remove an item from the basket
- ✅ Get one item details
- ✅ Get one user details
- ✅ Add an item with invalid quantity
- ✅ Add a non-existent item

### 3. Repository Tests (22 tests)
**Location:** `test/repository/repository.spec.ts`

Database operation tests using real SQLite database:

#### User Repository (5 tests)
- Create, find, update, delete operations
- Search by username

#### Item Repository (6 tests)
- Create, find, update, delete operations
- Get all items, search by name

#### Basket Repository (7 tests)
- Create basket for user
- Find basket by id/user
- Add/update/remove items from basket
- Test relationships

#### BasketItem Repository (4 tests)
- Create, find, delete basket items
- Get all items in a basket

## 🗄️ Database Configuration

### Test Database
- **Type:** SQLite
- **Location:** `test/test.sqlite` (auto-generated)
- **Configuration:** `test/test-data-source.ts`
- **Features:**
  - Auto-schema synchronization
  - Automatic data cleanup after each test
  - No external dependencies
  - Perfect for CI/CD

### Database Lifecycle
```typescript
beforeAll()  → Initialize TestDataSource
beforeEach() → (Repositories ready for use)
afterEach()  → Clean up all test data
afterAll()   → Destroy TestDataSource connection
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Repository tests only
npm test -- test/repository/repository.spec.ts

# Integration tests only
npm test -- test/integration/basket.user.spec.ts

# Controller tests only
npm test -- test/controllers/

# Single test file
npm test -- test/controllers/user.controller.spec.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## 📊 Current Test Status

```
Test Suites: 4 passed, 1 skipped
Total Tests: 36 passed, 1 skipped
Execution Time: ~3 seconds
Status: ✅ ALL PASSING
```

## 🔧 Test Configuration

### Jest Setup
Global test setup is configured in `setupTests.ts`:
- Mocks AppDataSource.initialize()
- Mocks AppDataSource.getRepository()
- Sets up JWT verification mock
- Configures test timeout

### TypeScript Configuration
Tests use the project's `tsconfig.json` for TypeScript compilation.

## 📝 Writing New Tests

### Repository Test Example
```typescript
test('should create a new entity', async () => {
  const entity = repository.create({
    field1: 'value1',
    field2: 'value2',
  })
  
  const saved = await repository.save(entity)
  
  expect(saved.id).toBeDefined()
  expect(saved.field1).toBe('value1')
})
```

### Integration Test Example
```typescript
test('should handle API endpoint', async () => {
  const res = await request(app)
    .get('/endpoint')
    .set('authorization', 'Bearer token-mock')
  
  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
})
```

## 🛡️ Best Practices

### DO:
✅ Clean up test data after each test
✅ Use descriptive test names
✅ Test both success and failure scenarios
✅ Mock external dependencies
✅ Use async/await for asynchronous operations
✅ Keep tests independent and isolated

### DON'T:
❌ Share state between tests
❌ Test implementation details
❌ Make tests depend on execution order
❌ Use real external services
❌ Leave database connections open
❌ Commit test database files

## 🔍 Troubleshooting

### Tests Failing After Changes
1. Clear Jest cache: `npm test -- --clearCache`
2. Check if database migrations are needed
3. Verify all imports are correct
4. Ensure test data cleanup is working

### Database Issues
1. Delete `test.sqlite` and let it regenerate
2. Check `test-data-source.ts` configuration
3. Verify entities are properly imported

### Timeout Issues
1. Increase test timeout in individual tests
2. Check for unclosed database connections
3. Look for infinite loops or hanging promises

## 📚 Additional Documentation

- **Quick Reference:** `TEST_SUMMARY.md`
- **Complete Guide:** `TESTING_COMPLETE.md`
- **Verification Checklist:** `VERIFICATION_CHECKLIST.md`

## 🔄 Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies required
- SQLite database is portable
- Fast execution (~3 seconds)
- Deterministic results

## 📧 Support

For questions or issues with tests:
1. Check the documentation in this folder
2. Review existing test patterns
3. Verify your environment setup

---

**Last Updated:** February 26, 2026
**Test Suite Version:** 1.0.0
**Status:** ✅ Production Ready

