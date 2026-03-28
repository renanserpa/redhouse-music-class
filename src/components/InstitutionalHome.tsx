import React, { useLayoutEffect } from 'react';
import { 
  LayoutGrid, 
  Play, 
  BarChart3, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle, 
  Zap, 
  Star, 
  LineChart, 
  ShieldCheck 
} from 'lucide-react';

export default function InstitutionalHome() {
  useLayoutEffect(() => {
    // Reveal on Scroll
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", reveal);
    reveal(); // Initial check

    // Smooth Scroll
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const id = anchor.getAttribute('href')?.substring(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            e.preventDefault();
            element.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);

    return () => {
      window.removeEventListener("scroll", reveal);
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-redhouse-primary selection:text-white">
      <style>{`
        :root {
          --redhouse-primary: #C21233;
          --redhouse-dark: #111827;
          --redhouse-accent: #B2945F;
          --bg-light: #FFFFFF;
          --bg-accent: #F9FAFB;
        }
        
        .font-display { font-family: 'Anton', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .text-redhouse { color: var(--redhouse-primary); }
        .bg-redhouse { background-color: var(--redhouse-primary); }
        
        .hero-gradient {
          background: radial-gradient(circle at 50% 30%, rgba(194, 18, 51, 0.05) 0%, transparent 70%),
                      radial-gradient(circle at 10% 80%, rgba(178, 148, 95, 0.05) 0%, transparent 50%);
        }
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .card-shadow {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .card-shadow:hover {
          border-color: var(--redhouse-primary);
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        .marquee {
          white-space: nowrap;
          overflow: hidden;
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        .stakeholder-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .stakeholder-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 4px;
          background: var(--redhouse-primary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .stakeholder-card:hover::before {
          transform: scaleX(1);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
        }

        .screen-container {
          border-radius: 2rem;
          overflow: hidden;
          border: 8px solid #F3F4F6;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center glass mt-4 mx-auto max-w-7xl rounded-full left-0 right-0 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="https://redhouse.com.br/data/files/E3/23/0A/18/E1D589105CDF6589F81849A8/logo_red_house_196x72.webp" alt="RedHouse Logo" className="h-8 md:h-10" />
          <div className="hidden sm:flex flex-col -space-y-1 border-l border-black/10 pl-3">
            <span className="font-display text-xl tracking-tighter uppercase italic text-gray-900 leading-none">Music <span className="text-redhouse">Lab</span></span>
            <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-gray-400">Ensemble Program</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-8 font-semibold text-[10px] uppercase tracking-widest text-gray-500">
          <a href="#dashboard" className="hover:text-redhouse transition-colors">Plataforma</a>
          <a href="#journey" className="hover:text-redhouse transition-colors">Jornada</a>
          <a href="#methods" className="hover:text-redhouse transition-colors">Métodos</a>
          <a href="#presentation" className="hover:text-redhouse transition-colors">Modo TV</a>
        </div>
        <a href="/app" className="bg-redhouse text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-redhouse/20">
          Acessar Plataforma
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 hero-gradient overflow-hidden text-center bg-white">
        <div className="container mx-auto px-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-redhouse/10 bg-redhouse/5 text-redhouse text-[9px] font-bold uppercase tracking-[0.3em] mb-8">
            <span className="w-2 h-2 bg-redhouse rounded-full animate-ping"></span> Orquestra Filarmônica Digital
          </div>
          
          <h1 className="font-display text-[10vw] md:text-[7rem] leading-[0.85] uppercase italic tracking-tighter mb-6 text-gray-900 reveal">
            A EXPERIÊNCIA <br /> <span className="text-redhouse">MUSIC LAB</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-2xl text-gray-500 font-serif italic mb-12 leading-relaxed reveal" style={{ transitionDelay: '0.1s' }}>
            "Excelência pedagógica e precisão técnica em um ambiente visualmente equilibrado para o aprendizado."
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16 reveal" style={{ transitionDelay: '0.2s' }}>
            <a href="#dashboard" className="group relative px-12 py-6 bg-gray-900 text-white rounded-2xl font-black text-xl uppercase italic tracking-tighter overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-black/30">
              <span className="relative z-10 flex items-center gap-3 font-sans">
                GCM MAESTRO <LayoutGrid className="w-6 h-6" />
              </span>
            </a>
            <a href="/app" className="group relative px-12 py-6 bg-redhouse text-white rounded-2xl font-black text-xl uppercase italic tracking-tighter overflow-hidden transition-all hover:scale-105 shadow-2xl shadow-redhouse/30">
              <span className="relative z-10 flex items-center gap-3">
                MUSIC LAB <Play className="w-6 h-6" />
              </span>
            </a>
            <div className="text-left border-l border-black/10 pl-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 font-sans">Idealizado por</p>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter italic">Prof. Mateus & Olie Music</p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div id="dashboard" className="max-w-6xl mx-auto screen-container shadow-2xl reveal" style={{ transform: 'perspective(1000px) rotateX(10deg)', transitionDelay: '0.3s' }}>
            <img src="/Users/serpa/.gemini/antigravity/brain/f0ac9da3-d2d8-4948-8005-5ef00f62bf5a/dashboard_hub_v2_1774628085106.png" className="w-full h-auto" alt="Dashboard Hub" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-gray-900 py-4 overflow-hidden border-y-2 border-black rotate-[-0.5deg] z-20 relative">
        <div className="marquee flex gap-12 items-center">
          {[
            "Violão", "Ukulele", "Piano", "Bateria", "Voz", "Musicalização", 
            "Violino", "Viola", "Cello", "Contrabaixo", "Flauta", "Clarinete", 
            "Saxofone", "Trompete", "Trombone", "Tuba"
          ].map((item, i) => (
            <span key={i} className="font-display text-2xl uppercase italic text-white/90">{item}</span>
          ))}
          {/* Repeat for continuous effect */}
          {[
            "Violão", "Ukulele", "Piano", "Bateria", "Voz", "Musicalização", 
            "Violino", "Viola", "Cello", "Contrabaixo", "Flauta", "Clarinete", 
            "Saxofone", "Trompete", "Trombone", "Tuba"
          ].map((item, i) => (
            <span key={`rep-${i}`} className="font-display text-2xl uppercase italic text-white/90">{item}</span>
          ))}
        </div>
      </div>

      {/* Journey Section */}
      <section id="journey" className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 screen-container shadow-xl reveal">
              <img src="/Users/serpa/.gemini/antigravity/brain/f0ac9da3-d2d8-4948-8005-5ef00f62bf5a/rockstar_journey_map_1774628154277.png" className="w-full h-auto" alt="Journey Map" />
            </div>
            <div className="order-1 lg:order-2 reveal" style={{ transitionDelay: '0.2s' }}>
              <h2 className="font-display text-6xl md:text-8xl uppercase italic tracking-tighter leading-none mb-8 text-gray-900">
                JORNADA <br /> <span className="text-redhouse">DO ALUNO</span>
              </h2>
              <p className="text-gray-500 text-xl font-medium mb-12 leading-relaxed font-sans">
                O sistema de progressão é visualizado através de um mapa interativo de 5 mundos. O aluno sabe exatamente de onde veio e para onde está indo.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-black/5">
                  <h4 className="font-display text-2xl text-redhouse">98%</h4>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Engajamento Semanal</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-black/5">
                  <h4 className="font-display text-2xl text-redhouse">5 Mundos</h4>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Trilha Pedagógica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section id="presentation" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-6xl md:text-8xl uppercase italic tracking-tighter mb-4 text-gray-900">MODO <span className="text-redhouse">TV REGENTE</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-sans font-medium italic">A regência digital que sincroniza toda a classe em uma performance coletiva.</p>
          </div>
          
          <div className="max-w-6xl mx-auto screen-container shadow-2xl reveal">
            <img src="/Users/serpa/.gemini/antigravity/brain/f0ac9da3-d2d8-4948-8005-5ef00f62bf5a/lesson_console_tv_mode_attempt_1774640235087.png" className="w-full h-auto" alt="Modo TV Regente - Active Lesson Console" />
          </div>
        </div>
      </section>

      {/* Bento Portfolio */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bento-grid">
            <div className="bg-white p-8 rounded-[3rem] col-span-2 shadow-sm border border-black/5 flex items-center gap-8 overflow-hidden">
              <div className="w-48 shrink-0 rounded-2xl border border-black/5 shadow-inner">
                <img src="/Users/serpa/.gemini/antigravity/brain/f0ac9da3-d2d8-4948-8005-5ef00f62bf5a/sidebar_navigation_1774628071904.png" className="w-full h-auto" alt="Sidebar Navigation" />
              </div>
              <div>
                <h4 className="font-display text-3xl uppercase italic mb-4">Acesso <span className="text-redhouse">Total</span></h4>
                <p className="text-gray-500 text-sm font-sans mb-4">Navegação intuitiva por módulos pedagógicos, jogos e biblioteca de recursos.</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-500">Multimodal</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-bold uppercase tracking-widest text-gray-500">Sincronizado</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[3rem] col-span-2 shadow-sm border border-black/5 relative overflow-hidden">
              <div className="w-16 h-16 bg-redhouse rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-redhouse/20 text-white">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-3xl uppercase italic mb-4 text-gray-900">Governance & BI</h3>
              <p className="text-gray-500 font-sans mb-6">Relatórios semanais de assiduidade e progresso entregues automaticamente para a diretoria.</p>
              <div className="flex items-center gap-4 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <TrendingUp className="w-5 h-5" />
                Evidência de Crescimento
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section id="stakeholders" className="py-32 bg-gray-50 border-t border-black/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <h2 className="font-display text-6xl md:text-8xl uppercase italic tracking-tighter mb-4 text-gray-900">O DIA A DIA NA <span className="text-redhouse">LAB</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Como a ferramenta integra a rotina de todos os envolvidos no processo educativo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[4rem] stakeholder-card reveal shadow-xl shadow-black/5 border border-black/5">
              <div className="w-16 h-16 bg-redhouse/10 rounded-2xl flex items-center justify-center mb-8">
                <GraduationCap className="text-redhouse w-8 h-8" />
              </div>
              <h3 className="font-display text-3xl uppercase italic mb-6 text-gray-900">O Professor</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Utiliza o <strong>Music Lab</strong> para nivelar a turma. Em vez de repetir conceitos básicos, foca na regência do <strong>Ensemble</strong>, as ferramentas garantem o domínio dos fundamentos rítmicos.</p>
              <ul className="space-y-4 text-gray-900/70 text-xs font-bold uppercase tracking-widest">
                <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-redhouse" /> Relatórios de Progresso</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-redhouse" /> Suporte ao Bilíngue</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-redhouse" /> Gestão de Repertório</li>
              </ul>
            </div>

            <div className="bg-white p-12 rounded-[4rem] stakeholder-card border-redhouse/20 reveal shadow-2xl shadow-redhouse/5" style={{ transitionDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-redhouse rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-redhouse/20">
                <Zap className="text-white w-8 h-8" />
              </div>
              <h3 className="font-display text-3xl uppercase italic mb-6 text-gray-900">O Aluno</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Vive uma jornada de <strong>Rockstar</strong>. Pratica em pequenos blocos na aula, ganhando XP e moedas. O feedback visual traz segurança para brilhar nos ensaios coletivos.</p>
              <ul className="space-y-4 text-gray-900/70 text-xs font-bold uppercase tracking-widest">
                <li className="flex items-center gap-3"><Star className="w-4 h-4 text-yellow-500" /> Gamificação Real</li>
                <li className="flex items-center gap-3"><Star className="w-4 h-4 text-yellow-500" /> Autonomia no Estudo</li>
                <li className="flex items-center gap-3"><Star className="w-4 h-4 text-yellow-500" /> Conquistas & Medalhas</li>
              </ul>
            </div>

            <div className="bg-white p-12 rounded-[4rem] stakeholder-card reveal shadow-xl shadow-black/5 border border-black/5" style={{ transitionDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-8">
                <LineChart className="text-gray-900 w-8 h-8" />
              </div>
              <h3 className="font-display text-3xl uppercase italic mb-6 text-gray-900">A Diretoria</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Visualiza o fortalecimento do programa. Dados claros sobre o engajamento e apresentações escolares com qualidade técnica superior.</p>
              <ul className="space-y-4 text-gray-900/70 text-xs font-bold uppercase tracking-widest">
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-green-600" /> Valor Agregado</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-green-600" /> Integração Curricular</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-green-600" /> Visibilidade de Resultados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-5xl md:text-7xl uppercase italic tracking-tighter text-center mb-20 reveal text-gray-900">PLANO DE <span className="text-redhouse">IMPLEMENTAÇÃO</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 hidden md:block -translate-y-1/2"></div>
            
            <div className="relative z-10 bg-white p-8 border border-black/5 rounded-3xl text-center group hover:border-redhouse transition-colors reveal shadow-xl">
              <div className="w-12 h-12 bg-redhouse rounded-full flex items-center justify-center text-white font-display text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">01</div>
              <h4 className="font-display text-3xl uppercase italic mb-4 text-gray-900">Fase Inicial</h4>
              <ul className="text-gray-500 text-xs space-y-2 font-bold uppercase tracking-widest">
                <li>Inserção do Lab nas aulas</li>
                <li>Testes com atividades de base</li>
              </ul>
            </div>

            <div className="relative z-10 bg-white p-8 border border-black/5 rounded-3xl text-center group hover:border-redhouse transition-colors reveal shadow-xl" style={{ transitionDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-redhouse rounded-full flex items-center justify-center text-white font-display text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">02</div>
              <h4 className="font-display text-3xl uppercase italic mb-4 text-gray-900">Organização</h4>
              <ul className="text-gray-500 text-xs space-y-2 font-bold uppercase tracking-widest">
                <li>Estruturação do Ensemble</li>
                <li>Início de ensaios simples</li>
              </ul>
            </div>

            <div className="relative z-10 bg-white p-8 border border-black/5 rounded-3xl text-center group hover:border-redhouse transition-colors reveal shadow-xl" style={{ transitionDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-redhouse rounded-full flex items-center justify-center text-white font-display text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">03</div>
              <h4 className="font-display text-3xl uppercase italic mb-4 text-gray-900">Consolidação</h4>
              <ul className="text-gray-500 text-xs space-y-2 font-bold uppercase tracking-widest">
                <li>Repertório de Apresentação</li>
                <li>Apresentação Final</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden bg-white text-center reveal">
        <div className="absolute inset-0 bg-redhouse/5 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display text-7xl md:text-[8rem] uppercase italic tracking-tighter mb-12 leading-none text-gray-900">VAMOS <br /> <span className="text-redhouse">TOCAR JUNTOS?</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 font-serif italic">
            "A tecnologia simplifica o complexo para focar no que importa: a conexão humana."
          </p>
          <a href="/app" className="inline-block bg-gray-900 text-white px-16 py-8 rounded-3xl font-black text-3xl uppercase italic tracking-tighter hover:bg-redhouse transition-all hover:scale-105 shadow-2xl">
            Acessar Plataforma agora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <img src="https://redhouse.com.br/data/files/E3/23/0A/18/E1D589105CDF6589F81849A8/logo_red_house_196x72.webp" alt="RedHouse Logo" className="h-8 md:h-10" />
              <span className="font-display text-xl tracking-tighter uppercase italic border-l border-black/10 pl-3 text-gray-900">Red House <span className="text-redhouse">Music Lab</span></span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 font-sans text-center md:text-right">
              © 2026 RedHouse School. <br /> Desenvolvido por <a href="https://www.oliemusic.com.br" className="text-redhouse hover:underline">OlieMusic</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
