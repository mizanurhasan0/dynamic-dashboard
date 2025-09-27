export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: MenuItem[];
    badge?: string;
    disabled?: boolean;
}

export const menuData: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: '/',
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: 'BarChart3',
        children: [
            {
                id: 'reports',
                label: 'Reports',
                icon: 'FileText',
                href: '/analytics/reports',
            },
            {
                id: 'insights',
                label: 'Insights',
                icon: 'TrendingUp',
                href: '/analytics/insights',
            },
            {
                id: 'metrics',
                label: 'Metrics',
                icon: 'Activity',
                href: '/analytics/metrics',
            },
        ],
    },
    {
        id: 'users',
        label: 'Users',
        icon: 'Users',
        children: [
            {
                id: 'user-list',
                label: 'User List',
                icon: 'UserCheck',
                href: '/users/list',
            },
            {
                id: 'user-roles',
                label: 'Roles & Permissions',
                icon: 'Shield',
                href: '/users/roles',
            },
            {
                id: 'user-groups',
                label: 'Groups',
                icon: 'UserCog',
                href: '/users/groups',
            },
        ],
    },
    {
        id: 'content',
        label: 'Content',
        icon: 'FileText',
        children: [
            {
                id: 'posts',
                label: 'Posts',
                icon: 'Edit3',
                href: '/content/posts',
                badge: '12',
            },
            {
                id: 'pages',
                label: 'Pages',
                icon: 'File',
                href: '/content/pages',
            },
            {
                id: 'media',
                label: 'Media Library',
                icon: 'Image',
                href: '/content/media',
            },
        ],
    },
    {
        id: 'ecommerce',
        label: 'E-commerce',
        icon: 'ShoppingCart',
        children: [
            {
                id: 'products',
                label: 'Products',
                icon: 'Package',
                href: '/ecommerce/products',
            },
            {
                id: 'orders',
                label: 'Orders',
                icon: 'ShoppingBag',
                href: '/ecommerce/orders',
                badge: '5',
            },
            {
                id: 'inventory',
                label: 'Inventory',
                icon: 'Warehouse',
                href: '/ecommerce/inventory',
            },
            {
                id: 'customers',
                label: 'Customers',
                icon: 'UserPlus',
                href: '/ecommerce/customers',
            },
        ],
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'Settings',
        children: [
            {
                id: 'general',
                label: 'General',
                icon: 'Sliders',
                href: '/settings/general',
            },
            {
                id: 'appearance',
                label: 'Appearance',
                icon: 'Palette',
                href: '/settings/appearance',
            },
            {
                id: 'security',
                label: 'Security',
                icon: 'Lock',
                href: '/settings/security',
            },
            {
                id: 'integrations',
                label: 'Integrations',
                icon: 'Zap',
                href: '/settings/integrations',
            },
        ],
    },
    {
        id: 'help',
        label: 'Help & Support',
        icon: 'HelpCircle',
        href: '/help',
    },
];
