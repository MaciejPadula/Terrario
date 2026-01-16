import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Box, Flex, IconButton, Text, VStack, HStack } from '@chakra-ui/react';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: '🏠', label: t('nav.dashboard'), path: '/' },
    { icon: '🦎', label: t('nav.animals'), path: '/animals' },
    { icon: '📋', label: t('nav.lists'), path: '/lists' },
    { icon: '🌡️', label: t('nav.monitoring'), path: '/monitoring' },
    { icon: '📅', label: t('nav.schedule'), path: '/schedule' },
    { icon: '📊', label: t('nav.stats'), path: '/stats' },
    { icon: '⚙️', label: t('nav.settings'), path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <Flex className="main-layout">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <Box
          className="sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Box
        className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        width={isSidebarCollapsed ? '80px' : '260px'}
      >
        <Flex className="sidebar-header" justify="space-between" align="center">
          {!isSidebarCollapsed && (
            <HStack gap={2}>
              <Text fontSize="2xl" className="logo-icon">
                🌿
              </Text>
              <Text fontSize="xl" fontWeight="bold" className="logo-text">
                Terrario
              </Text>
            </HStack>
          )}
          <IconButton
            aria-label={t('nav.toggleSidebar')}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            size="sm"
            variant="ghost"
            className="toggle-button"
          >
            {isSidebarCollapsed ? '→' : '←'}
          </IconButton>
        </Flex>

        <VStack className="nav-items" gap={2} align="stretch">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </VStack>

        <Box className="sidebar-footer">
          <Flex
            className="user-profile"
            align="center"
            gap={3}
            padding={3}
            borderRadius="lg"
          >
            <Box
              className="user-avatar"
              bg="green.500"
              color="white"
              width="40px"
              height="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              fontWeight="bold"
            >
              {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </Box>
            {!isSidebarCollapsed && (
              <Box flex="1" overflow="hidden">
                <Text fontSize="sm" fontWeight="medium" className="text-ellipsis">
                  {user?.firstName || user?.email}
                </Text>
                <Text fontSize="xs" color="gray.500" className="text-ellipsis">
                  {user?.email}
                </Text>
              </Box>
            )}
          </Flex>
          <button
            onClick={handleLogout}
            className="logout-button"
            title={isSidebarCollapsed ? t('nav.logout') : undefined}
          >
            <span className="nav-icon">🚪</span>
            {!isSidebarCollapsed && <span>{t('nav.logout')}</span>}
          </button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Flex className="content-area" direction="column" flex="1">
        {/* Header */}
        <Box className="header">
          <Flex justify="space-between" align="center">
            {/* Mobile Menu Button */}
            <IconButton
              aria-label={t('nav.openMenu')}
              onClick={toggleMobileSidebar}
              className="mobile-menu-button"
              size="md"
              variant="ghost"
            >
              ☰
            </IconButton>

            <Box>
              <Text fontSize="2xl" fontWeight="bold" className="page-title">
                {navItems.find((item) => item.path === location.pathname)?.label || t('nav.dashboard')}
              </Text>
              <Text fontSize="sm" color="gray.500" className="page-subtitle">
                {t('nav.manageCollection')}
              </Text>
            </Box>
            <HStack gap={3}>
              <button className="icon-button" title={t('nav.notifications')}>
                🔔
              </button>
              <button className="icon-button" title={t('nav.help')}>
                ❓
              </button>
            </HStack>
          </Flex>
        </Box>

        {/* Page Content */}
        <Box className="page-content">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
