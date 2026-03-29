import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'ko' | 'ja' | 'zh' | 'fr' | 'de';

export interface Translation {
  // Hero / Landing
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  navHome: string;
  navFeatures: string;
  navMission: string;
  navPhilosophy: string;
  navPlans: string;
  requestAccess: string;
  
  // Features
  featuresLabel: string;
  featuresTitle: string;
  featuresSubtitle: string;
  featuresDescription: string;
  feature1: string;
  feature2: string;
  feature3: string;
  
  // Mission
  missionLabel: string;
  missionTitle: string;
  missionSubtitle: string;
  missionDescription: string;
  
  // Goal
  goalLabel: string;
  goalTitle: string;
  goalSubtitle: string;
  goalDescription: string;
  
  // Philosophy
  philosophyLabel: string;
  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyDescription: string;
  
  // Plans
  recommended: string;
  
  // App - Main
  appTitle: string;
  inputPlaceholder: string;
  holdToRelease: string;
  releasing: string;
  released: string;
  dailyCount: string;
  globalCount: string;
  onlineUsers: string;
  
  // App - Rituals
  ritualStandard: string;
  ritualStandardDesc: string;
  ritualHeavy: string;
  ritualHeavyDesc: string;
  ritualEcho: string;
  ritualEchoDesc: string;
  ritualMist: string;
  ritualMistDesc: string;
  ritualOracle: string;
  ritualOracleDesc: string;
  
  // App - Settings/Profile
  settings: string;
  profile: string;
  theme: string;
  language: string;
  logout: string;
  adminPanel: string;
  
  // Stats
  statsTitle: string;
  totalReleases: string;
  monthlyActivity: string;
  streak: string;
  
  // Footer
  footerCopyright: string;
  footerTagline: string;

  // Dynamic Headings
  headings: string[];
  subheadings: string[];

  // Aftermath Messages
  angryMessages: string[];
  sadMessages: string[];
  neutralMessages: string[];
  oracleMessages: string[];

  // App UI
  askTheVoid: string;
  whisperToTheVoid: string;
  typeYourThoughts: string;
  holdEnterOrButton: string;
  insights: string;
  zen: string;
  admin: string;
  enteringVoid: string;
  releaseHeaviest: string;
  privateSpace: string;
  enterTheVoid: string;
  connectingToVoid: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;
  allRightsReleased: string;
  welcomePro: string;
}

