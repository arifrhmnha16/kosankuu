import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('exposes its label and handles a press', () => {
    const onPress = jest.fn();
    const screen = render(<Button label="Simpan perubahan" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Simpan perubahan' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled while loading', () => {
    const screen = render(<Button label="Menyimpan" loading />);
    expect(screen.getByRole('button', { name: 'Menyimpan' })).toBeDisabled();
  });
});
