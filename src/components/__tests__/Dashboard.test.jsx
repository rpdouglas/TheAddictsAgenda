// src/components/__tests__/Dashboard.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../Dashboard.jsx';

// Mock the onNavigate function
const mockOnNavigate = vi.fn();
const sobrietyStartDate = new Date('2023-01-01');

describe('Dashboard Component', () => {
  it('renders the sobriety tracker and menu items', () => {
    render(<Dashboard onNavigate={mockOnNavigate} sobrietyStartDate={sobrietyStartDate} />);

    // Check for a known menu item
    expect(screen.getByText('Daily Journal')).toBeInTheDocument();
    expect(screen.getByText('My Goals')).toBeInTheDocument();
    expect(screen.getByText('Coping Cards')).toBeInTheDocument();

    // Check that the sobriety tracker is rendering something
    expect(screen.getByText('You are on your path')).toBeInTheDocument();
  });
});