import { render } from '@testing-library/react-native';
import { EmptyState, OfflineBanner } from '@/components/feedback';

describe('feedback states', () => {
  it('renders a specific empty state', () => {
    expect(render(<EmptyState title="Belum ada data" description="Data akan tampil di sini." />).getByText('Belum ada data')).toBeOnTheScreen();
  });

  it('can hide the offline banner', () => {
    expect(render(<OfflineBanner visible={false} />).queryByRole('alert')).toBeNull();
  });
});
