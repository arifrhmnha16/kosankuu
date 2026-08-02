const fs = require('node:fs');
const path = require('node:path');
const { assertFails, assertSucceeds, initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { deleteDoc, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } = require('firebase/firestore');
const { getBytes, ref, uploadBytes } = require('firebase/storage');

const projectId = 'demo-manzsa-residence';
const propertyId = 'manzsa-residence';
let testEnv;

const room = (overrides = {}) => ({
  propertyId, code: 'A01', name: 'Kamar A01', status: 'available', monthlyPrice: 1000000,
  capacity: 1, facilities: ['Wi-Fi'], description: 'Kamar nyaman dan terawat.', imageUrls: [],
  imageStoragePaths: [], isPublished: true, isDeleted: false,
  createdAt: Timestamp.fromMillis(1), updatedAt: Timestamp.fromMillis(1), ...overrides,
});

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8') },
    storage: { rules: fs.readFileSync(path.join(process.cwd(), 'storage.rules'), 'utf8') },
  });
});

beforeEach(async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const users = [
      ['tenant-1', 'tenant', 'active', propertyId], ['owner-1', 'owner', 'active', propertyId],
      ['owner-other', 'owner', 'active', 'other-property'], ['owner-inactive', 'owner', 'inactive', propertyId],
      ['owner-pending', 'owner', 'pending', propertyId],
    ];
    await Promise.all(users.map(([uid, role, status, property]) => setDoc(doc(db, 'users', uid), { uid, role, status, propertyId: property })));
    await setDoc(doc(db, 'properties', propertyId), { name: 'Manzsa Residence', isPublished: true });
    await setDoc(doc(db, 'properties', 'private-property'), { name: 'Private', isPublished: false });
    await setDoc(doc(db, 'properties', 'other-property'), { name: 'Other', isPublished: true });
    await setDoc(doc(db, 'properties', propertyId, 'rooms', 'public-room'), room());
    await setDoc(doc(db, 'properties', propertyId, 'rooms', 'private-room'), room({ isPublished: false }));
    await setDoc(doc(db, 'properties', propertyId, 'rooms', 'deleted-room'), room({ isDeleted: true }));
    await setDoc(doc(db, 'properties', 'other-property', 'rooms', 'other-room'), room({ propertyId: 'other-property', isPublished: false }));
    await uploadBytes(ref(context.storage(), `properties/${propertyId}/rooms/public-room/cover.jpg`), new Uint8Array([1]), { contentType: 'image/jpeg' });
  });
});

afterEach(async () => { await testEnv.clearFirestore(); await testEnv.clearStorage(); });
afterAll(async () => testEnv.cleanup());

const publicDb = () => testEnv.unauthenticatedContext().firestore();
const userDb = (uid) => testEnv.authenticatedContext(uid).firestore();
const roomRef = (db, id = 'public-room', property = propertyId) => doc(db, 'properties', property, 'rooms', id);