const translations: Record<Language, Translation> = {
  en: {
    heroTitle: "Where thoughts rise",
    heroSubtitle: "through the silence.",
    heroDescription: "An anti-journal for the thoughts you don't want to keep. Speak your truth, watch it dissolve, and find peace in the silence. We build digital spaces for sharp focus and inspired release.",
    heroCTA: "Enter the Void",
    navHome: "Home",
    navFeatures: "Features",
    navMission: "Mission",
    navPhilosophy: "Philosophy",
    navPlans: "Plans",
    requestAccess: "Enter the Void",
    featuresLabel: "Features",
    featuresTitle: "Total Privacy.",
    featuresSubtitle: "Absolute Freedom.",
    featuresDescription: "Your words are never stored. They exist only long enough to be released. Experience unique 3D visual destructions of your heavy thoughts in a completely secure environment.",
    feature1: "Zero-knowledge architecture",
    feature2: "Instant cryptographic shredding",
    feature3: "No tracking, no history",
    missionLabel: "What it is",
    missionTitle: "The Anti-Journal.",
    missionSubtitle: "A Digital Void.",
    missionDescription: "Unlike traditional journals designed to preserve memories, Anti-Journal is built to destroy them. It is a sanctuary for the thoughts that weigh you down, offering a cathartic release through beautiful, ephemeral interactions.",
    goalLabel: "Our Goal",
    goalTitle: "Instant Catharsis.",
    goalSubtitle: "Mental Clarity.",
    goalDescription: "Our goal is to provide a safe, untraceable outlet for frustration, anxiety, and overwhelming thoughts. By visualizing the destruction of these thoughts, we help you achieve mental clarity and emotional reset.",
    philosophyLabel: "Why We Care",
    philosophyTitle: "Atmospheric.",
    philosophySubtitle: "Empathetic Design.",
    philosophyDescription: "We believe that not everything needs to be saved. In a world obsessed with data retention, we champion the right to forget. We care about your mental space, designing cosmic themes to match your emotional state and facilitate letting go.",
    recommended: "Recommended",
    appTitle: "Anti-Journal",
    inputPlaceholder: "What weighs on your mind?",
    holdToRelease: "Hold to release into the void",
    releasing: "Releasing...",
    released: "Released",
    dailyCount: "Thoughts Cleared Today",
    globalCount: "Released Thoughts Today",
    onlineUsers: "In the Void",
    ritualStandard: "Standard",
    ritualStandardDesc: "Direct release with standard physics",
    ritualHeavy: "Heavy Lift",
    ritualHeavyDesc: "Extended hold for heavier thoughts",
    ritualEcho: "Echo",
    ritualEchoDesc: "Watch your words ripple before fading",
    ritualMist: "Morning Mist",
    ritualMistDesc: "Total disintegration into stardust",
    ritualOracle: "Ritual Oracle",
    ritualOracleDesc: "Seek guidance from the void. Ask a question and let the cosmos answer.",
    settings: "Settings",
    profile: "Profile",
    theme: "Theme",
    language: "Language",
    logout: "Logout",
    adminPanel: "Admin Panel",
    statsTitle: "Your Journey",
    totalReleases: "Total Releases",
    monthlyActivity: "Monthly Activity",
    streak: "Current Streak",
    footerCopyright: "PrimeDev Studios. All rights reserved.",
    footerTagline: "A product of PrimeDev Studios • Anti-Journaling Protocol",
    headings: [
      "What's weighing on your mind?",
      "What are you holding onto?",
      "What needs to be released?",
      "What's the heavy thought today?",
      "Speak your truth to the silence.",
      "What's echoing in your heart?",
      "Let it all out here.",
      "What's the burden you carry?",
    ],
    subheadings: [
      "The universe is listening.",
      "The silence is your witness.",
      "The stars will hold your secrets.",
      "Release it to the infinite.",
      "Your words belong to the void now.",
      "Let the darkness consume the weight.",
      "Find peace in the release.",
      "The cosmos absorbs your heavy thoughts.",
    ],
    angryMessages: [
      "The fire consumes it.", "Let the ash scatter.", "Your rage is absorbed.", "The heat dissipates.", "Breathe out the fire.",
      "Release the tension.", "Feel the weight lift.", "Let the anger fade.", "You are in control.", "Breathe in... and out..."
    ],
    sadMessages: [
      "Tears lost in the void.", "The ache softens.", "You are held by the silence.", "Let the sorrow drift.", "It is okay to let go.",
      "Be kind to yourself.", "This too shall pass.", "You are not alone.", "Breathe in... and out...", "Write down your thoughts..."
    ],
    neutralMessages: [
      "Breathe. It's gone.", "Lightness returns.", "The void is quiet.",
      "Letting go is freedom.", "Clearer now.", "Peace found.", "Unburdened.",
      "Breathe in... and out...", "Write down your thoughts...", "Focus on your breath.", "You are here. You are safe."
    ],
    oracleMessages: [
      "The stars align in your favor.", "A new path reveals itself.", "The void answers with silence.", "Your question is the answer.", "Look within for the truth.", "The cosmos is indifferent.", "A shift in perspective is needed.", "Patience is your ally.", "The answer is obscured by clouds.", "Trust the journey."
    ],
    askTheVoid: "Ask the Void",
    whisperToTheVoid: "Whisper to the void...",
    typeYourThoughts: "Type your thoughts...",
    holdEnterOrButton: "Hold Enter or the button to release",
    insights: "Insights",
    zen: "Zen",
    admin: "Admin",
    enteringVoid: "Entering the void...",
    releaseHeaviest: "Release your heaviest thoughts into the void",
    privateSpace: "AntiJournal is a private space to let go of what weighs you down. No tracking, no judgment, just release.",
    enterTheVoid: "Enter the void...",
    connectingToVoid: "Connecting to the void...",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
    allRightsReleased: "© 2026 Anti-Journal. All rights released.",
    welcomePro: "Welcome to Pro. The void expands.",
  },
  es: {
    heroTitle: "Donde los pensamientos surgen",
    heroSubtitle: "a través del silencio.",
    heroDescription: "Un anti-diario para los pensamientos que no quieres conservar. Di tu verdad, mira cómo se disuelve y encuentra la paz en el silencio. Construimos espacios digitales para un enfoque agudo y una liberación inspirada.",
    heroCTA: "Entrar al Vacío",
    navHome: "Inicio",
    navFeatures: "Características",
    navMission: "Misión",
    navPhilosophy: "Filosofía",
    navPlans: "Planes",
    requestAccess: "Entrar al Vacío",
    featuresLabel: "Características",
    featuresTitle: "Privacidad Total.",
    featuresSubtitle: "Libertad Absoluta.",
    featuresDescription: "Tus palabras nunca se guardan. Existen solo lo suficiente para ser liberadas. Experimenta destrucciones visuales 3D únicas de tus pensamientos pesados en un entorno completamente seguro.",
    feature1: "Arquitectura de conocimiento cero",
    feature2: "Trituración criptográfica instantánea",
    feature3: "Sin rastreo, sin historial",
    missionLabel: "Qué es",
    missionTitle: "El Anti-Diario.",
    missionSubtitle: "Un Vacío Digital.",
    missionDescription: "A diferencia de los diarios tradicionales diseñados para preservar recuerdos, Anti-Journal está hecho para destruirlos. Es un santuario para los pensamientos que te agobian, ofreciendo una liberación catártica a través de interacciones hermosas y efímeras.",
    goalLabel: "Nuestro Objetivo",
    goalTitle: "Catarsis Instantánea.",
    goalSubtitle: "Claridad Mental.",
    goalDescription: "Nuestro objetivo es proporcionar una salida segura e irrastreable para la frustración, la ansiedad y los pensamientos abrumadores. Al visualizar la destrucción de estos pensamientos, te ayudamos a lograr claridad mental y un reinicio emocional.",
    philosophyLabel: "Por qué nos importa",
    philosophyTitle: "Atmosférico.",
    philosophySubtitle: "Diseño Empático.",
    philosophyDescription: "Creemos que no todo necesita ser guardado. En un mundo obsesionado con la retención de datos, defendemos el derecho al olvido. Nos importa tu espacio mental, diseñando temas cósmicos para que coincidan con tu estado emocional y faciliten el dejar ir.",
    recommended: "Recomendado",
    appTitle: "Anti-Journal",
    inputPlaceholder: "¿Qué pesa en tu mente?",
    holdToRelease: "Mantén para liberar al vacío",
    releasing: "Liberando...",
    released: "Liberado",
    dailyCount: "Pensamientos Liberados Hoy",
    globalCount: "Pensamientos Globales Hoy",
    onlineUsers: "En el Vacío",
    ritualStandard: "Estándar",
    ritualStandardDesc: "Liberación directa con física estándar",
    ritualHeavy: "Carga Pesada",
    ritualHeavyDesc: "Mantenimiento prolongado para pensamientos pesados",
    ritualEcho: "Eco",
    ritualEchoDesc: "Mira tus palabras ondular antes de desvanecerse",
    ritualMist: "Niebla Matinal",
    ritualMistDesc: "Descomposición completa en polvo de estrellas",
    ritualOracle: "Oráculo Ritual",
    ritualOracleDesc: "Busca orientación en el vacío. Haz una pregunta y deja que el cosmos responda.",
    settings: "Ajustes",
    profile: "Perfil",
    theme: "Tema",
    language: "Idioma",
    logout: "Cerrar Sesión",
    adminPanel: "Panel de Admin",
    statsTitle: "Tu Viaje",
    totalReleases: "Liberaciones Totales",
    monthlyActivity: "Actividad Mensual",
    streak: "Racha Actual",
    footerCopyright: "PrimeDev Studios. Todos los derechos reservados.",
    footerTagline: "Un producto de PrimeDev Studios • Protocolo Anti-Journaling",
    headings: [
      "¿Qué pesa en tu mente?",
      "¿A qué te estás aferrando?",
      "¿Qué necesita ser liberado?",
      "¿Cuál es el pensamiento pesado hoy?",
      "Di tu verdad al silencio.",
      "¿Qué está resonando en tu corazón?",
      "Suéltalo todo aquí.",
      "¿Cuál es la carga que llevas?",
    ],
    subheadings: [
      "El universo está escuchando.",
      "El silencio es tu testigo.",
      "Las estrellas guardarán tus secretos.",
      "Libéralo al infinito.",
      "Tus palabras pertenecen al vacío ahora.",
      "Deja que la oscuridad consuma el peso.",
      "Encuentra la paz en la liberación.",
      "El cosmos absorbe tus pensamientos pesados.",
    ],
    angryMessages: [
      "El fuego lo consume.", "Deja que la ceniza se disperse.", "Tu rabia es absorbida.", "El calor se disipa.", "Exhala el fuego.",
      "Libera la tensión.", "Siente cómo se levanta el peso.", "Deja que la ira se desvanezca.", "Tú tienes el control.", "Inhala... y exhala..."
    ],
    sadMessages: [
      "Lágrimas perdidas en el vacío.", "El dolor se suaviza.", "El silencio te sostiene.", "Deja que la tristeza flote.", "Está bien dejar ir.",
      "Sé amable contigo mismo.", "Esto también pasará.", "No estás solo.", "Inhala... y exhala...", "Escribe tus pensamientos..."
    ],
    neutralMessages: [
      "Respira. Se ha ido.", "Vuelve la ligereza.", "El vacío está en calma.",
      "Soltar es libertad.", "Más claro ahora.", "Paz encontrada.", "Sin cargas.",
      "Inhala... y exhala...", "Escribe tus pensamientos...", "Concéntrate en tu respiración.", "Estás aquí. Estás a salvo."
    ],
    oracleMessages: [
      "Las estrellas se alinean a tu favor.", "Un nuevo camino se revela.", "El vacío responde con silencio.", "Tu pregunta es la respuesta.", "Busca la verdad en tu interior.", "El cosmos es indiferente.", "Se necesita un cambio de perspectiva.", "La paciencia es tu aliada.", "La respuesta está oscurecida por las nubes.", "Confía en el viaje."
    ],
    askTheVoid: "Pregunta al Vacío",
    whisperToTheVoid: "Susurra al vacío...",
    typeYourThoughts: "Escribe tus pensamientos...",
    holdEnterOrButton: "Mantén presionado Enter o el botón para liberar",
    insights: "Perspectivas",
    zen: "Zen",
    admin: "Admin",
    enteringVoid: "Entrando al vacío...",
    releaseHeaviest: "Libera tus pensamientos más pesados al vacío",
    privateSpace: "AntiJournal es un espacio privado para soltar lo que te agobia. Sin rastreo, sin juicios, solo liberación.",
    enterTheVoid: "Entrar al vacío...",
    connectingToVoid: "Conectando con el vacío...",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    cookiePolicy: "Política de Cookies",
    allRightsReleased: "© 2026 Anti-Journal. Todos los derechos liberados.",
    welcomePro: "Bienvenido a Pro. El vacío se expande.",
  },
  ko: {
    heroTitle: "생각이 떠오르는 곳",
    heroSubtitle: "침묵을 통해.",
    heroDescription: "간직하고 싶지 않은 생각들을 위한 안티 저널입니다. 진실을 말하고, 그것이 사라지는 것을 지켜보며 침묵 속에서 평화를 찾으세요. 우리는 날카로운 집중과 영감을 주는 해방을 위한 디지털 공간을 만듭니다.",
    heroCTA: "공허 속으로",
    navHome: "홈",
    navFeatures: "기능",
    navMission: "미션",
    navPhilosophy: "철학",
    navPlans: "플랜",
    requestAccess: "공허 속으로",
    featuresLabel: "기능",
    featuresTitle: "완벽한 프라이버시.",
    featuresSubtitle: "절대적인 자유.",
    featuresDescription: "당신의 말은 절대 저장되지 않습니다. 해방될 때까지만 존재합니다. 완전히 안전한 환경에서 무거운 생각들이 독특한 3D 비주얼로 파괴되는 것을 경험하세요.",
    feature1: "제로 지식 아키텍처",
    feature2: "즉각적인 암호화 파쇄",
    feature3: "추적 없음, 기록 없음",
    missionLabel: "정의",
    missionTitle: "안티 저널.",
    missionSubtitle: "디지털 공허.",
    missionDescription: "기억을 보존하기 위해 설계된 전통적인 저널과 달리, 안티 저널은 기억을 파괴하기 위해 만들어졌습니다. 당신을 짓누르는 생각들을 위한 안식처이며, 아름답고 덧없는 상호작용을 통해 카타르시스를 제공합니다.",
    goalLabel: "목표",
    goalTitle: "즉각적인 카타르시스.",
    goalSubtitle: "정신적 명료함.",
    goalDescription: "우리의 목표는 좌절, 불안, 압도적인 생각들을 위한 안전하고 추적 불가능한 배출구를 제공하는 것입니다. 이러한 생각들의 파괴를 시각화함으로써 정신적 명료함과 정서적 리셋을 돕습니다.",
    philosophyLabel: "우리가 신경 쓰는 이유",
    philosophyTitle: "대기적인.",
    philosophySubtitle: "공감하는 디자인.",
    philosophyDescription: "우리는 모든 것을 저장할 필요는 없다고 믿습니다. 데이터 보존에 집착하는 세상에서 우리는 잊힐 권리를 옹호합니다. 우리는 당신의 정신적 공간을 소중히 여기며, 당신의 감정 상태에 맞춘 우주적 테마를 디자인하여 내려놓음을 돕습니다.",
    recommended: "추천",
    appTitle: "안티 저널",
    inputPlaceholder: "무엇이 당신의 마음을 짓누르나요?",
    holdToRelease: "공허로 해방하려면 길게 누르세요",
    releasing: "해방 중...",
    released: "해방됨",
    dailyCount: "오늘 비운 생각",
    globalCount: "오늘 해방된 글로벌 생각",
    onlineUsers: "공허 속에 있음",
    ritualStandard: "표준",
    ritualStandardDesc: "표준 물리를 통한 직접 해방",
    ritualHeavy: "심층 해방",
    ritualHeavyDesc: "무거운 생각을 위한 연장된 홀드",
    ritualEcho: "에코",
    ritualEchoDesc: "사라지기 전 당신의 말이 물결치는 것을 보세요",
    ritualMist: "모닝 미스트",
    ritualMistDesc: "스타더스트로의 완전한 분해",
    ritualOracle: "의식의 오라클",
    ritualOracleDesc: "공허에서 지혜를 구하세요. 질문을 던지고 우주의 대답을 들으세요.",
    settings: "설정",
    profile: "프로필",
    theme: "테마",
    language: "언어",
    logout: "로그아웃",
    adminPanel: "관리자 패널",
    statsTitle: "당신의 여정",
    totalReleases: "총 해방 횟수",
    monthlyActivity: "월간 활동",
    streak: "현재 스트릭",
    footerCopyright: "PrimeDev Studios. 모든 권리 보유.",
    footerTagline: "PrimeDev Studios 제품 • 안티 저널링 프로토콜",
    headings: [
      "무엇이 당신의 마음을 짓누르나요?",
      "무엇을 붙잡고 있나요?",
      "무엇을 해방해야 하나요?",
      "오늘의 무거운 생각은 무엇인가요?",
      "침묵 속에 당신의 진실을 말하세요.",
      "당신의 마음에 무엇이 울려 퍼지나요?",
      "여기서 모두 털어놓으세요.",
      "당신이 지고 있는 짐은 무엇인가요?",
    ],
    subheadings: [
      "우주가 듣고 있습니다.",
      "침묵이 당신의 증인입니다.",
      "별들이 당신의 비밀을 간직할 것입니다.",
      "무한함으로 해방하세요.",
      "당신의 말은 이제 공허의 것입니다.",
      "어둠이 무게를 삼키게 하세요.",
      "해방 속에서 평화를 찾으세요.",
      "우주가 당신의 무거운 생각을 흡수합니다.",
    ],
    angryMessages: [
      "불길이 그것을 태웁니다.", "재가 흩어지게 하세요.", "당신의 분노가 흡수됩니다.", "열기가 사라집니다.", "불길을 내뱉으세요.",
      "긴장을 푸세요.", "무게가 들리는 것을 느끼세요.", "분노가 사라지게 하세요.", "당신이 통제하고 있습니다.", "숨을 들이마시고... 내쉬고..."
    ],
    sadMessages: [
      "공허 속으로 사라진 눈물.", "통증이 완화됩니다.", "침묵이 당신을 감쌉니다.", "슬픔이 떠다니게 하세요.", "내려놓아도 괜찮습니다.",
      "자신에게 친절해지세요.", "이 또한 지나갈 것입니다.", "당신은 혼자가 아닙니다.", "숨을 들이마시고... 내쉬고...", "생각을 적어보세요..."
    ],
    neutralMessages: [
      "숨을 쉬세요. 사라졌습니다.", "가벼움이 돌아옵니다.", "공허가 조용합니다.",
      "내려놓는 것이 자유입니다.", "이제 더 맑아졌습니다.", "평화를 찾았습니다.", "짐을 벗었습니다.",
      "숨을 들이마시고... 내쉬고...", "생각을 적어보세요...", "호흡에 집중하세요.", "당신은 여기 있습니다. 당신은 안전합니다."
    ],
    oracleMessages: [
      "별들이 당신에게 유리하게 정렬됩니다.", "새로운 길이 드러납니다.", "공허가 침묵으로 답합니다.", "당신의 질문이 곧 답입니다.", "진실을 위해 내면을 들여다보세요.", "우주는 무관심합니다.", "관점의 변화가 필요합니다.", "인내가 당신의 동맹입니다.", "답이 구름에 가려져 있습니다.", "여정을 믿으세요."
    ],
    askTheVoid: "공허에 묻기",
    whisperToTheVoid: "공허에 속삭이세요...",
    typeYourThoughts: "생각을 입력하세요...",
    holdEnterOrButton: "엔터 키나 버튼을 길게 눌러 해방하세요",
    insights: "통찰",
    zen: "젠",
    admin: "관리자",
    enteringVoid: "공허로 들어가는 중...",
    releaseHeaviest: "가장 무거운 생각을 공허로 방출하세요",
    privateSpace: "AntiJournal은 당신을 짓누르는 것들을 내려놓을 수 있는 개인적인 공간입니다. 추적도, 심판도 없이 오직 방출만이 있습니다.",
    enterTheVoid: "공허로 들어가기...",
    connectingToVoid: "공허에 연결 중...",
    privacyPolicy: "개인정보 처리방침",
    termsOfService: "서비스 약관",
    cookiePolicy: "쿠키 정책",
    allRightsReleased: "© 2026 Anti-Journal. 모든 권리 방출됨.",
    welcomePro: "Pro에 오신 것을 환영합니다. 공허가 확장됩니다.",
  },
  ja: {
    heroTitle: "思考が昇華する場所",
    heroSubtitle: "静寂を通じて。",
    heroDescription: "残したくない思考のためのアンチジャーナル。真実を語り、それが消えていくのを見守り、静寂の中で安らぎを見つけてください。私たちは鋭い集中とインスピレーションあふれる解放のためのデジタル空間を構築します。",
    heroCTA: "虚無に入る",
    navHome: "ホーム",
    navFeatures: "機能",
    navMission: "ミッション",
    navPhilosophy: "哲学",
    navPlans: "プラン",
    requestAccess: "虚無に入る",
    featuresLabel: "機能",
    featuresTitle: "完全なプライバシー。",
    featuresSubtitle: "絶対的な自由。",
    featuresDescription: "あなたの言葉は決して保存されません。解放されるまでの一瞬だけ存在します。完全に安全な環境で、重い思考が独自の3Dビジュアルで破壊されるのを体験してください。",
    feature1: "ゼロ知識アーキテクチャ",
    feature2: "即時の暗号化シュレッディング",
    feature3: "トラッキングなし、履歴なし",
    missionLabel: "定義",
    missionTitle: "アンチジャーナル。",
    missionSubtitle: "デジタルな虚無。",
    missionDescription: "記憶を保存するために設計された従来のジャーナルとは異なり、アンチジャーナルは記憶を破壊するために作られました。あなたを苦しめる思考のための聖域であり、美しく儚い相互作用を通じてカタルシスを提供します。",
    goalLabel: "目標",
    goalTitle: "即時のカタルシス。",
    goalSubtitle: "精神的な明晰さ。",
    goalDescription: "私たちの目標は、不満、不安、圧倒的な思考のための、安全で追跡不可能な出口を提供することです。これらの思考の破壊を視覚化することで、精神的な明晰さと感情のリセットを助けます。",
    philosophyLabel: "私たちが大切にしている理由",
    philosophyTitle: "情緒的な。",
    philosophySubtitle: "共感的なデザイン。",
    philosophyDescription: "私たちは、すべてのものを保存する必要はないと信じています。データ保持に執着する世界で、私たちは「忘れる権利」を擁護します。私たちはあなたの精神的な空間を大切にし、あなたの感情の状態に合わせた宇宙的なテーマをデザインして、手放すことをサポートします。",
    recommended: "おすすめ",
    appTitle: "アンチジャーナル",
    inputPlaceholder: "心に重くのしかかっているものは？",
    holdToRelease: "長押しして虚無へ解放する",
    releasing: "解放中...",
    released: "解放済み",
    dailyCount: "今日クリアした思考",
    globalCount: "今日解放されたグローバルな思考",
    onlineUsers: "虚無の中にいます",
    ritualStandard: "スタンダード",
    ritualStandardDesc: "標準的な物理による直接的な解放",
    ritualHeavy: "ヘビーリフト",
    ritualHeavyDesc: "重い思考のための長時間のホールド",
    ritualEcho: "エコー",
    ritualEchoDesc: "消える前に言葉が波紋のように広がるのを見る",
    ritualMist: "モーニングミスト",
    ritualMistDesc: "星屑への完全な分解",
    ritualOracle: "儀式のオラクル",
    ritualOracleDesc: "虚空に導きを求めてください。問いを投げかけ、宇宙の答えを待ちましょう。",
    settings: "設定",
    profile: "プロフィール",
    theme: "テーマ",
    language: "言語",
    logout: "ログアウト",
    adminPanel: "管理パネル",
    statsTitle: "あなたの旅",
    totalReleases: "総解放数",
    monthlyActivity: "月間アクティビティ",
    streak: "現在のストリーク",
    footerCopyright: "PrimeDev Studios. All rights reserved.",
    footerTagline: "PrimeDev Studios製品 • アンチジャーナリング・プロトコル",
    headings: [
      "心に重くのしかかっているものは？",
      "何に執着していますか？",
      "何を解放する必要がありますか？",
      "今日の重い思考は何ですか？",
      "静寂に真実を語ってください。",
      "心に響いているものは何ですか？",
      "ここで全てを吐き出してください。",
      "あなたが背負っている重荷は何ですか？",
    ],
    subheadings: [
      "宇宙が耳を傾けています。",
      "静寂があなたの証人です。",
      "星々があなたの秘密を守ります。",
      "無限へと解放してください。",
      "あなたの言葉は今、虚無のものです。",
      "暗闇に重みを飲み込ませましょう。",
      "解放の中に安らぎを見つけてください。",
      "コスモスがあなたの重い思考を吸収します。",
    ],
    angryMessages: [
      "炎がそれを焼き尽くします。", "灰を散らせてください。", "あなたの怒りは吸収されます。", "熱が消えていきます。", "炎を吐き出してください。",
      "緊張を解いてください。", "重みが軽くなるのを感じてください。", "怒りを消し去ってください。", "あなたがコントロールしています。", "吸って... 吐いて..."
    ],
    sadMessages: [
      "虚空に消えた涙。", "痛みが和らぎます。", "静寂があなたを包みます。", "悲しみを漂わせてください。", "手放しても大丈夫です。",
      "自分に優しくしてください。", "これもまた過ぎ去ります。", "あなたは一人ではありません。", "吸って... 吐いて...", "考えを書き留めてください..."
    ],
    neutralMessages: [
      "息を吐いて。消えました。", "軽やかさが戻ります。", "虚空は静かです。",
      "手放すことは自由です。", "心が晴れました。", "平和が見つかりました。", "重荷が下りました。",
      "吸って... 吐いて...", "考えを書き留めてください...", "呼吸に集中してください。", "あなたはここにいます。あなたは安全です。"
    ],
    oracleMessages: [
      "星々があなたに味方しています。", "新しい道が明らかになります。", "虚空は静寂で答えます。", "あなたの問いが答えです。", "真実のために内面を見てください。", "宇宙は無関心です。", "視点の変化が必要です。", "忍耐があなたの味方です。", "答えは雲に覆われています。", "旅を信じてください。"
    ],
    askTheVoid: "虚空に問う",
    whisperToTheVoid: "虚空に囁く...",
    typeYourThoughts: "考えを入力してください...",
    holdEnterOrButton: "Enterキーまたはボタンを長押しして解放する",
    insights: "洞察",
    zen: "禅",
    admin: "管理者",
    enteringVoid: "虚空に入っています...",
    releaseHeaviest: "最も重い思考を虚空に放ちましょう",
    privateSpace: "AntiJournalは、あなたを苦しめるものを手放すためのプライベートな空間です。追跡も、審判もなく、ただ解放があるだけです。",
    enterTheVoid: "虚空に入る...",
    connectingToVoid: "虚空に接続中...",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    cookiePolicy: "クッキーポリシー",
    allRightsReleased: "© 2026 Anti-Journal. すべての権利が解放されました。",
    welcomePro: "Proへようこそ。虚空が広がります。",
  },
  zh: {
    heroTitle: "思绪升华之地",
    heroSubtitle: "在寂静中。",
    heroDescription: "一个为您不想保留的思绪而设计的反日志。说出您的真相，看着它消散，在寂静中寻找平衡。我们为敏锐的专注和灵感的释放构建数字空间。",
    heroCTA: "进入虚无",
    navHome: "首页",
    navFeatures: "功能",
    navMission: "使命",
    navPhilosophy: "哲学",
    navPlans: "计划",
    requestAccess: "进入虚无",
    featuresLabel: "功能",
    featuresTitle: "绝对隐私。",
    featuresSubtitle: "绝对自由。",
    featuresDescription: "您的文字永远不会被存储。它们只存在到被释放的那一刻。在完全安全的环境中体验您沉重思绪的独特3D视觉破坏。",
    feature1: "零知识架构",
    feature2: "即时加密粉碎",
    feature3: "无追踪，无历史",
    missionLabel: "定义",
    missionTitle: "反日志。",
    missionSubtitle: "数字虚空。",
    missionDescription: "与旨在保存记忆的传统日志不同，反日志是为了销毁记忆而建立的。它是您沉重思绪的避难所，通过美丽而短暂的交互提供宣泄式的释放。",
    goalLabel: "我们的目标",
    goalTitle: "即时宣泄。",
    goalSubtitle: "心理清晰。",
    goalDescription: "我们的目标是为挫折、焦虑和压倒性的思绪提供一个安全、不可追踪的出口。通过可视化这些思绪的破坏，我们帮助您实现心理清晰和情感重置。",
    philosophyLabel: "我们为什么在乎",
    philosophyTitle: "大气感。",
    philosophySubtitle: "共情设计。",
    philosophyDescription: "我们相信并非所有东西都需要被保存. 在一个痴迷于数据保留的世界里, 我们捍卫“被遗忘权”. 我们关心您的心理空间, 设计宇宙主题以匹配您的情感状态并促进放下.",
    recommended: "推荐",
    appTitle: "反日志",
    inputPlaceholder: "什么在困扰着你？",
    holdToRelease: "长按以释放到虚空",
    releasing: "释放中...",
    released: "已释放",
    dailyCount: "今日清除的思绪",
    globalCount: "今日释放的全球思绪",
    onlineUsers: "在虚空中",
    ritualStandard: "标准",
    ritualStandardDesc: "使用标准物理直接释放",
    ritualHeavy: "深度释放",
    ritualHeavyDesc: "为沉重的思绪延长按压时间",
    ritualEcho: "回声",
    ritualEchoDesc: "看着您的文字在消失前产生涟漪",
    ritualMist: "晨雾",
    ritualMistDesc: "完全分解为星尘",
    ritualOracle: "仪式神谕",
    ritualOracleDesc: "向虚空寻求指引。提出问题，让宇宙给出答案。",
    settings: "设置",
    profile: "个人资料",
    theme: "主题",
    language: "语言",
    logout: "登出",
    adminPanel: "管理面板",
    statsTitle: "您的旅程",
    totalReleases: "总释放次数",
    monthlyActivity: "月度活动",
    streak: "当前连续天数",
    footerCopyright: "PrimeDev Studios. 保留所有权利。",
    footerTagline: "PrimeDev Studios 产品 • 反日志协议",
    headings: [
      "什么在困扰着你？",
      "你在坚持什么？",
      "什么需要被释放？",
      "今天沉重的思绪是什么？",
      "向寂静诉说你的真相。",
      "你的心中在回荡着什么？",
      "在这里尽情倾诉吧。",
      "你背负的负担是什么？",
    ],
    subheadings: [
      "宇宙正在倾听。",
      "寂静是你的见证。",
      "繁星将保守你的秘密。",
      "将其释放到无限。",
      "你的文字现在属于虚空。",
      "让黑暗吞噬这份沉重。",
      "在释放中寻找平衡。",
      "宇宙吸收你沉重的思绪。",
    ],
    angryMessages: [
      "火焰将其吞噬。", "让灰烬散去。", "你的愤怒被吸收了。", "热量消散了。", "呼出火焰。",
      "释放张力。", "感受负担减轻。", "让愤怒消退。", "你在掌控之中。", "吸气... 呼气..."
    ],
    sadMessages: [
      "泪水消失在虚空中。", "痛苦减轻了。", "寂静拥抱着你。", "让悲伤漂走。", "放下是可以的。",
      "对自己温柔一点。", "这一切都会过去。", "你并不孤单。", "吸气... 呼气...", "写下你的想法..."
    ],
    neutralMessages: [
      "呼吸。它消失了。", "轻盈回归。", "虚空是安静的。",
      "放下即是自由。", "现在更清澈了。", "找到了平静。", "如释重负。",
      "吸气... 呼气...", "写下你的想法...", "专注于你的呼吸。", "你在这里。你是安全的。"
    ],
    oracleMessages: [
      "星辰为你排布。", "一条新的道路显现。", "虚空以寂静作答。", "你的问题就是答案。", "向内寻求真相。", "宇宙是冷漠的。", "需要改变视角。", "耐心是你的盟友。", "答案被云雾遮蔽。", "信任这段旅程。"
    ],
    askTheVoid: "询问虚空",
    whisperToTheVoid: "向虚空低语...",
    typeYourThoughts: "输入你的想法...",
    holdEnterOrButton: "长按回车或按钮释放",
    insights: "洞察",
    zen: "禅",
    admin: "管理员",
    enteringVoid: "正在进入虚空...",
    releaseHeaviest: "将你最沉重的想法释放到虚空中",
    privateSpace: "AntiJournal 是一个让你放下沉重负担的私密空间。没有追踪，没有审判，只有释放。",
    enterTheVoid: "进入虚空...",
    connectingToVoid: "正在连接虚空...",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    cookiePolicy: "Cookie 政策",
    allRightsReleased: "© 2026 Anti-Journal. 版权所有已释放。",
    welcomePro: "欢迎加入 Pro。虚空正在扩张。",
  },
  fr: {
    heroTitle: "Là où les pensées s'élèvent",
    heroSubtitle: "à travers le silence.",
    heroDescription: "Un anti-journal pour les pensées que vous ne voulez pas garder. Dites votre vérité, regardez-la se dissoudre et trouvez la paix dans le silence. Nous construisons des espaces numériques pour une concentration accrue et une libération inspirée.",
    heroCTA: "Entrer dans le Vide",
    navHome: "Accueil",
    navFeatures: "Fonctionnalités",
    navMission: "Mission",
    navPhilosophy: "Philosophie",
    navPlans: "Plans",
    requestAccess: "Entrer dans le Vide",
    featuresLabel: "Fonctionnalités",
    featuresTitle: "Confidentialité Totale.",
    featuresSubtitle: "Liberté Absolue.",
    featuresDescription: "Vos mots ne sont jamais stockés. Ils n'existent que le temps d'être libérés. Découvrez des destructions visuelles 3D uniques de vos pensées lourdes dans un environnement totalement sécurisé.",
    feature1: "Architecture zéro connaissance",
    feature2: "Déchiquetage cryptographique instantané",
    feature3: "Pas de suivi, pas d'historique",
    missionLabel: "Qu'est-ce que c'est",
    missionTitle: "L'Anti-Journal.",
    missionSubtitle: "Un Vide Numérique.",
    missionDescription: "Contrairement aux journaux traditionnels conçus pour préserver les souvenirs, l'Anti-Journal est conçu pour les détruire. C'est un sanctuaire pour les pensées qui vous pèsent, offrant une libération cathartique à travers des interactions belles et éphémères.",
    goalLabel: "Notre Objectif",
    goalTitle: "Catharsis Instantanée.",
    goalSubtitle: "Clarté Mentale.",
    goalDescription: "Notre objectif est de fournir un exutoire sûr et intraçable pour la frustration, l'anxiété et les pensées accablantes. En visualisant la destruction de ces pensées, nous vous aidons à atteindre la clarté mentale et un renouveau émotionnel.",
    philosophyLabel: "Pourquoi nous nous en soucions",
    philosophyTitle: "Atmosphérique.",
    philosophySubtitle: "Design Empathique.",
    philosophyDescription: "Nous croyons que tout n'a pas besoin d'être sauvegardé. Dans un monde obsédé par la rétention des données, nous défendons le droit à l'oubli. Nous nous soucions de votre espace mental, en concevant des thèmes cosmiques pour correspondre à votre état émotionnel et faciliter le lâcher-prise.",
    recommended: "Recommandé",
    appTitle: "Anti-Journal",
    inputPlaceholder: "Qu'est-ce qui pèse sur votre esprit ?",
    holdToRelease: "Maintenir pour libérer dans le vide",
    releasing: "Libération...",
    released: "Libéré",
    dailyCount: "Pensées Effacées Aujourd'hui",
    globalCount: "Pensées Globales Libérées Aujourd'hui",
    onlineUsers: "Dans le Vide",
    ritualStandard: "Standard",
    ritualStandardDesc: "Libération directe avec physique standard",
    ritualHeavy: "Levage Lourd",
    ritualHeavyDesc: "Maintien prolongé pour les pensées lourdes",
    ritualEcho: "Écho",
    ritualEchoDesc: "Regardez vos mots onduler avant de s'effacer",
    ritualMist: "Brume Matinale",
    ritualMistDesc: "Désintégration totale en poussière d'étoiles",
    ritualOracle: "Oracle Rituel",
    ritualOracleDesc: "Cherchez conseil auprès du vide. Posez une question et laissez le cosmos répondre.",
    settings: "Paramètres",
    profile: "Profil",
    theme: "Thème",
    language: "Langue",
    logout: "Déconnexion",
    adminPanel: "Panneau Admin",
    statsTitle: "Votre Voyage",
    totalReleases: "Libérations Totales",
    monthlyActivity: "Activité Mensuelle",
    streak: "Série Actuelle",
    footerCopyright: "PrimeDev Studios. Tous droits réservés.",
    footerTagline: "Un produit de PrimeDev Studios • Protocole Anti-Journaling",
    headings: [
      "Qu'est-ce qui pèse sur votre esprit ?",
      "À quoi vous accrochez-vous ?",
      "Qu'est-ce qui doit être libéré ?",
      "Quelle est la pensée lourde aujourd'hui ?",
      "Dites votre vérité au silence.",
      "Qu'est-ce qui résonne dans votre cœur ?",
      "Laissez tout sortir ici.",
      "Quel est le fardeau que vous portez ?",
    ],
    subheadings: [
      "L'univers écoute.",
      "Le silence est votre témoin.",
      "Les étoiles garderont vos secrets.",
      "Libérez-le vers l'infini.",
      "Vos mots appartiennent au vide maintenant.",
      "Laissez l'obscurité consommer le poids.",
      "Trouvez la paix dans la libération.",
      "Le cosmos absorbe vos pensées lourdes.",
    ],
    angryMessages: [
      "Le feu le consume.", "Laissez les cendres se disperser.", "Votre rage est absorbée.", "La chaleur se dissipe.", "Expulsez le feu.",
      "Relâchez la tension.", "Sentez le poids se lever.", "Laissez la colère s'estomper.", "Vous avez le contrôle.", "Inspirez... et expirez..."
    ],
    sadMessages: [
      "Larmes perdues dans le vide.", "La douleur s'adoucit.", "Le silence vous soutient.", "Laissez la tristesse dériver.", "C'est normal de lâcher prise.",
      "Soyez gentil avec vous-même.", "Cela aussi passera.", "Vous n'êtes pas seul.", "Inspirez... et expirez...", "Écrivez vos pensées..."
    ],
    neutralMessages: [
      "Respirez. C'est parti.", "La légèreté revient.", "Le vide est calme.",
      "Lâcher prise, c'est la liberté.", "Plus clair maintenant.", "Paix trouvée.", "Soulagé.",
      "Inspirez... et expirez...", "Écrivez vos pensées...", "Concentrez-vous sur votre respiration.", "Vous êtes ici. Vous êtes en sécurité."
    ],
    oracleMessages: [
      "Les étoiles s'alignent en votre faveur.", "Un nouveau chemin se révèle.", "Le vide répond par le silence.", "Votre question est la réponse.", "Regardez en vous pour la vérité.", "Le cosmos est indifférent.", "Un changement de perspective est nécessaire.", "La patience est votre alliée.", "La réponse est obscurcie par les nuages.", "Faites confiance au voyage."
    ],
    askTheVoid: "Demander au Vide",
    whisperToTheVoid: "Chuchoter au vide...",
    typeYourThoughts: "Tapez vos pensées...",
    holdEnterOrButton: "Maintenez Entrée ou le bouton pour libérer",
    insights: "Aperçus",
    zen: "Zen",
    admin: "Admin",
    enteringVoid: "Entrée dans le vide...",
    releaseHeaviest: "Libérez vos pensées les plus lourdes dans le vide",
    privateSpace: "AntiJournal est un espace privé pour lâcher ce qui vous pèse. Pas de suivi, pas de jugement, juste la libération.",
    enterTheVoid: "Entrer dans le vide...",
    connectingToVoid: "Connexion au vide...",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    cookiePolicy: "Politique relative aux cookies",
    allRightsReleased: "© 2026 Anti-Journal. Tous droits libérés.",
    welcomePro: "Bienvenue dans Pro. Le vide s'étend.",
  },
  de: {
    heroTitle: "Wo Gedanken aufsteigen",
    heroSubtitle: "durch die Stille.",
    heroDescription: "Ein Anti-Journal für die Gedanken, die du nicht behalten willst. Sprich deine Wahrheit aus, sieh zu, wie sie sich auflöst, und finde Frieden in der Stille. Wir bauen digitale Räume für scharfen Fokus und inspirierte Befreiung.",
    heroCTA: "In die Leere eintreten",
    navHome: "Home",
    navFeatures: "Features",
    navMission: "Mission",
    navPhilosophy: "Philosophie",
    navPlans: "Pläne",
    requestAccess: "In die Leere eintreten",
    featuresLabel: "Features",
    featuresTitle: "Totale Privatsphäre.",
    featuresSubtitle: "Absolute Freiheit.",
    featuresDescription: "Deine Worte werden niemals gespeichert. Sie existieren nur lange genug, um befreit zu werden. Erlebe einzigartige visuelle 3D-Zerstörungen deiner schweren Gedanken in einer absolut sicheren Umgebung.",
    feature1: "Zero-Knowledge-Architektur",
    feature2: "Sofortige kryptografische Vernichtung",
    feature3: "Kein Tracking, kein Verlauf",
    missionLabel: "Was es ist",
    missionTitle: "Das Anti-Journal.",
    missionSubtitle: "Eine digitale Leere.",
    missionDescription: "Im Gegensatz zu traditionellen Journalen, die Erinnerungen bewahren sollen, wurde Anti-Journal gebaut, um sie zu zerstören. Es ist ein Zufluchtsort für die Gedanken, die dich belasten, und bietet eine kathartische Befreiung durch wunderschöne, flüchtige Interaktionen.",
    goalLabel: "Unser Ziel",
    goalTitle: "Sofortige Katharsis.",
    goalSubtitle: "Geistige Klarheit.",
    goalDescription: "Unser Ziel ist es, ein sicheres, nicht nachverfolgbares Ventil für Frustration, Angst und überwältigende Gedanken zu bieten. Durch die Visualisierung der Zerstörung dieser Gedanken helfen wir dir, geistige Klarheit und einen emotionalen Reset zu erreichen.",
    philosophyLabel: "Warum es uns wichtig ist",
    philosophyTitle: "Atmosphärisch.",
    philosophySubtitle: "Empathisches Design.",
    philosophyDescription: "Wir glauben, dass nicht alles gespeichert werden muss. In einer Welt, die von Datenspeicherung besessen ist, setzen wir uns für das Recht auf Vergessen ein. Wir kümmern uns um deinen geistigen Raum und entwerfen kosmische Themen, die deinem emotionalen Zustand entsprechen und das Loslassen erleichtern.",
    recommended: "Empfohlen",
    appTitle: "Anti-Journal",
    inputPlaceholder: "Was belastet dich?",
    holdToRelease: "Halten, um in die Leere zu befreien",
    releasing: "Befreien...",
    released: "Befreit",
    dailyCount: "Heute geklärte Gedanken",
    globalCount: "Heute weltweit befreite Gedanken",
    onlineUsers: "In der Leere",
    ritualStandard: "Standard",
    ritualStandardDesc: "Direkte Befreiung mit Standardphysik",
    ritualHeavy: "Schweres Heben",
    ritualHeavyDesc: "Verlängertes Halten für schwerere Gedanken",
    ritualEcho: "Echo",
    ritualEchoDesc: "Sieh zu, wie deine Worte Wellen schlagen, bevor sie verblassen",
    ritualMist: "Morgennebel",
    ritualMistDesc: "Vollständige Auflösung in Sternenstaub",
    ritualOracle: "Ritual-Orakel",
    ritualOracleDesc: "Suche Führung in der Leere. Stelle eine Frage und lass den Kosmos antworten.",
    settings: "Einstellungen",
    profile: "Profil",
    theme: "Thema",
    language: "Sprache",
    logout: "Logout",
    adminPanel: "Admin-Panel",
    statsTitle: "Deine Reise",
    totalReleases: "Gesamte Befreiungen",
    monthlyActivity: "Monatliche Aktivität",
    streak: "Aktuelle Serie",
    footerCopyright: "PrimeDev Studios. Alle Rechte vorbehalten.",
    footerTagline: "Ein Produkt von PrimeDev Studios • Anti-Journaling-Protokoll",
    headings: [
      "Was belastet dich?",
      "Woran hältst du fest?",
      "Was muss befreit werden?",
      "Was ist der schwere Gedanke heute?",
      "Sprich deine Wahrheit in die Stille.",
      "Was hallt in deinem Herzen wider?",
      "Lass hier alles raus.",
      "Was ist die Last, die du trägst?",
    ],
    subheadings: [
      "Das Universum hört zu.",
      "Die Stille ist dein Zeuge.",
      "Die Sterne werden deine Geheimnisse bewahren.",
      "Lass es in das Unendliche frei.",
      "Deine Worte gehören jetzt der Leere.",
      "Lass die Dunkelheit das Gewicht verschlingen.",
      "Finde Frieden in der Befreiung.",
      "Der Kosmos absorbiert deine schweren Gedanken.",
    ],
    angryMessages: [
      "Das Feuer verzehrt es.", "Lassen Sie die Asche verstreuen.", "Ihre Wut wird absorbiert.", "Die Hitze verfliegt.", "Atmen Sie das Feuer aus.",
      "Lösen Sie die Spannung.", "Fühlen Sie, wie die Last schwindet.", "Lassen Sie den Zorn verblassen.", "Sie haben die Kontrolle.", "Einatmen... und ausatmen..."
    ],
    sadMessages: [
      "Tränen, verloren in der Leere.", "Der Schmerz wird weicher.", "Die Stille hält Sie.", "Lassen Sie die Trauer treiben.", "Es ist okay, loszulassen.",
      "Seien Sie gut zu sich selbst.", "Auch das wird vergehen.", "Sie sind nicht allein.", "Einatmen... und ausatmen...", "Schreiben Sie Ihre Gedanken auf..."
    ],
    neutralMessages: [
      "Atmen Sie durch. Es ist weg.", "Leichtigkeit kehrt zurück.", "Die Leere ist still.",
      "Loslassen ist Freiheit.", "Jetzt klarer.", "Frieden gefunden.", "Unbeschwert.",
      "Einatmen... und ausatmen...", "Schreiben Sie Ihre Gedanken auf...", "Konzentrieren Sie sich auf Ihren Atem.", "Sie sind hier. Sie sind sicher."
    ],
    oracleMessages: [
      "Die Sterne stehen günstig für Sie.", "Ein neuen Weg offenbart sich.", "Die Leere antwortet mit Stille.", "Ihre Frage ist die Antwort.", "Schauen Sie nach innen für die Wahrheit.", "Der Kosmos ist gleichgültig.", "Ein Perspektivwechsel ist nötig.", "Geduld ist Ihr Verbündeter.", "Die Antwort ist von Wolken verdeckt.", "Vertrauen Sie der Reise."
    ],
    askTheVoid: "Frag die Leere",
    whisperToTheVoid: "Flüstere der Leere zu...",
    typeYourThoughts: "Schreibe deine Gedanken...",
    holdEnterOrButton: "Halte Enter oder den Button zum Loslassen",
    insights: "Einblicke",
    zen: "Zen",
    admin: "Admin",
    enteringVoid: "Eintritt in die Leere...",
    releaseHeaviest: "Lassen Sie Ihre schwersten Gedanken in die Leere los",
    privateSpace: "AntiJournal ist ein privater Raum, um loszulassen, was Sie belastet. Kein Tracking, kein Urteil, nur Befreiung.",
    enterTheVoid: "In die Leere eintreten...",
    connectingToVoid: "Verbindung zur Leere...",
    privacyPolicy: "Datenschutzerklärung",
    termsOfService: "Nutzungsbedingungen",
    cookiePolicy: "Cookie-Richtlinie",
    allRightsReleased: "© 2026 Anti-Journal. Alle Rechte freigegeben.",
    welcomePro: "Willkommen bei Pro. Die Leere dehnt sich aus.",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved && (saved as Language)) return saved as Language;
    
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'ko', 'ja', 'zh', 'fr', 'de'].includes(browserLang)) {
      return browserLang as Language;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
