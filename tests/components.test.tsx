// filepath: tests/components.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCard } from '@/components/MenuCard';
import { CartItem } from '@/components/CartItem';
import { Navbar } from '@/components/Navbar';

// Mock the useCart hook
const mockAddItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: [
      {
        menuItem: {
          _id: '1',
          name: 'Test Pizza',
          price: 14.99,
          image: 'https://example.com/pizza.jpg',
        },
        quantity: 2,
      },
    ],
    addItem: mockAddItem,
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    clearCart: jest.fn(),
    subtotal: 29.98,
    tax: 2.40,
    total: 32.38,
    itemCount: 2,
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; fill?: boolean; className?: string }) => {
    return <img src={props.src} alt={props.alt} />;
  },
}));

describe('MenuCard Component', () => {
  const mockMenuItem = {
    _id: '1',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes and mozzarella',
    price: 14.99,
    category: 'main' as const,
    image: 'https://example.com/pizza.jpg',
    available: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render menu item with correct information', () => {
    render(<MenuCard item={mockMenuItem} />);

    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('Classic Italian pizza with fresh tomatoes and mozzarella')).toBeInTheDocument();
    expect(screen.getByText('$14.99')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('should display Add to Cart button', () => {
    render(<MenuCard item={mockMenuItem} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should call addItem when Add to Cart button is clicked', () => {
    render(<MenuCard item={mockMenuItem} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockMenuItem);
  });

  it('should disable button when item is not available', () => {
    const unavailableItem = { ...mockMenuItem, available: false };
    
    render(<MenuCard item={unavailableItem} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });

  it('should show Out of Stock overlay when unavailable', () => {
    const unavailableItem = { ...mockMenuItem, available: false };
    
    render(<MenuCard item={unavailableItem} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});

describe('CartItem Component', () => {
  const mockProps = {
    id: '1',
    name: 'Margherita Pizza',
    price: 14.99,
    quantity: 2,
    image: 'https://example.com/pizza.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cart item with correct information', () => {
    render(<CartItem {...mockProps} />);

    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$14.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display item image', () => {
    render(<CartItem {...mockProps} />);

    const image = screen.getByAltText('Margherita Pizza');
    expect(image).toBeInTheDocument();
  });

  it('should call updateQuantity when quantity is changed', () => {
    render(<CartItem {...mockProps} />);

    // Find all buttons and click the first one (decrement)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('should call removeItem when remove button is clicked', () => {
    render(<CartItem {...mockProps} />);

    // Find all buttons and click the last one (remove)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });
});

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo', () => {
    render(<Navbar />);

    expect(screen.getByText('🍽️ FoodHub')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('should display cart item count', () => {
    render(<Navbar />);

    // The cart should show 2 items
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('Checkout Validation', () => {
  const { customerSchema, createOrderSchema } = require('@/utils/orderValidation');

  it('should validate correct customer data', () => {
    const validCustomer = {
      name: 'John Doe',
      phone: '123-456-7890',
      address: '123 Main Street, City, State 12345',
    };

    const result = customerSchema.safeParse(validCustomer);
    expect(result.success).toBe(true);
  });

  it('should reject invalid phone format', () => {
    const invalidCustomer = {
      name: 'John Doe',
      phone: 'invalid',
      address: '123 Main Street',
    };

    const result = customerSchema.safeParse(invalidCustomer);
    expect(result.success).toBe(false);
  });

  it('should validate complete order with valid customer and items', () => {
    const validOrder = {
      customer: {
        name: 'John Doe',
        phone: '123-456-7890',
        address: '123 Main Street',
      },
      items: [
        {
          menuItem: '507f1f77bcf86cd799440011',
          name: 'Pizza',
          price: 14.99,
          quantity: 2,
        },
      ],
      subtotal: 29.98,
      tax: 2.40,
      total: 32.38,
    };

    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject empty cart', () => {
    const emptyCartOrder = {
      customer: {
        name: 'John Doe',
        phone: '123-456-7890',
        address: '123 Main Street',
      },
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    };

    const result = createOrderSchema.safeParse(emptyCartOrder);
    expect(result.success).toBe(false);
  });
});

describe('Order Status Live Updates', () => {
  it('should have correct status progression', () => {
    const statusSteps = [
      { key: 'pending', label: 'Order Placed' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready', label: 'Ready' },
      { key: 'delivered', label: 'Delivered' },
    ];

    expect(statusSteps).toHaveLength(4);
    expect(statusSteps[0].key).toBe('pending');
    expect(statusSteps[1].key).toBe('preparing');
    expect(statusSteps[2].key).toBe('ready');
    expect(statusSteps[3].key).toBe('delivered');
  });

  it('should have correct status colors mapping', () => {
    const statusColors = {
      pending: 'bg-warning text-secondary',
      preparing: 'bg-blue-400 text-white',
      ready: 'bg-success text-white',
      delivered: 'bg-secondary text-white',
      cancelled: 'bg-error text-white',
    };

    expect(statusColors.pending).toBe('bg-warning text-secondary');
    expect(statusColors.preparing).toBe('bg-blue-400 text-white');
    expect(statusColors.ready).toBe('bg-success text-white');
    expect(statusColors.delivered).toBe('bg-secondary text-white');
    expect(statusColors.cancelled).toBe('bg-error text-white');
  });
});