test('public reads a published property', async () => assertSucceeds(getDoc(doc(publicDb(), 'properties', propertyId))));
test('public cannot read an unpublished property', async () => assertFails(getDoc(doc(publicDb(), 'properties', 'private-property'))));
test('public reads a published non-deleted room', async () => assertSucceeds(getDoc(roomRef(publicDb()))));
test('public cannot read an unpublished room', async () => assertFails(getDoc(roomRef(publicDb(), 'private-room'))));
test('public cannot read a deleted room', async () => assertFails(getDoc(roomRef(publicDb(), 'deleted-room'))));
test('public cannot create or update a room', async () => {
  await assertFails(setDoc(roomRef(publicDb(), 'new-room'), room()));
  await assertFails(updateDoc(roomRef(publicDb()), { name: 'Changed' }));
});
test('tenant cannot read private room or write rooms', async () => {
  const db = userDb('tenant-1');
  await assertFails(getDoc(roomRef(db, 'private-room')));
  await assertFails(setDoc(roomRef(db, 'new-room'), room()));
  await assertFails(updateDoc(roomRef(db), { name: 'Changed' }));
});
test('active owner creates a room in own property', async () => {
  const data = room({ createdAt: serverTimestamp(), updatedAt: serverTimestamp(), isPublished: false });
  await assertSucceeds(setDoc(roomRef(userDb('owner-1'), 'new-room'), data));
});
test('active owner reads unpublished own room', async () => assertSucceeds(getDoc(roomRef(userDb('owner-1'), 'private-room'))));
test('active owner reads own property but cannot change the property document', async () => {
  const propertyRef = doc(userDb('owner-1'), 'properties', propertyId);
  await assertSucceeds(getDoc(propertyRef));
  await assertFails(updateDoc(propertyRef, { name: 'Changed by client' }));
});
test('active owner updates own room with server timestamp', async () => assertSucceeds(updateDoc(roomRef(userDb('owner-1')), { name: 'Updated', updatedAt: serverTimestamp() })));
test('owner cannot change propertyId', async () => assertFails(updateDoc(roomRef(userDb('owner-1')), { propertyId: 'other-property', updatedAt: serverTimestamp() })));
test('owner cannot hard-delete a room', async () => assertFails(deleteDoc(roomRef(userDb('owner-1')))));
test('owner cannot access another property room', async () => assertFails(getDoc(roomRef(userDb('owner-1'), 'other-room', 'other-property'))));
test.each(['owner-inactive', 'owner-pending'])('%s cannot write', async (uid) => assertFails(updateDoc(roomRef(userDb(uid)), { name: 'Blocked', updatedAt: serverTimestamp() })));

test('public reads a room marketing image', async () => assertSucceeds(getBytes(ref(testEnv.unauthenticatedContext().storage(), `properties/${propertyId}/rooms/public-room/cover.jpg`))));
test('public cannot upload', async () => assertFails(uploadBytes(ref(testEnv.unauthenticatedContext().storage(), `properties/${propertyId}/rooms/public-room/public.jpg`), new Uint8Array([1]), { contentType: 'image/jpeg' })));
test('owner uploads a valid own-property image', async () => assertSucceeds(uploadBytes(ref(testEnv.authenticatedContext('owner-1').storage(), `properties/${propertyId}/rooms/public-room/owner.webp`), new Uint8Array([1]), { contentType: 'image/webp' })));
test('owner cannot upload to another property', async () => assertFails(uploadBytes(ref(testEnv.authenticatedContext('owner-1').storage(), 'properties/other-property/rooms/other-room/file.jpg'), new Uint8Array([1]), { contentType: 'image/jpeg' })));
test('non-image upload is rejected', async () => assertFails(uploadBytes(ref(testEnv.authenticatedContext('owner-1').storage(), `properties/${propertyId}/rooms/public-room/file.txt`), new Uint8Array([1]), { contentType: 'text/plain' })));
test('upload larger than 5 MB is rejected', async () => assertFails(uploadBytes(ref(testEnv.authenticatedContext('owner-1').storage(), `properties/${propertyId}/rooms/public-room/large.jpg`), new Uint8Array(5 * 1024 * 1024 + 1), { contentType: 'image/jpeg' })));
test('path outside room images remains denied', async () => assertFails(uploadBytes(ref(testEnv.authenticatedContext('owner-1').storage(), 'avatars/owner-1.jpg'), new Uint8Array([1]), { contentType: 'image/jpeg' })));

test('Milestone 2 user rules remain protected', async () => {
  await assertSucceeds(getDoc(doc(userDb('tenant-1'), 'users', 'tenant-1')));
  await assertFails(getDoc(doc(userDb('tenant-1'), 'users', 'owner-1')));
  await assertFails(updateDoc(doc(userDb('owner-1'), 'users', 'owner-1'), { role: 'tenant' }));
});
