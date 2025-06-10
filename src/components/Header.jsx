import React from 'react';
import { useState, useEffect } from 'react';
import { slide as Menu } from 'react-burger-menu';
import MetallicPaint from './MetallicPaint';
import logo from '../assets/carbon.svg';
import { parseLogoImage } from './MetallicPaint';

const Header = () => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const createLogoImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Load the actual SVG logo
        const response = await fetch(logo);
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        
        const parsedData = await parseLogoImage(blob);
        
        if (parsedData && parsedData.imageData) {
          setImageData(parsedData.imageData);
        } else {
          throw new Error('No image data returned from parseLogoImage');
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    createLogoImage();
  }, []);

  const handleExportPDFs = async () => {
    // Implementation for PDF export via email
    console.log('Exporting PDFs...');
    setMenuOpen(false); // Close menu after action
  };

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Custom styles for the burger menu
  const styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '32px',
      height: '24px',
      right: '16px',
      top: '18px',
      zIndex: '99999'
    },
    bmBurgerBars: {
      background: '#ffffff',
      height: '2px',
      borderRadius: '1px'
    },
    bmBurgerBarsHover: {
      background: '#ffffff'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
      right: '16px',
      top: '16px'
    },
    bmCross: {
      background: '#ffffff',
      height: '2px'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      top: '0',
      right: '0'
    },
    bmMenu: {
      background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
      width: '320px',
      maxWidth: '90vw'
    },
    bmMorphShape: {
      fill: 'rgba(0, 0, 0, 0.8)'
    },
    bmItemList: {
      color: '#ffffff',
      padding: '0.8em'
    },
    bmItem: {
      display: 'block',
      textDecoration: 'none',
      marginBottom: '16px',
      color: 'rgba(255, 255, 255, 0.9)',
      padding: '12px 16px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      border: '1px solid transparent'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      top: '0',
      left: '0'
    }
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[99999] justify-center py-2"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          height: '60px'
        }}
      >
        <div className=" h-full flex items-center justify-center px-4 relative">
          {/* Logo in center */}
          <a href="https://carbonedev.com" className="block hover:opacity-80 transition-opacity">
            <div 
              className="relative flex items-center justify-center overflow-hidden"
              style={{ 
                width: '240px',
                height: '60px'
              }}
            >
              {!isLoading && imageData && !hasError ? (
                <MetallicPaint 
                  imageData={imageData}
                  width={240}
                  height={45}
                  params={{
                    patternScale: 2.8,
                    refraction: 0.015,
                    edge: 0,
                    patternBlur: 0.005,
                    liquid: 0.07,
                    speed: 0.3
                  }}
                />
              ) : (
                <span className="text-white font-bold tracking-wider text-2xl">
                  CARBONE
                </span>
              )}
            </div>
          </a>
        </div>
      </header>

      {/* React Burger Menu */}
      <Menu 
        right
        isOpen={menuOpen}
        onStateChange={handleStateChange}
        styles={styles}
        customBurgerIcon={false} // We'll use the default burger icon
        customCrossIcon={false}  // We'll use the default cross icon
        disableAutoFocus
      >
        {/* Menu Header */}
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-white text-xl font-semibold tracking-wide">Menu</h2>
        </div>

        {/* Navigation Links */}
        <a 
          href="#profile" 
          className="menu-item"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '8px',
            transition: 'all 0.2s ease',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>My Profile</span>
        </a>
        
        <a 
          href="#starred" 
          className="menu-item"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'rgba(255, 255, 255, 0.9)',
            textDecoration: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '8px',
            transition: 'all 0.2s ease',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.9)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Starred Profiles</span>
        </a>

        {/* Starred Profiles Section */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <h3 className="text-white/70 text-sm font-medium mb-4 uppercase tracking-wider">Recent Starred</h3>
          <div className="text-white/50 text-sm italic">No starred profiles yet</div>
        </div>

        {/* Actions Section */}
        <div className="border-t border-white/10 pt-6">
          <button 
            onClick={handleExportPDFs}
            style={{
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'transparent',
              border: '1px solid transparent',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Export PDFs via Email</span>
          </button>
          
          <a 
            href="#settings" 
            className="menu-item"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3643C3.80618 14.1866 3.49179 14.0913 3.17 14.09H3C2.46957 14.09 1.96086 13.8793 1.58579 13.5042C1.21071 13.1291 1 12.6204 1 12.09C1 11.5596 1.21071 11.0509 1.58579 10.6758C1.96086 10.3007 2.46957 10.09 3 10.09H3.09C3.42099 10.0823 3.742 9.97512 4.01062 9.78251C4.27925 9.5899 4.48167 9.32074 4.59 9.01C4.72312 8.70838 4.76282 8.37381 4.704 8.04941C4.64519 7.72502 4.49054 7.42568 4.26 7.19L4.2 7.13C4.01405 6.94425 3.86653 6.72368 3.76588 6.48088C3.66523 6.23808 3.61343 5.97783 3.61343 5.715C3.61343 5.45217 3.66523 5.19192 3.76588 4.94912C3.86653 4.70632 4.01405 4.48575 4.2 4.3C4.38575 4.11405 4.60632 3.96653 4.84912 3.86588C5.09192 3.76523 5.35217 3.71343 5.615 3.71343C5.87783 3.71343 6.13808 3.76523 6.38088 3.86588C6.62368 3.96653 6.84425 4.11405 7.03 4.3L7.09 4.36C7.32568 4.59054 7.62502 4.74519 7.94941 4.804C8.27381 4.86282 8.60838 4.82312 8.91 4.69H9C9.29577 4.56324 9.54802 4.35276 9.72569 4.08447C9.90337 3.81618 9.99872 3.50179 10 3.18V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Settings</span>
          </a>
        </div>
      </Menu>
    </>
  );
};

export default Header;