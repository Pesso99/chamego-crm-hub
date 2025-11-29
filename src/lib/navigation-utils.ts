import { Monitor, Smartphone, Tablet, HelpCircle, Home, Package, ShoppingCart, FolderOpen } from 'lucide-react';

export function categorizePagePath(path: string): 'produto' | 'categoria' | 'checkout' | 'home' | 'outros' {
  const lowerPath = path.toLowerCase();
  
  if (lowerPath === '/' || lowerPath === '/home') return 'home';
  if (lowerPath.includes('/produto') || lowerPath.includes('/product')) return 'produto';
  if (lowerPath.includes('/categoria') || lowerPath.includes('/category')) return 'categoria';
  if (lowerPath.includes('/checkout') || lowerPath.includes('/cart') || lowerPath.includes('/carrinho')) return 'checkout';
  
  return 'outros';
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0s';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}min`;
  
  return `${minutes}min ${remainingSeconds}s`;
}

export function getDeviceIcon(deviceType: string | null) {
  const type = deviceType?.toLowerCase() || '';
  
  if (type.includes('mobile')) return Smartphone;
  if (type.includes('tablet')) return Tablet;
  if (type.includes('desktop') || type.includes('computer')) return Monitor;
  
  return HelpCircle;
}

export function getCategoryIcon(category: 'produto' | 'categoria' | 'checkout' | 'home' | 'outros') {
  switch (category) {
    case 'home':
      return Home;
    case 'produto':
      return Package;
    case 'categoria':
      return FolderOpen;
    case 'checkout':
      return ShoppingCart;
    default:
      return HelpCircle;
  }
}

export function calculateEngagementRate(views: number, users: number): number {
  if (users === 0) return 0;
  return Math.round((views / users) * 10) / 10;
}

export function formatPagePath(path: string, maxLength: number = 50): string {
  if (path.length <= maxLength) return path;
  return path.substring(0, maxLength - 3) + '...';
}

export function getCategoryBadgeColor(category: 'produto' | 'categoria' | 'checkout' | 'home' | 'outros'): string {
  switch (category) {
    case 'home':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'produto':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'categoria':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'checkout':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}
