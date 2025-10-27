import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BreathingExercise from '../BreathingExercise.jsx'; // Default import

// --- Mocks ---
vi.mock('../BreathingExercise.css', () => ({ default: {} }));
vi.mock('../../utils/icons.jsx', () => ({
    ArrowLeftIcon: () => <svg data-testid="arrow-left-icon" />,
}));

// --- Tests ---

describe('BreathingExercise Component', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with default state (Box Breathing)', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    expect(screen.getByText('Breathing Exercise')).toBeInTheDocument();
    // Use querySelector for more specific targeting if needed, but getByRole is often better
    expect(screen.getByRole('button', { name: 'Box Breathing' })).toHaveClass('active');
    expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument(); // Initial countdown
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('switches to 4-7-8 Breathing when selected', () => {
    render(<BreathingExercise onBack={mockOnBack} />);

    const button478 = screen.getByRole('button', { name: '4-7-8 Breathing' });
    fireEvent.click(button478);

    // Check that the correct button has the 'active' class
    expect(button478).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Box Breathing' })).not.toHaveClass('active');
    expect(screen.getByText('Breathe In...')).toBeInTheDocument(); // Check phase reset
    expect(screen.getByText('4')).toBeInTheDocument(); // Check countdown reset
  });

  it('starts and stops the timer', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('4')).toBeInTheDocument();
    const stopButton = screen.getByRole('button', { name: 'Stop' });
    fireEvent.click(stopButton);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('progresses through Box Breathing phases correctly', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);

    expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });

    expect(screen.getByText('Hold...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });

    expect(screen.getByText('Breathe Out...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
     act(() => { vi.advanceTimersByTime(4000); });

    // Find the second "Hold..." phase text more reliably
    expect(screen.getAllByText('Hold...').length).toBeGreaterThanOrEqual(1); // Check it appears
    expect(screen.getByText('4')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });

    expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('progresses through 4-7-8 Breathing phases correctly', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    const button478 = screen.getByRole('button', { name: '4-7-8 Breathing' });
    fireEvent.click(button478);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);

    expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });

    expect(screen.getByText('Hold...')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(7000); });

    expect(screen.getByText('Breathe Out...')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
     act(() => { vi.advanceTimersByTime(8000); });

    expect(screen.getByText('Breathe In...')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    const backButton = screen.getByRole('button', { name: /Back to Coping Tools/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('disables exercise selection buttons while running', () => {
    render(<BreathingExercise onBack={mockOnBack} />);
    const startButton = screen.getByRole('button', { name: 'Start' });
    fireEvent.click(startButton);
    expect(screen.getByRole('button', { name: 'Box Breathing' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '4-7-8 Breathing' })).toBeDisabled();
    const stopButton = screen.getByRole('button', { name: 'Stop' });
    fireEvent.click(stopButton);
    expect(screen.getByRole('button', { name: 'Box Breathing' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: '4-7-8 Breathing' })).not.toBeDisabled();
  });
});

