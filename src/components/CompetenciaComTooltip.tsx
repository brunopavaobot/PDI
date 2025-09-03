import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// Mapeamento completo das competências com suas descrições
const competenciasDescricoes = {
  "Foco no cliente": "Busca conhecer e entender as preferências dos clientes sobre as marcas e produtos, realizando ações práticas no dia a dia que colocam o cliente no centro. Cria soluções que encantam os clientes. Possui entendimento do ecossistema do Grupo Boticário e reconhece o impacto de suas atividades.",
  
  "Autodesenvolvimento": "Busca aprender continuamente e pede feedbacks para se desenvolver.",
  
  "Empreendedorismo": "Se desafia a fazer mais e melhor, criando algo novo ou aperfeiçoando o que já existe. É questionador por natureza e se compromete a executar o que for decidido, mesmo quando discorda.",
  
  "Adaptabilidade": "É resiliente e gerencia as emoções ao se adaptar às variações que fazem parte do ecossistema.",
  
  "Cuidado e Respeito": "Dedica tempo para cuidar das pessoas e parceiros, garantindo que se sintam pertencentes e acolhidos.",
  
  "Influência Multifuncional": "Tem parceria com colegas e times, gerando valor para as pessoas.",
  
  "Desenvolvimento e Gestão de Pessoas": "Compartilha conhecimento e experiências que auxiliam indiretamente no desenvolvimento de outros colaboradores.",
  
  "Desenvolvimento e Gestão de Pessoal": "Compartilha conhecimento e experiências que auxiliam indiretamente no desenvolvimento de outros colaboradores.",
  
  "Foco em Execução": "Tem disciplina para escolher e priorizar suas atividades para entregar o melhor da estratégia.",
  
  "Foco e Execução": "Tem disciplina para escolher e priorizar suas atividades para entregar o melhor da estratégia.",
  
  "Autonomia": "Tem comprometimento e autonomia para entregar as atividades, envolvendo as pessoas e os recursos necessários.",
  
  "Resolução de Problemas": "É profundo para resolver problemas, experimentando e aprendendo rapidamente para escalar com eficiência.",
  
  "Visão de Negócio": "Foca suas ações de hoje considerando o impacto de longo prazo na empresa, nos colaboradores, nos parceiros, nos clientes e na sociedade.",
  
  "Responsabilidade Financeira": "É responsável e eficiente na utilização de recursos, evitando desperdícios.",
  
  "Responsabilidade Financeira & Sustentabilidade": "É responsável e eficiente na utilização de recursos, evitando desperdícios.",
  
  "Diversidade e inclusão": "Conhece e promove as políticas de diversidade e inclusão da empresa e age no dia a dia para que todas as pessoas se sintam parte.",
  
  "Diversidade e Inclusão": "Conhece e promove as políticas de diversidade e inclusão da empresa e age no dia a dia para que todas as pessoas se sintam parte."
};

// Mapeamento das essências
const essenciasDescricoes = {
  "Fazemos os olhos dos nossos clientes brilharem": "Essência focada no cliente",
  "Somos inquietos": "Essência da busca contínua por inovação e desenvolvimento", 
  "Nutrimos nossas relações": "Essência do cuidado com pessoas e relacionamentos",
  "Somos apaixonados pela execução": "Essência da disciplina e foco em resultados",
  "Buscamos sucesso responsável": "Essência da responsabilidade e visão de longo prazo"
};

interface CompetenciaComTooltipProps {
  nome: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function CompetenciaComTooltip({ 
  nome, 
  children, 
  className = "", 
  showIcon = true 
}: CompetenciaComTooltipProps) {
  const descricao = competenciasDescricoes[nome as keyof typeof competenciasDescricoes];
  
  if (!descricao) {
    // Se não encontrar a descrição, retorna apenas o nome sem tooltip
    return (
      <span className={className}>
        {children || nome}
      </span>
    );
  }

  return (
    <TooltipProvider>
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <span>{children || nome}</span>
        {showIcon && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent 
              className="max-w-sm p-3 text-sm leading-relaxed"
              side="top"
            >
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{nome}</p>
                <p className="text-gray-700">{descricao}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

interface EssenciaComTooltipProps {
  nome: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function EssenciaComTooltip({ 
  nome, 
  children, 
  className = "", 
  showIcon = true 
}: EssenciaComTooltipProps) {
  const descricao = essenciasDescricoes[nome as keyof typeof essenciasDescricoes];
  
  if (!descricao) {
    return (
      <span className={className}>
        {children || nome}
      </span>
    );
  }

  return (
    <TooltipProvider>
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <span>{children || nome}</span>
        {showIcon && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent 
              className="max-w-sm p-3 text-sm leading-relaxed"
              side="top"
            >
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{nome}</p>
                <p className="text-gray-700">{descricao}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

// Hook para acessar as descrições
export function useCompetenciaDescricao(nome: string) {
  return competenciasDescricoes[nome as keyof typeof competenciasDescricoes] || null;
}

export function useEssenciaDescricao(nome: string) {
  return essenciasDescricoes[nome as keyof typeof essenciasDescricoes] || null;
}