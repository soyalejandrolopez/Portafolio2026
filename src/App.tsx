import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Globe, Languages } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

// Language configuration
type Language = 'es' | 'en' | 'pt' | 'fr'

const languageNames = {
    es: { name: 'Español', flag: '🇪🇸', code: 'es' },
    en: { name: 'English', flag: '🇬🇧', code: 'en' },
    pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' }
}


// Declare window.changeGoogleLanguage function (defined in index.html)
declare global {
    interface Window {
        changeGoogleLanguage?: (langCode: string) => boolean;
    }
}

// Trigger Google Translate via global function
function triggerGoogleTranslate(langCode: string) {
    if (window.changeGoogleLanguage) {
        window.changeGoogleLanguage(langCode)
    } else {
        setTimeout(() => {
            if (window.changeGoogleLanguage) {
                window.changeGoogleLanguage(langCode)
            }
        }, 500)
    }
}



function App() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [currency, setCurrency] = useState('COP')
    const [language, setLanguage] = useState<Language>('es')
    const [showLangMenu, setShowLangMenu] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])

    // Function to change language using Google Translate
    const changeLanguage = (lang: Language) => {
        console.log('Changing language to:', lang, '- Code:', languageNames[lang].code)
        setLanguage(lang)
        triggerGoogleTranslate(languageNames[lang].code)
        setShowLangMenu(false)
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (showLangMenu && !target.closest('.language-selector')) {
                setShowLangMenu(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showLangMenu])

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.getElementById('navbar')
            if (window.scrollY > 80) {
                navbar?.classList.add('bg-[#1e40af]')
                navbar?.classList.add('shadow-lg')
            } else {
                navbar?.classList.remove('bg-[#1e40af]')
                navbar?.classList.remove('shadow-lg')
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle right-click context menu
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            setContextMenu({
                x: e.clientX,
                y: e.clientY
            })
        }

        const handleClick = () => {
            setContextMenu(null)
        }

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('click', handleClick)
        }
    }, [])

    const portfolioItems = [
        { id: 1, category: 'ecommerce', title: 'Tienda virtual', desc: 'Tienda virtual para microempresa textil', tags: ['E-commerce', 'Woocommerce'], img: '/images/tienda.png' },
        { id: 2, category: 'corporate', title: 'Sitios Corporativos', desc: 'Web para comercializadora de Portugal', tags: ['Corporativo', 'WordPress'], img: '/images/sitiowebcorporativo.png' },
        { id: 3, category: 'corporate', title: 'Sitios Corporativos', desc: 'Web para consultora contable', tags: ['Servicios', 'React'], img: '/images/sitiowebcorporativo2.png' },
        { id: 4, category: 'ngo', title: 'Sitios web ONG\'S', desc: 'Fundación Timbio, Cauca', tags: ['ONG', 'Donaciones'], img: '/images/ong3.png' },
        { id: 5, category: 'business', title: 'Sitios web Empresariales', desc: 'Agencia de marketing', tags: ['Marketing', 'SEO'], img: '/images/sitiowebcorporativo3.png' },
        { id: 6, category: 'streaming', title: 'Radio Streaming', desc: 'Radio virtual con servidores VPS', tags: ['Streaming', 'VPS'], img: '/images/sitioradio.png' },
        { id: 7, category: 'ngo', title: 'Sitios web para Fundaciones', desc: 'Fundación de Popayán', tags: ['Fundación', 'WordPress'], img: '/images/sitiowebong2.png' },
        { id: 8, category: 'business', title: 'Sitios web Empresariales', desc: 'Empresa de exportación internacional', tags: ['Exportación', 'React'], img: '/images/sitiowebjunk.png' },
        { id: 9, category: 'ecommerce', title: 'Tienda virtuales', desc: 'Tienda virtual para restaurante local', tags: ['Restaurante', 'E-commerce'], img: '/images/tiendavirtual02.png' },
        { id: 10, category: 'medical', title: 'Servicios médicos', desc: 'Atención médica personalizada', tags: ['Salud', 'Web App'], img: '/images/empresamedicaencasa.png' },
        { id: 11, category: 'ecommerce', title: 'Marketplace', desc: 'Plataforma de comercio electrónico', tags: ['Marketplace', 'React'], img: '/images/marketplace.png' },
    ]

    const filteredPortfolio = activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter)

    const prices: Record<string, { basic: number; standard: number; premium: number }> = {
        COP: { basic: 450000, standard: 650000, premium: 750000 },
        USD: { basic: 110, standard: 160, premium: 185 },
        EUR: { basic: 100, standard: 145, premium: 170 }
    }

    const formatPrice = (amount: number) => {
        return currency === 'COP' ? amount.toLocaleString('es-CO') : amount.toLocaleString('en-US')
    }

    const currencySymbol = currency === 'EUR' ? '€' : '$'

    return (
        <div className="min-h-screen font-['Inter'] overflow-x-hidden">

            {/* Navbar - Desktop */}
            <motion.nav
                id="navbar"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                className="hidden md:block fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/10"
            >
                <div className="container-custom">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-2">
                            <Globe className="h-7 w-7 text-white drop-shadow-lg" />
                            <div className="font-['Outfit'] leading-tight">
                                <div className="text-base font-bold text-white drop-shadow-lg">Alejandro López</div>
                                <div className="text-[10px] text-white/90 drop-shadow-md">Portfolio de Servicios</div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-6 items-center">
                            <a href="#inicio" className="text-sm font-semibold text-white/95 hover:text-white transition-colors drop-shadow-md">Inicio</a>
                            <a href="#portafolio" className="text-sm font-semibold text-white/95 hover:text-white transition-colors drop-shadow-md">Portafolio</a>
                            <a href="#planes" className="text-sm font-semibold text-white/95 hover:text-white transition-colors drop-shadow-md">Planes</a>
                            <a href="#quienes-somos" className="text-sm font-semibold text-white/95 hover:text-white transition-colors drop-shadow-md">Sobre Nosotros</a>

                            {/* Language Selector */}
                            <div className="relative language-selector">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowLangMenu(!showLangMenu)
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm border border-white/20"
                                >
                                    <Languages className="h-4 w-4 text-white" />
                                    <span className="text-sm text-white font-medium">{languageNames[language].flag}</span>
                                </button>
                                {showLangMenu && (
                                    <div className="absolute right-0 mt-2 w-40 bg-[#1e40af] rounded-lg shadow-2xl border-2 border-white/20 py-1 z-50">
                                        {(Object.keys(languageNames) as Language[]).map((lang) => (
                                            <div
                                                key={lang}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => changeLanguage(lang)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault()
                                                        changeLanguage(lang)
                                                    }
                                                }}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer ${language === lang ? 'bg-white/30 text-white font-semibold' : 'text-white/90'
                                                    }`}
                                            >
                                                <span>{languageNames[lang].flag}</span>
                                                <span>{languageNames[lang].name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl safe-area-bottom">
                <div className="grid grid-cols-5 h-12">
                    {[
                        { icon: '🏠', label: 'Inicio', href: '#inicio' },
                        { icon: '💼', label: 'Portafolio', href: '#portafolio' },
                        { icon: '💰', label: 'Planes', href: '#planes' },
                        { icon: '👥', label: 'Sobre Nosotros', href: '#quienes-somos' },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary active:bg-primary/5 transition-colors"
                        >
                            <span className="text-base">{item.icon}</span>
                            <span className="text-[8px] font-medium leading-tight">{item.label}</span>
                        </a>
                    ))}
                    {/* Mobile Language Selector */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowLangMenu(!showLangMenu)
                        }}
                        className="relative flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary active:bg-primary/5 transition-colors language-selector"
                    >
                        <Languages className="h-4 w-4" />
                        <span className="text-[8px] font-medium leading-tight">{languageNames[language].flag}</span>
                        {showLangMenu && (
                            <div className="absolute bottom-full mb-2 right-0 w-40 bg-[#1e40af] rounded-lg shadow-2xl border-2 border-white/20 py-1 z-50">
                                {(Object.keys(languageNames) as Language[]).map((lang) => (
                                    <div
                                        key={lang}
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            changeLanguage(lang)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                changeLanguage(lang)
                                            }
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer ${language === lang ? 'bg-white/30 text-white font-semibold' : 'text-white/90'
                                            }`}
                                    >
                                        <span>{languageNames[lang].flag}</span>
                                        <span>{languageNames[lang].name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-12 md:pt-20">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/80 to-black/70" />

                {/* Fireworks effect (mobile only) */}
                <div className="md:hidden absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-firework"
                            style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.8}s`,
                                animationDuration: `${2 + Math.random() * 1}s`
                            }}
                        >
                            <div className="firework-particle bg-yellow-400"></div>
                            <div className="firework-particle bg-red-400"></div>
                            <div className="firework-particle bg-blue-400"></div>
                            <div className="firework-particle bg-green-400"></div>
                            <div className="firework-particle bg-purple-400"></div>
                            <div className="firework-particle bg-pink-400"></div>
                        </div>
                    ))}
                </div>

                {/* Subtle animated blurs */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
                </div>

                <motion.div style={{ opacity }} className="text-center px-4 z-10 max-w-5xl relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-['Outfit'] font-bold mb-4 md:mb-6 leading-tight text-white px-2 drop-shadow-2xl"
                    >
                        Impulsa Tu Presencia Digital con Tecnología de Vanguardia
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-sm md:text-lg text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-xl"
                    >
                        Creamos sitios web modernos y tiendas virtuales optimizadas que transforman tu presencia en línea.
                    </motion.p>
                </motion.div>
            </section>

            {/* Portfolio */}
            <section id="portafolio" className="section-padding px-3 md:px-4">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-6 md:mb-8"
                    >
                        <div className="text-[10px] md:text-sm font-semibold text-primary mb-2 md:mb-3 tracking-widest uppercase">Nuestro Trabajo</div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-['Outfit'] font-bold text-foreground mb-3 md:mb-4">
                            Nuestro Portafolio
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                            Soluciones digitales innovadoras que impulsan tu negocio
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-1 md:gap-2 mb-4 md:mb-6">
                        {['all', 'ecommerce', 'corporate', 'business', 'ngo', 'medical', 'streaming'].map((filter) => (
                            <Button
                                key={filter}
                                size="sm"
                                variant={activeFilter === filter ? 'default' : 'outline'}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full text-[9px] md:text-xs h-6 md:h-8 px-2 md:px-3 ${activeFilter === filter
                                    ? 'bg-primary/90 backdrop-blur-sm shadow-lg'
                                    : 'bg-white/70 hover:bg-white/90 backdrop-blur-sm border-white/50'
                                    }`}
                            >
                                {filter === 'all' ? 'Todos' : filter === 'ecommerce' ? 'Tiendas' : filter === 'corporate' ? 'Corporativo' : filter === 'business' ? 'Empresarial' : filter === 'ngo' ? "ONG's" : filter === 'medical' ? 'Médico' : 'Streaming'}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                        {filteredPortfolio.map((item, i) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="glass-card glass-hover overflow-hidden h-full">
                                    <div className="relative h-28 md:h-48 overflow-hidden">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <CardHeader className="p-2 md:p-4 pb-1 md:pb-2">
                                        <CardTitle className="text-xs md:text-lg font-['Outfit']">{item.title}</CardTitle>
                                        <CardDescription className="text-[10px] md:text-sm line-clamp-2">{item.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-2 md:p-4 pt-0">
                                        <div className="flex flex-wrap gap-1">
                                            {item.tags.map((tag) => (
                                                <span key={tag} className="text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 bg-white border border-gray-200 rounded-full text-primary font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Plans */}
            <section id="planes" className="section-padding px-3 md:px-4 bg-muted/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-6 md:mb-8"
                    >
                        <div className="text-[10px] md:text-sm font-semibold text-primary mb-2 md:mb-3 tracking-widest uppercase">Precios</div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-['Outfit'] font-bold text-foreground mb-3 md:mb-4">
                            Nuestros Planes
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 mb-6">
                            Elige la solución perfecta para tu negocio
                        </p>
                    </motion.div>

                    {/* Tabs Currency Selector */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex bg-white/70 backdrop-blur-md rounded-full p-1.5 shadow-xl border border-white/40">
                            {[
                                { value: 'COP', label: 'COP 🇨🇴', icon: '$' },
                                { value: 'USD', label: 'USD 🇺🇸', icon: '$' },
                                { value: 'EUR', label: 'EUR 🇪🇺', icon: '€' },
                            ].map((curr) => (
                                <button
                                    key={curr.value}
                                    onClick={() => setCurrency(curr.value as 'COP' | 'USD' | 'EUR')}
                                    className={`
                                        px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300
                                        ${currency === curr.value
                                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105 backdrop-blur-sm'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                                        }
                                    `}
                                >
                                    {curr.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                        {[
                            { name: 'Básico', price: `${currencySymbol}${formatPrice(prices[currency].basic)}`, desc: 'Pequeñas empresas', features: ['Responsive', 'Diseño básico', 'Dominio 1 año', 'Soporte prioritario', 'Hasta 5 páginas', 'Redes sociales'] },
                            { name: 'Estándar', price: `${currencySymbol}${formatPrice(prices[currency].standard)}`, desc: 'Empresas medianas', featured: true, features: ['Responsive', 'Diseño avanzado', 'Dominio 1 año', 'Soporte 24/7', 'Hasta 10 páginas', 'Redes sociales', 'SEO básico'] },
                            { name: 'Premium', price: `${currencySymbol}${formatPrice(prices[currency].premium)}`, desc: 'Grandes empresas', features: ['Responsive', 'Diseño premium', 'Dominio 1 año', 'Soporte 24/7', 'Páginas ilimitadas', 'Redes sociales', 'SEO avanzado', 'E-commerce'] },
                        ].map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={plan.featured ? 'md:scale-110 z-10' : ''}
                            >
                                <Card className={`glass-card h-full relative overflow-hidden ${plan.featured ? 'border-2 border-primary/60 shadow-2xl glass-hover' : 'glass-hover'}`}>
                                    {plan.featured && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-[8px] md:text-[10px] px-2 md:px-4 py-1 md:py-1.5 rounded-bl-lg font-bold">
                                            POPULAR
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-2 md:pb-4 p-2 md:p-6">
                                        <CardTitle className="text-sm md:text-2xl font-['Outfit'] mb-1 md:mb-2">{plan.name}</CardTitle>
                                        <CardDescription className="text-[9px] md:text-sm">{plan.desc}</CardDescription>
                                        <div className="mt-2 md:mt-4 mb-1 md:mb-2">
                                            <span className="text-lg md:text-4xl font-bold text-primary">{plan.price}</span>
                                            <span className="text-[9px] md:text-sm text-muted-foreground ml-1">/ proyecto</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 p-2 md:p-6">
                                        <ul className="space-y-1 md:space-y-2.5 mb-3 md:mb-6">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-1 md:gap-2 text-[9px] md:text-sm">
                                                    <span className="text-primary mt-0.5 text-[10px] md:text-base">✓</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>



                    {/* Payment Methods */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-8"
                        >
                            <h3 className="text-xl md:text-2xl font-['Outfit'] font-bold mb-2">Métodos de Pago</h3>
                            <p className="text-sm text-muted-foreground">
                                Procesamos tu pago de forma segura y confiable
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 max-w-4xl mx-auto">
                            {[
                                { name: 'Wompi', desc: 'Paga con tarjeta o PSE', gradient: 'from-purple-500 to-pink-500', icon: '💳', url: 'https://checkout.wompi.co/l/VPOS_EfWHw0' },
                                { name: 'Bold', desc: 'Pagos seguros en Colombia', gradient: 'from-blue-500 to-cyan-500', icon: '🔒', url: 'https://checkout.bold.co/payment/LNK_A4B8NZAE8I' },
                                { name: 'PayPal', desc: 'Pagos internacionales', gradient: 'from-blue-600 to-blue-400', icon: '🌎', url: 'https://www.paypal.com/donate/?hosted_button_id=74CQB9TKNGZ2N' },
                            ].map((method, i) => (
                                <motion.div
                                    key={method.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <a
                                        href={method.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Card className="glass-card relative overflow-hidden border-2 glass-hover cursor-pointer group">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                            <CardContent className="p-3 md:p-6 text-center relative z-10">
                                                <div className="text-2xl md:text-4xl mb-2 md:mb-3">{method.icon}</div>
                                                <h4 className="text-sm md:text-lg font-bold mb-1">{method.name}</h4>
                                                <p className="text-[9px] md:text-xs text-muted-foreground mb-2 md:mb-4">{method.desc}</p>
                                                <div className={`inline-flex items-center gap-1 md:gap-2 text-[9px] md:text-xs font-semibold text-transparent bg-gradient-to-r ${method.gradient} bg-clip-text`}>
                                                    Pago Seguro
                                                    <span className="text-xs md:text-sm">→</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonios" className="section-padding px-3 md:px-4 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
                <div className="container-custom max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 md:mb-12"
                    >
                        <div className="text-[10px] md:text-sm font-semibold text-primary mb-2 md:mb-3 tracking-widest uppercase">Testimonios</div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-['Outfit'] font-bold text-foreground mb-3 md:mb-4">
                            Lo Que Dicen Nuestros Clientes
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                            Historias reales de empresas que transformaron su presencia digital
                        </p>
                    </motion.div>

                    {/* Auto-scrolling carousel */}
                    <div className="relative">
                        <motion.div
                            className="flex gap-6"
                            animate={{
                                x: [0, -2400],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 30,
                                    ease: "linear",
                                },
                            }}
                        >
                            {/* Render testimonials twice for seamless loop */}
                            {[...Array(2)].map((_, groupIndex) => (
                                <div key={groupIndex} className="flex gap-6">
                                    {[
                                        {
                                            name: 'Sofía Ramírez',
                                            role: 'CEO',
                                            company: 'TechVision Solutions',
                                            rating: 5,
                                            text: 'Excelente trabajo. Entendió nuestra visión y la implementó con un diseño moderno y funcional que ha multiplicado nuestras conversiones.',
                                            avatar: 'SR',
                                            featured: true
                                        },
                                        {
                                            name: 'Carlos Mendoza',
                                            role: 'Director de Marketing',
                                            company: 'Innovatech Colombia',
                                            rating: 5,
                                            text: 'El sitio web superó nuestras expectativas. Profesionalismo y creatividad en cada detalle. Nuestro tráfico aumentó un 200%.',
                                            avatar: 'CM'
                                        },
                                        {
                                            name: 'María González',
                                            role: 'Fundadora',
                                            company: 'EcoModa Textil',
                                            rating: 5,
                                            text: 'Transformaron completamente nuestra tienda online. El diseño es elegante y las ventas se han triplicado desde el lanzamiento.',
                                            avatar: 'MG'
                                        },
                                        {
                                            name: 'Antonio Silva',
                                            role: 'Gerente General',
                                            company: 'Exportaciones Global',
                                            rating: 5,
                                            text: 'Increíble atención al detalle y soporte continuo. El sitio corporativo refleja perfectamente nuestra profesionalidad.',
                                            avatar: 'AS'
                                        },
                                        {
                                            name: 'Laura Fernández',
                                            role: 'Directora',
                                            company: 'Fundación Esperanza',
                                            rating: 5,
                                            text: 'Crearon una plataforma hermosa que nos ayuda a conectar con donantes. Su compromiso social es admirable.',
                                            avatar: 'LF'
                                        },
                                        {
                                            name: 'Roberto Díaz',
                                            role: 'Propietario',
                                            company: 'Restaurante La Plaza',
                                            rating: 5,
                                            text: 'El sistema de pedidos online funciona a la perfección. Nuestros clientes están encantados con la experiencia.',
                                            avatar: 'RD'
                                        }
                                    ].map((testimonial, i) => (
                                        <div
                                            key={`${groupIndex}-${i}`}
                                            className="flex-shrink-0 w-[350px] md:w-[400px]"
                                        >
                                            <Card className={`glass-card h-full relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${testimonial.featured ? 'border-primary/60 bg-gradient-to-br from-primary/5 to-secondary/5' : 'border-white/40'
                                                }`}>
                                                <CardContent className="pt-6 pb-6 px-5">
                                                    {/* Quote Icon */}
                                                    <div className={`text-4xl md:text-5xl mb-3 ${testimonial.featured ? 'text-primary/30' : 'text-primary/20'
                                                        }`}>"</div>

                                                    {/* Star Rating */}
                                                    <div className="flex gap-1 mb-3">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <span key={i} className="text-yellow-500 text-sm md:text-base">⭐</span>
                                                        ))}
                                                    </div>

                                                    {/* Testimonial Text */}
                                                    <p className="text-xs md:text-sm italic mb-4 text-muted-foreground leading-relaxed h-[80px] md:h-[100px]">
                                                        {testimonial.text}
                                                    </p>

                                                    {/* Author Info */}
                                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                                        {/* Avatar with Initials */}
                                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white font-bold text-sm md:text-base">{testimonial.avatar}</span>
                                                        </div>

                                                        {/* Name & Company */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm md:text-base text-foreground truncate">{testimonial.name}</p>
                                                            <p className="text-xs md:text-sm text-muted-foreground truncate">{testimonial.role}</p>
                                                            <p className="text-xs text-primary font-semibold truncate">{testimonial.company}</p>
                                                        </div>
                                                    </div>

                                                    {testimonial.featured && (
                                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-[8px] md:text-[10px] px-3 py-1 rounded-bl-lg font-bold">
                                                            DESTACADO
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="quienes-somos" className="section-padding px-3 md:px-4 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                <div className="container-custom max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8 md:mb-12"
                    >
                        <div className="text-[10px] md:text-sm font-semibold text-primary mb-2 md:mb-3 tracking-widest uppercase">Sobre Nosotros</div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-['Outfit'] font-bold text-foreground mb-4 md:mb-6 px-4">
                            Traemos el Poder de la Tecnología al Negocio
                        </h2>
                        <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Equipo apasionado de diseñadores y desarrolladores dedicados a crear experiencias digitales excepcionales que impulsan el éxito de nuestros clientes
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl group">
                                <img src="/team.png" alt="Nuestro equipo" className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary rounded-full opacity-20 blur-3xl" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            {[
                                { icon: '⚡', title: 'Soluciones Innovadoras', desc: 'Transformar ideas en soluciones digitales de vanguardia' },
                                { icon: '🎨', title: 'Diseño Premium', desc: 'Combinar diseño atractivo y funcionalidad impecable' },
                                { icon: '📈', title: 'Resultados Medibles', desc: 'Generar crecimiento real y medible para tu negocio' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card glass-hover p-4 md:p-5 rounded-2xl group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl md:text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{item.title}</h3>
                                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-700">
                <div className="py-12 px-4">
                    <div className="container-custom">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            {/* Brand Section */}
                            <div className="md:col-span-1">
                                <div className="bg-slate-800 border border-slate-600 p-6 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Globe className="h-8 w-8 text-primary" />
                                        <div className="font-['Outfit'] leading-tight">
                                            <div className="text-base font-bold text-white">Alejandro López</div>
                                            <div className="text-xs text-slate-300">Portfolio Web</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-200 leading-relaxed mb-4">
                                        Soluciones digitales innovadoras que transforman tu presencia en línea
                                    </p>

                                    {/* Social Media Icons */}
                                    <div className="flex gap-3">
                                        {[
                                            { icon: '🌐', label: 'Web' },
                                            { icon: '💼', label: 'LinkedIn' },
                                            { icon: '📧', label: 'Email' }
                                        ].map((social, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                                            >
                                                <span className="text-lg group-hover:scale-110 transition-transform">
                                                    {social.icon}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div>
                                <h4 className="font-bold text-base mb-4 text-white">Servicios</h4>
                                <ul className="space-y-2.5">
                                    {['Tiendas Virtuales', 'Diseño Web', 'SEO', 'E-commerce'].map((service, i) => (
                                        <li key={i}>
                                            <a href="#portafolio" className="text-sm text-slate-200 hover:text-secondary transition-colors flex items-center gap-2 group">
                                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                {service}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="font-bold text-base mb-4 text-white">Empresa</h4>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: '¿Quiénes somos?', href: '#quienes-somos' },
                                        { label: 'Portafolio', href: '#portafolio' },
                                        { label: 'Planes', href: '#planes' },
                                        { label: 'Testimonios', href: '#testimonios' }
                                    ].map((item, i) => (
                                        <li key={i}>
                                            <a href={item.href} className="text-sm text-slate-200 hover:text-secondary transition-colors flex items-center gap-2 group">
                                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>

                        {/* Bottom Bar */}
                        <div className="pt-8 border-t border-slate-700">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-slate-300 text-center md:text-left">
                                    © 2026 <span className="text-secondary font-semibold">www.alejandropro.co</span> - Todos los derechos reservados
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-[9999] bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl py-2 min-w-[220px]"
                    style={{
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className="px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span className="font-bold text-sm text-foreground">Alejandro López</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Portfolio de Servicios</p>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={() => {
                                window.location.reload()
                                setContextMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 text-foreground"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Recargar página
                        </button>

                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                setContextMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 text-foreground"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Ir al inicio
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                setContextMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 text-foreground"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copiar enlace
                        </button>

                        <div className="border-t border-gray-200 my-1"></div>

                        <button
                            onClick={() => {
                                window.print()
                                setContextMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors flex items-center gap-2 text-foreground"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Imprimir
                        </button>
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200">
                        <p className="text-xs text-muted-foreground text-center">
                            © 2026 www.alejandropro.co
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
