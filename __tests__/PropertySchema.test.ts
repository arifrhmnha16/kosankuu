import { Timestamp } from 'firebase/firestore';
import { parsePropertyDocument } from '@/features/properties/schemas/propertySchema';

const valid = { name: 'Manzsa Residence', shortDescription: 'Hunian nyaman', address: 'Jatiwangi', locationLabel: 'Jatiwangi', galleryImageUrls: [], facilities: [], highlights: [], faq: [], isPublished: true, createdAt: new Timestamp(1, 0), updatedAt: new Timestamp(1, 0) };

test('property parser accepts a valid Firestore document', () => expect(parsePropertyDocument('manzsa-residence', valid)?.id).toBe('manzsa-residence'));
test('property parser rejects invalid primary data', () => expect(parsePropertyDocument('manzsa-residence', { ...valid, name: '' })).toBeNull());
