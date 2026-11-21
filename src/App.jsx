import React, { useState, useEffect } from 'react';
import { 
  Building2, Compass, Layers, ShieldCheck, Sparkles, MapPin, 
  ArrowRight, X, Phone, Mail, Clock, CheckCircle2, ChevronDown, 
  ExternalLink, Search, PlusCircle, ArrowUpRight, Award, UserCheck
} from 'lucide-react';
import { DEFAULT_PROJECTS } from './data/projectsData.js';
import { DEFAULT_PARTNERS } from './data/partnersData.js';

export default function App() {
  // Preloader State
  const [loading, setLoading] = useState(true);

  // In-Page Modals State (Opens in SAME PAGE as requested!)
  const [activeLeader, setActiveLeader] = useState(null); // 'pravin' | 'prajakta' | null
  const [selectedProject, setSelectedProject] = useState(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Helper for absolute image URLs
  const getImgUrl = (url) => {
    if (!url) return '/assets/img/showcase/banner1-min-scaled.jpg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return url.startsWith('/') ? url : `/${url}`;
  };

  // Portfolio State - Default initialized with all 92 verified projects!
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  // Partners State - Default initialized with all 52 verified client & partner logos!
  const [partnersData, setPartnersData] = useState(DEFAULT_PARTNERS);
  const [activePartnerTab, setActivePartnerTab] = useState('clients');

  // Hero Slider State
  const [heroSlide, setHeroSlide] = useState(0);

  // Hero Slides
  const heroSlides = [
    {
      img: '/assets/img/showcase/banner1-min-scaled.jpg',
      tag: 'Iconic Mumbai High-Rise Architecture',
      title: 'Design Your Space With Our Creation',
      desc: 'Pioneering aerodynamic residential skyscrapers, landmark townships, and sustainable urban ecosystems across Mumbai and India.'
    },
    {
      img: '/assets/img/showcase/b1.jpg',
      tag: 'Northern Hills Dahisar East',
      title: 'Elevating Vertical Living Beyond Horizons',
      desc: 'Sculpting high-density urban environments into biophilic, light-filled architectural marvels that endure across generations.'
    },
    {
      img: '/assets/img/showcase/b2.jpg',
      tag: 'Northern Heights Community',
      title: 'Architectural Excellence Rooted in Purpose',
      desc: 'From initial statutory approval liaisoning to post-occupancy handover, delivering precision-engineered structures.'
    }
  ];

  // Fetch Live Projects & Partners from Node API for real-time updates
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);

    // Fetch dynamic projects (including any uploaded from /pravinadmin)
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(err => console.log('Serving bundled projects:', err.message));

    // Fetch dynamic partners
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setPartnersData(data);
        }
      })
      .catch(err => console.log('Serving bundled partners:', err.message));

    return () => clearTimeout(timer);
  }, []);

  // Hero auto-slider
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  // Helper for partner items
  const getPartnerItems = () => {
    if (!partnersData || Object.keys(partnersData).length === 0) return [];

    if (activePartnerTab === 'all') {
      const all = [];
      Object.keys(partnersData).forEach(catKey => {
        if (partnersData[catKey] && Array.isArray(partnersData[catKey].items)) {
          partnersData[catKey].items.forEach(item => {
            all.push({ ...item, badge: partnersData[catKey].badge });
          });
        }
      });
      return all;
    }

    if (partnersData[activePartnerTab] && Array.isArray(partnersData[activePartnerTab].items)) {
      return partnersData[activePartnerTab].items.map(item => ({
        ...item,
        badge: partnersData[activePartnerTab].badge
      }));
    }

    return [];
  };

  return (
    <div className="site-wrapper">
      
      {/* 1. SIGNATURE PRELOADER (Photos & Video Ref) */}
      <div className={`preloader-fixed ${!loading ? 'fade' : ''}`}>
        <img 
          src={getImgUrl('assets/img/branding/logo.png')} 
          alt="K Arch Architects" 
          style={{ height: '48px', marginBottom: '16px' }}
          onError={(e) => { e.target.src = 'https://karcharchitects.com/wp-content/uploads/2021/04/logo.png'; }}
        />
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#1a1e28'
        }}>
          DESIGN YOUR SPACE WITH OUR CREATIONS
        </div>
        <div className="dots-wrapper">
          <span className="pulsing-dot" style={{ backgroundColor: '#f7d438', animationDelay: '0s' }}></span>
          <span className="pulsing-dot" style={{ backgroundColor: '#f58220', animationDelay: '0.2s' }}></span>
          <span className="pulsing-dot" style={{ backgroundColor: '#ef4136', animationDelay: '0.4s' }}></span>
          <span className="pulsing-dot" style={{ backgroundColor: '#92278f', animationDelay: '0.6s' }}></span>
          <span className="pulsing-dot" style={{ backgroundColor: '#39b54a', animationDelay: '0.8s' }}></span>
        </div>
      </div>

      {/* 2. TOP FLOATING LUXURY NAVBAR */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div className="container" style={{
          height: '84px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={getImgUrl('assets/img/branding/logo.png')} 
              alt="K Arch Architects" 
              style={{ height: '44px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://karcharchitects.com/wp-content/uploads/2021/04/logo.png'; }}
            />
          </a>

          {/* Desktop Menu */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-nav">
            <a href="#home" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-primary)' }}>Home</a>
            <a href="#about" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>About Studio</a>
            <a href="#services" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>Services</a>
            <a href="#team" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>Leadership</a>
            <a href="#portfolio" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>Portfolio</a>
            <a href="#partners" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>Clients &amp; Partners</a>
            <a href="#contact" style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>Contact</a>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="btn-primary" 
              onClick={() => setConsultModalOpen(true)}
              style={{ padding: '11px 22px', fontSize: '0.88rem' }}
            >
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SHOWCASE - PANORAMIC CITY SKYLINE & TWIN TOWERS */}
      <section id="home" style={{
        position: 'relative',
        minHeight: '92vh',
        marginTop: '84px',
        display: 'flex',
        alignItems: 'center',
        background: '#0c0e12',
        overflow: 'hidden'
      }}>
        {/* Background Slides */}
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: heroSlide === idx ? 1 : 0,
              transition: 'opacity 1.2s ease, transform 6s ease-out',
              transform: heroSlide === idx ? 'scale(1)' : 'scale(1.06)',
              zIndex: 1
            }}
          >
            <img 
              src={getImgUrl(slide.img)} 
              alt={slide.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(12,14,18,0.92) 0%, rgba(12,14,18,0.7) 45%, rgba(12,14,18,0.3) 100%)'
            }}></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '80px 24px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 130, 32, 0.15)',
              border: '1px solid rgba(245, 130, 32, 0.4)',
              color: '#f58220',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              marginBottom: '20px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={14} />
              <span>{heroSlides[heroSlide].tag}</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
              color: '#ffffff',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: '22px'
            }}>
              {heroSlides[heroSlide].title}
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: '#e2e5eb',
              lineHeight: 1.8,
              marginBottom: '36px',
              maxWidth: '720px'
            }}>
              {heroSlides[heroSlide].desc}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#portfolio" className="btn-accent" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <span>Explore 92+ Landmarks</span>
                <ArrowRight size={18} />
              </a>
              <button 
                onClick={() => setConsultModalOpen(true)}
                className="btn-outline" 
                style={{ background: 'rgba(255,255,255,0.95)', color: '#12141a', padding: '14px 32px', fontSize: '1rem' }}
              >
                <span>Schedule Consultation</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '70px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '24px 32px'
          }}>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>14+</div>
              <div style={{ fontSize: '0.85rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Years of Practice</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>92+</div>
              <div style={{ fontSize: '0.85rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Landmark Projects</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>38+</div>
              <div style={{ fontSize: '0.85rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Storeys Executed</div>
            </div>
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>52+</div>
              <div style={{ fontSize: '0.85rem', color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Engineering Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT & DESIGN PHILOSOPHY SECTION */}
      <section id="about" style={{ padding: '120px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="section-label">Architectural Designing</span>
              <h2 className="section-title">
                Nearing Two Decades of <span className="accent">Architectural Ingenuity</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '20px' }}>
                <strong>K Arch Architects</strong> is a premier multidisciplinary Mumbai architectural firm founded by acclaimed young architect <strong>Ar. Pravin Eknath Khade</strong> in the year 2012.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '24px' }}>
                Our portfolio demonstrates visionary ingenuity through creative, customized designs encompassing residential skyscrapers, commercial corporate plazas, integrated townships, and complex society redevelopment projects under DCPR-2034.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '32px' }}>
                We surpass the boundaries of conventional construction techniques and material science to enliven and enrich a sustainable, resilient built environment.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '20px' }}>
                  <Building2 size={26} color="var(--accent)" style={{ marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Client-Centric Feasibility</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Integrating form and function contemplated for Mumbai's climatological parameters.</p>
                </div>
                <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '20px' }}>
                  <ShieldCheck size={26} color="var(--accent)" style={{ marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Council of Architecture</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>CoA accredited practice strictly complying with Maharashtra municipal norms.</p>
                </div>
              </div>
            </div>

            {/* Visual Collage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '480px', boxShadow: 'var(--shadow-md)' }}>
                <img src={getImgUrl('assets/img/showcase/b1.jpg')} alt="Tower High Rise" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '480px', marginTop: '30px', boxShadow: 'var(--shadow-md)' }}>
                <img src={getImgUrl('assets/img/showcase/b2.jpg')} alt="Northern Heights" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Philosophy Strip */}
          <div style={{
            marginTop: '90px',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '460px 1fr',
            gap: '48px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#f4f5f8' }}>
              <img src={getImgUrl('assets/img/showcase/philo.png')} alt="Architectural Philosophy" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <span className="section-label">Design Philosophy</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>
                Collaborative Excellence Over Remote Isolation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '20px' }}>
                With aspirations to nurture enduring relationships with every developer, consultant, and homeowner, we bridge the barriers between different disciplines by involving approval authorities, structural consultants, and MEP liaisons right from the conceptual phase.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--bg-tertiary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Integrated Design Protocol</span>
                <span style={{ background: 'var(--bg-tertiary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>DCPR-2034 Compliance</span>
                <span style={{ background: 'var(--bg-tertiary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Zero Execution Friction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section id="services" style={{ padding: '120px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
            <span className="section-label">Capabilities &amp; Scope</span>
            <h2 className="section-title">
              Multidisciplinary <span className="accent">Architectural Solutions</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From initial feasibility studies to structural engineering coordination and interior styling.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: <Building2 size={32} color="var(--accent)" />,
                title: 'High-Rise Residential Towers',
                desc: '30 to 60+ storey skyscraper design engineered for aerodynamic efficiency, shear core integration, and premium floor plate yield.'
              },
              {
                icon: <ShieldCheck size={32} color="var(--accent)" />,
                title: 'Statutory Municipal Approvals',
                desc: 'Comprehensive liaisoning for BMC, MCGM, MHADA, SRA, MOEF, and high-rise committee permissions across the MMR region.'
              },
              {
                icon: <Compass size={32} color="var(--accent)" />,
                title: 'Integrated Township Planning',
                desc: 'Macro master plans harmonizing civic infrastructure, pedestrian circulation, road networks, and recreational landscapes.'
              },
              {
                icon: <Layers size={32} color="var(--accent)" />,
                title: 'Commercial Business Parks',
                desc: 'Corporate office headquarters, mixed-use retail complexes, and IT parks with flexible column grids and biophilic courtyards.'
              },
              {
                icon: <Sparkles size={32} color="var(--accent)" />,
                title: 'Luxury Interior Architecture',
                desc: 'Double-height entrance lobbies, bespoke penthouse suites, and artisanal spatial ergonomics directed by Mrs. Prajakta Khade.'
              },
              {
                icon: <CheckCircle2 size={32} color="var(--accent)" />,
                title: 'Society Redevelopment Advisory',
                desc: 'End-to-end guidance for housing societies seeking FSI optimization, developer tenders, and tenant rehabilitation designs.'
              }
            ].map((service, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '36px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '18px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE LEADERSHIP TEAM (IN-PAGE MODAL OPENER - AS REQUESTED!) */}
      <section id="team" style={{ padding: '120px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
            <span className="section-label">Executive Leadership</span>
            <h2 className="section-title">
              Visionary Architects Behind <span className="accent">Every Creation</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Click on either partner to view their comprehensive executive profile, credentials, and landmark high-rise projects.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '40px',
            maxWidth: '1080px',
            margin: '0 auto'
          }}>
            
            {/* 1. Ar. Pravin Eknath Khade Card */}
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.35s ease'
              }}
              onClick={() => setActiveLeader('pravin')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: '460px', overflow: 'hidden', background: '#e9ecef' }}>
                <span style={{
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                  zIndex: 3,
                  background: 'rgba(18,20,26,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '7px 16px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  Founder &amp; Principal Architect
                </span>

                <img 
                  src={getImgUrl('assets/img/showcase/archpravin-kade1400.jpg')} 
                  alt="Arch. Pravin Eknath Khade" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                  onError={(e) => { e.target.src = 'https://karcharchitects.com/wp-content/uploads/2021/04/archpravin-kade1400.jpg'; }}
                />

                {/* Hover overlay hint */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(18,20,26,0.85) 0%, rgba(18,20,26,0.2) 50%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px',
                  color: '#ffffff'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    color: '#12141a',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                  }}>
                    <span>View Profile in Same Page</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '32px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>
                  ESTD. 2012 &bull; 14+ YEARS PRACTICE
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontWeight: 700, marginBottom: '6px' }}>
                  Arch. Pravin Eknath Khade
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '14px' }}>
                  Founder &amp; Principal Architect
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  Founded K Arch Architects in 2012. Acclaimed expert in 38-storey high-rise skyscraper engineering, statutory municipal liaisoning, and master planning across western India.
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>High-Rise Skyscrapers</span>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>Township Planning</span>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>CoA Registered</span>
                </div>

                <div className="btn-primary" style={{ width: '100%', justifyContent: 'space-between', padding: '13px 20px' }}>
                  <span>Open Full Biography</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* 2. Mrs. Prajakta Khade Card */}
            <div 
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.35s ease'
              }}
              onClick={() => setActiveLeader('prajakta')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: '460px', overflow: 'hidden', background: '#e9ecef' }}>
                <span style={{
                  position: 'absolute',
                  top: '18px',
                  left: '18px',
                  zIndex: 3,
                  background: 'rgba(18,20,26,0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '7px 16px',
                  borderRadius: '30px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  Creative Head &amp; Interior Director
                </span>

                <img 
                  src={getImgUrl('assets/img/showcase/prajkata.jpg')} 
                  alt="Mrs. Prajakta Khade" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                  onError={(e) => { e.target.src = 'https://karcharchitects.com/wp-content/uploads/2021/04/prajkata.jpg'; }}
                />

                {/* Hover overlay hint */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(18,20,26,0.85) 0%, rgba(18,20,26,0.2) 50%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px',
                  color: '#ffffff'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    color: '#12141a',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                  }}>
                    <span>View Profile in Same Page</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '32px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>
                  INTERIOR ARCHITECTURE &bull; AESTHETICS
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mrs. Prajakta Khade
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '14px' }}>
                  Creative Head &amp; Interior Director
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  Directing creative aesthetics, spatial harmony, and interior architecture at K Arch Architects, creating memorable, biophilic living spaces and grand entrance lobbies.
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>Luxury Residential</span>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>Biophilic Lobbies</span>
                  <span style={{ background: '#f4f6fa', padding: '4px 12px', borderRadius: '4px', fontSize: '0.78rem', color: '#495057' }}>Spatial Ergonomics</span>
                </div>

                <div className="btn-primary" style={{ width: '100%', justifyContent: 'space-between', padding: '13px 20px' }}>
                  <span>Open Full Biography</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. DYNAMIC LIVE PORTFOLIO ENGINE (CONNECTED TO NODE BACKEND) */}
      <section id="portfolio" style={{ padding: '120px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <span className="section-label">Our Works</span>
              <h2 className="section-title">Design <span className="accent">Portfolio</span></h2>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: 'var(--accent)', fontWeight: 700 }}>
              Showing {displayedProjects.length} of {filteredProjects.length} Projects
            </div>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'skyscrapers', label: 'Skyscrapers & High-Rise' },
              { id: 'residential', label: 'Residential Tower' },
              { id: 'commercial', label: 'Commercial' },
              { id: 'township', label: 'Township Planning' },
              { id: 'interiors', label: 'Luxury Interiors' },
              { id: '3d_interiors', label: '3D Architecture' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setVisibleCount(9); }}
                style={{
                  background: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: activeCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--border-subtle)',
                  padding: '9px 20px',
                  borderRadius: '30px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            maxWidth: '560px',
            marginBottom: '40px'
          }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by project name or location (e.g. Dahisar, Malad, High-Rise)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(9); }}
              style={{
                width: '100%',
                padding: '13px 18px 13px 46px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                fontSize: '0.94rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Projects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '30px'
          }}>
            {displayedProjects.map(project => (
              <article 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                {/* Thumb */}
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden', background: '#000' }}>
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: project.isCustomUpload ? '#39b54a' : 'rgba(18,20,26,0.85)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    zIndex: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {project.isCustomUpload ? '✨ New Upload' : (project.badge || project.type)}
                  </span>

                  <img 
                    src={getImgUrl(project.image || project.originalImage)} 
                    alt={project.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onError={(e) => { e.target.src = '/assets/img/showcase/banner1-min-scaled.jpg'; }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{project.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
                    <MapPin size={15} color="var(--accent)" />
                    <span>{project.location || 'Mumbai, Maharashtra'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{project.categoryName || project.type}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{project.status || 'Landmark'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProjects.length && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="btn-outline" 
                style={{ padding: '13px 36px', fontSize: '0.95rem' }}
              >
                <span>Load More Projects</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. CATEGORIZED COLLABORATORS & WORK PARTNERS (All 52+ Logos) */}
      <section id="partners" style={{ padding: '120px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
            <span className="section-label">Ecosystem &amp; Collaborations</span>
            <h2 className="section-title">
              Esteemed <span className="accent">Clients &amp; Partners</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              K Arch Architects collaborates closely with premier real estate developers, structural consultants, and liaisoning authorities across India.
            </p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            {[
              { id: 'clients', label: 'Real Estate Developers (18)' },
              { id: 'structural', label: 'Structural Consultants (10)' },
              { id: 'approvals', label: 'Approval Authorities (6)' },
              { id: 'mep', label: 'MEP Consultants (5)' },
              { id: 'environmental', label: 'Environmental (3)' },
              { id: 'landscape', label: 'Landscape Architects (3)' },
              { id: 'pmc', label: 'PMC (2)' },
              { id: 'marketing', label: 'Sales & Marketing (5)' },
              { id: 'all', label: 'All Partners (52)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePartnerTab(tab.id)}
                style={{
                  background: activePartnerTab === tab.id ? 'var(--accent)' : '#ffffff',
                  color: activePartnerTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activePartnerTab === tab.id ? 'var(--accent)' : 'var(--border-subtle)',
                  padding: '9px 18px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Partners Logos Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {getPartnerItems().map((partner, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '160px',
                  textAlign: 'center',
                  transition: 'all 0.25s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ height: '70px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <img 
                    src={getImgUrl(partner.image)} 
                    alt={partner.name}
                    loading="lazy"
                    style={{ maxHeight: '60px', maxWidth: '140px', objectFit: 'contain', display: 'block' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT US SECTION */}
      <section id="contact" style={{ padding: '120px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <span className="section-label">Get in Touch</span>
              <h2 className="section-title">Let’s Architect <span className="accent">Your Vision</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px' }}>
                Whether you are planning a 40-storey high-rise, an integrated master plan township, or an institutional project in Mumbai, our studio is ready to consult.
              </p>

              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '50%', color: 'var(--accent)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Studio Headquarters</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mumbai, Maharashtra, India</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '50%', color: 'var(--accent)' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Executive Email</h4>
                    <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>enquiry@karcharchitects.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: '50%', color: 'var(--accent)' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>Consultation Hours</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Monday – Saturday: 10:00 AM – 7:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Form */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 700 }}>Request Project Proposal</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your architectural consultation request has been received by Ar. Pravin Khade’s studio.'); }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <input type="text" placeholder="Your Name *" required style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', outline: 'none' }} />
                  <input type="tel" placeholder="Mobile Number *" required style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input type="email" placeholder="Email Address *" required style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <select style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', outline: 'none' }}>
                    <option>High-Rise Skyscraper Project</option>
                    <option>Society Redevelopment (DCPR-2034)</option>
                    <option>Township Master Planning</option>
                    <option>Commercial Complex</option>
                    <option>Luxury Interior Architecture</option>
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <textarea rows="4" placeholder="Brief details about plot size, location, or project scope..." style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', outline: 'none' }}></textarea>
                </div>
                <button type="submit" className="btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                  <span>Submit Consultation Request</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer style={{ background: '#0e1014', color: '#adb5bd', padding: '60px 0 30px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '30px', marginBottom: '30px' }}>
            <img src={getImgUrl('assets/img/branding/logo-white.png')} alt="K Arch Architects" style={{ height: '40px' }} onError={(e) => { e.target.src = getImgUrl('assets/img/branding/logo.png'); }} />
            
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem' }}>
              <a href="#about" style={{ color: '#fff' }}>About</a>
              <a href="#services" style={{ color: '#fff' }}>Services</a>
              <a href="#portfolio" style={{ color: '#fff' }}>Portfolio</a>
              <a href="#team" style={{ color: '#fff' }}>Leadership</a>
              <a href="/pravinadmin" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>CMS Admin (/pravinadmin)</a>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6c757d' }}>
            &copy; {new Date().getFullYear()} K Arch Architects. All Rights Reserved. Principal Architect: Ar. Pravin Eknath Khade (CoA Regd).
          </div>
        </div>
      </footer>

      {/* ==========================================================================
          IN-PAGE EXECUTIVE LEADERSHIP MODAL (OPENS IN SAME PAGE AS REQUESTED!)
          ========================================================================== */}
      {activeLeader && (
        <div className="modal-overlay" onClick={() => setActiveLeader(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
            <button className="modal-close-btn" onClick={() => setActiveLeader(null)}>
              <X size={20} />
            </button>

            {activeLeader === 'pravin' ? (
              /* AR. PRAVIN EKNATH KHADE FULL PROFILE */
              <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '620px' }}>
                {/* Photo & Quick Stats */}
                <div style={{ background: '#f8f9fc', borderRight: '1px solid var(--border-subtle)', padding: '36px' }}>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', height: '380px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
                    <img 
                      src={getImgUrl('assets/img/showcase/archpravin-kade1400.jpg')} 
                      alt="Arch. Pravin Eknath Khade" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.88rem', display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Position:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>Founder &amp; Principal</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Established:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>2012 (14+ Yrs Practice)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Regulatory:</span>
                      <strong style={{ color: 'var(--accent)' }}>Council of Architecture</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>enquiry@karcharchitects.com</strong>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                  <span className="section-label">Executive Leadership Profile</span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: '4px' }}>
                    Arch. Pravin Eknath Khade
                  </h2>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '20px' }}>
                    Founder &amp; Principal Architect &bull; K Arch Architects
                  </div>

                  <div style={{
                    background: 'var(--accent-light)',
                    borderLeft: '4px solid var(--accent)',
                    padding: '16px 20px',
                    borderRadius: '4px',
                    marginBottom: '24px',
                    fontStyle: 'italic',
                    color: '#2b2f38'
                  }}>
                    "We do not opt for standardized architecture with pre-conceived notions. Instead, we develop design solutions that integrate form and function, contemplating architecture and landscape best suited to each project."
                  </div>

                  <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Professional Background &amp; Mastery</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.8, marginBottom: '20px' }}>
                    Ar. Pravin Eknath Khade established <strong>K Arch Architects</strong> in 2012. Over nearly two decades in the Mumbai Metropolitan Region (MMR), he has championed aerodynamic high-rise engineering, statutory municipal clearances under DCPR-2034, and large-scale township master plans.
                  </p>

                  <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Key Landmark High-Rises</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Northern Hills — Dahisar</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Royal Lagoon — Malad</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Callista Tower — Thane</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Shreeji Fiora — Borivali</span>
                  </div>

                  <button 
                    onClick={() => { setActiveLeader(null); setConsultModalOpen(true); }}
                    className="btn-accent" 
                    style={{ padding: '13px 28px', fontSize: '0.94rem' }}
                  >
                    <span>Book Direct Consultation With Ar. Pravin</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* MRS. PRAJAKTA KHADE FULL PROFILE */
              <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '620px' }}>
                {/* Photo & Quick Stats */}
                <div style={{ background: '#f8f9fc', borderRight: '1px solid var(--border-subtle)', padding: '36px' }}>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', height: '380px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
                    <img 
                      src={getImgUrl('assets/img/showcase/prajkata.jpg')} 
                      alt="Mrs. Prajakta Khade" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.88rem', display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Position:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>Creative Head &amp; Director</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Focus Area:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>Interior Architecture</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Philosophy:</span>
                      <strong style={{ color: 'var(--accent)' }}>Biophilic &amp; Sensorial</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>enquiry@karcharchitects.com</strong>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                  <span className="section-label">Executive Leadership Profile</span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: '4px' }}>
                    Mrs. Prajakta Khade
                  </h2>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '20px' }}>
                    Creative Head &amp; Interior Director &bull; K Arch Architects
                  </div>

                  <div style={{
                    background: 'var(--accent-light)',
                    borderLeft: '4px solid var(--accent)',
                    padding: '16px 20px',
                    borderRadius: '4px',
                    marginBottom: '24px',
                    fontStyle: 'italic',
                    color: '#2b2f38'
                  }}>
                    "True luxury is felt before it is seen. By orchestrating natural daylight, organic greenery, and acoustic serenity, we create interior sanctuaries that elevate vertical urban living."
                  </div>

                  <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Creative Direction &amp; Spatial Psychology</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.8, marginBottom: '20px' }}>
                    Mrs. Prajakta Khade oversees the studio's aesthetic identity and interior design divisions. From monumental double-height entrance lobbies for signature residential towers to custom luxury residential interiors, her work seamlessly unites structure and atmosphere.
                  </p>

                  <h4 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>Design Specialties</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Grand Entrance Lobbies</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Biophilic Spatial Planning</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>3D Virtual Visualization</span>
                    <span style={{ background: '#f4f6fa', border: '1px solid #e2e5eb', padding: '6px 14px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 600 }}>Bespoke Material Finishes</span>
                  </div>

                  <button 
                    onClick={() => { setActiveLeader(null); setConsultModalOpen(true); }}
                    className="btn-accent" 
                    style={{ padding: '13px 28px', fontSize: '0.94rem' }}
                  >
                    <span>Schedule Interior Consultation With Mrs. Prajakta</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROJECT LIGHTBOX MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px' }}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>
              <X size={20} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
              <div style={{ background: '#000', overflow: 'hidden' }}>
                <img 
                  src={getImgUrl(selectedProject.image || selectedProject.originalImage)} 
                  alt={selectedProject.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ padding: '36px' }}>
                <span className="section-label">{selectedProject.categoryName || selectedProject.category}</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '8px' }}>{selectedProject.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>
                  <MapPin size={16} />
                  <span>{selectedProject.location || 'Mumbai, India'}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.8, marginBottom: '24px' }}>
                  {selectedProject.description || 'Designed by K Arch Architects under Principal Architect Ar. Pravin Eknath Khade. Balancing Mumbai climatological parameters with structural efficiency.'}
                </p>
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                    <strong>{selectedProject.status || 'Iconic Landmark'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Typology:</span>
                    <strong>{selectedProject.type || 'High-Rise Tower'}</strong>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedProject(null); setConsultModalOpen(true); }}
                  className="btn-accent" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Inquire Regarding This Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONSULTATION MODAL */}
      {consultModalOpen && (
        <div className="modal-overlay" onClick={() => setConsultModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '40px' }}>
            <button className="modal-close-btn" onClick={() => setConsultModalOpen(false)}>
              <X size={20} />
            </button>
            <span className="section-label">Executive Studio Booking</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '12px' }}>
              Schedule Architectural Consultation
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Direct meeting with Ar. Pravin Eknath Khade and the senior engineering team.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Consultation request booked! Ar. Pravin’s office will contact you within 24 hours.'); setConsultModalOpen(false); }}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <input type="text" placeholder="Full Name *" required style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
                <input type="tel" placeholder="Mobile / WhatsApp Number *" required style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
                <input type="email" placeholder="Email Address *" required style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }} />
                <select style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <option>Skyscraper High-Rise Design (30+ Storeys)</option>
                  <option>Society Redevelopment (DCPR-2034)</option>
                  <option>Township Master Planning</option>
                  <option>Commercial Complex</option>
                  <option>Luxury Interior Architecture</option>
                </select>
                <textarea rows="3" placeholder="Plot location, developer name, or project scope..." style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}></textarea>
                <button type="submit" className="btn-accent" style={{ padding: '14px', justifyContent: 'center' }}>
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
