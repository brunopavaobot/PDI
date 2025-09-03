import { Progress } from "./ui/progress";

interface ProgressWithColorProps {
  value: number;
  color: string;
  className?: string;
  showProgressLine?: boolean;
  classificacao?: string;
}

// Sistema de classificação com cores
const classificacoes = {
  "Muda o jogo": { cor: "#32B3FC" },
  "Faz Bonito": { cor: "#47CF86" },
  "Pode Mais": { cor: "#F6C61E" },
  "Precisa Agir": { cor: "#F66363" }
};

export function ProgressWithColor({ value, color, className = "", showProgressLine = true, classificacao }: ProgressWithColorProps) {
  
  // Função para determinar qual seção deve ser colorida
  const getBackgroundStyle = () => {
    const corInativa = "#e5e7eb"; // Cinza claro para seções inativas
    
    let vermelho = corInativa;
    let amarelo = corInativa;
    let verde = corInativa;
    let azul = corInativa;
    
    // Colore apenas a seção correspondente à classificação
    if (classificacao === "Precisa Agir") {
      vermelho = "#F66363";
    } else if (classificacao === "Pode Mais") {
      amarelo = "#F6C61E";
    } else if (classificacao === "Faz Bonito") {
      verde = "#47CF86";
    } else if (classificacao === "Muda o jogo") {
      azul = "#32B3FC";
    }
    
    return `linear-gradient(to right, ${vermelho} 0%, ${vermelho} 25%, ${amarelo} 25%, ${amarelo} 50%, ${verde} 50%, ${verde} 75%, ${azul} 75%, ${azul} 100%)`;
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Barra de fundo com apenas a seção ativa colorida */}
      <div className="h-3 w-full rounded-full overflow-hidden" style={{
        background: getBackgroundStyle()
      }} />
      
      {/* Linha preta indicadora da posição exata */}
      {showProgressLine && (
        <div 
          className="absolute top-0 w-0.5 h-3 bg-black z-10"
          style={{ 
            left: `${Math.max(0, Math.min(100, value))}%`,
            transform: 'translateX(-50%)'
          }}
        />
      )}
    </div>
  );
}