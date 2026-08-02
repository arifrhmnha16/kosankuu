const fs = require('node:fs');
const path = require('node:path');
const { assertFails, assertSucceeds, initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');

const projectId = 'demo-manzsa-residence';
let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8') },
  });
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'tenant-1'), { uid: 'tenant-1', role: 'tenant', status: 'active', propertyId: 'manzsa' });
    await setDoc(doc(db, 'users', 'owner-1'), { uid: 'owner-1', role: 'owner', status: 'active', propertyId: 'manzsa' });
    await setDoc(doc(db, 'rooms', 'room-1'), { code: 'A01' });
  });
});

afterEach(async () => testEnv.clearFirestore());
afterAll(async () => testEnv.cleanup());

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'tenant-1'), { uid: 'tenant-1', role: 'tenant', status: 'active', propertyId: 'manzsa' });
    await setDoc(doc(db, 'users', 'owner-1'), { uid: 'owner-1', role: 'owner', status: 'active', propertyId: 'manzsa' });
    await setDoc(doc(db, 'rooms', 'room-1'), { code: 'A01' });
  });
}

beforeEach(seed);

test('unauthenticated user cannot read a user profile', async () => {
  await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'users', 'tenant-1')));
});

test('authenticated user can read their own profile', async () => {
  await assertSucceeds(getDoc(doc(testEnv.authenticatedContext('tenant-1').firestore(), 'users', 'tenant-1')));
});

test('authenticated user cannot read another profile', async () => {
  await assertFails(getDoc(doc(testEnv.authenticatedContext('tenant-1').firestore(), 'users', 'owner-1')));
});

test('authenticated user cannot create their profile', async () => {
  await assertFails(setDoc(doc(testEnv.authenticatedContext('new-user').firestore(), 'users', 'new-user'), { uid: 'new-user', role: 'tenant' }));
});

test('tenant cannot change their role', async () => {
  await assertFails(updateDoc(doc(testEnv.authenticatedContext('tenant-1').firestore(), 'users', 'tenant-1'), { role: 'owner' }));
});

test('owner client cannot change their role', async () => {
  await assertFails(updateDoc(doc(testEnv.authenticatedContext('owner-1').firestore(), 'users', 'owner-1'), { role: 'tenant' }));
});

test('all other collections remain inaccessible', async () => {
  await assertFails(getDoc(doc(testEnv.authenticatedContext('owner-1').firestore(), 'rooms', 'room-1')));
});
