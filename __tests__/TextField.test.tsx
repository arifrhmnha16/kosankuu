import { render } from '@testing-library/react-native';
import { TextField } from '@/components/ui/TextField';

describe('TextField', () => {
  it('renders an accessible label and error', () => {
    const screen = render(<TextField label="Email" error="Email wajib diisi." />);
    expect(screen.getByLabelText('Email').props['aria-invalid']).toBe(true);
    expect(screen.getByText('Email wajib diisi.')).toBeOnTheScreen();
  });
});
