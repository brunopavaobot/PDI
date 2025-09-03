import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ProgressWithColor } from "./ProgressWithColor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Edit, Trash2, Plus } from "lucide-react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const avaliacoes = [
  { essencia: "Fazemos os olhos dos nossos clientes brilharem", competencia: "Foco no cliente", comportamento: "Busca conhecer preferências", frequencia: "Frequentemente" },
  { essencia: "Fazemos os olhos dos nossos clientes brilharem", competencia: "Foco no cliente", comportamento: "É embaixador das marcas", frequencia: "Frequentemente" },
  { essencia: "Fazemos os olhos dos nossos clientes brilharem", competencia: "Foco no cliente", comportamento: "Entende o ecossistema", frequencia: "Frequentemente" },
  { essencia: "Somos inquietos", competencia: "Autodesenvolvimento", comportamento: "Busca aprendizado contínuo", frequencia: "Sempre" },
  { essencia: "Somos inquietos", competencia: "Empreendedorismo", comportamento: "Se desafia constantemente", frequencia: "Frequentemente" },
  { essencia: "Somos inquietos", competencia: "Empreendedorismo", comportamento: "É questionador", frequencia: "Sempre" },
  { essencia: "Somos inquietos", competencia: "Adaptabilidade", comportamento: "É resiliente", frequencia: "Sempre" },
  { essencia: "Nutrimos nossas relações", competencia: "Cuidado e Respeito", comportamento: "Cuida das pessoas", frequencia: "Frequentemente" },
  { essencia: "Nutrimos nossas relações", competencia: "Influência Multifuncional", comportamento: "Cria redes", frequencia: "Frequentemente" },
  { essencia: "Nutrimos nossas relações", competencia: "Influência Multifuncional", comportamento: "Conversas transparentes", frequencia: "Sempre" },
  { essencia: "Nutrimos nossas relações", competencia: "Desenvolvimento e Gestão de Pessoas", comportamento: "Dá feedbacks", frequencia: "Sempre" },
  { essencia: "Nutrimos nossas relações", competencia: "Desenvolvimento e Gestão de Pessoas", comportamento: "Compartilha conhecimento", frequencia: "Frequentemente" },
  { essencia: "Somos apaixonados pela execução", competencia: "Foco em Execução", comportamento: "Tem disciplina", frequencia: "Sempre" },
  { essencia: "Somos apaixonados pela execução", competencia: "Autonomia", comportamento: "Tem autonomia", frequencia: "Eventualmente" },
  { essencia: "Somos apaixonados pela execução", competencia: "Resolução de Problemas", comportamento: "É ágil", frequencia: "Frequentemente" },
  { essencia: "Buscamos sucesso responsável", competencia: "Visão de Negócio", comportamento: "Foca no longo prazo", frequencia: "Eventualmente" },
  { essencia: "Buscamos sucesso responsável", competencia: "Responsabilidade Financeira", comportamento: "É responsável", frequencia: "Eventualmente" },
  { essencia: "Buscamos sucesso responsável", competencia: "Diversidade e Inclusão", comportamento: "Promove diversidade", frequencia: "Frequentemente" }
];

const niveis = {
  "Muda o jogo": { desc: "Destaque excepcional", cor: "#32B3FC", valor: 4 },
  "Faz Bonito": { desc: "Consistente", cor: "#47CF86", valor: 3 },
  "Pode Mais": { desc: "Precisa evoluir", cor: "#F6C61E", valor: 2 },
  "Precisa Agir": { desc: "Performance inadequada", cor: "#F66363", valor: 1 }
};

const pontos = {
  "Sempre": 4,
  "Frequentemente": 3,
  "Eventualmente": 2,
  "Nunca": 1
};

// Mapeamento direto de frequência para cor
const frequenciaCores = {
  "Sempre": "#32B3FC",       // Azul
  "Frequentemente": "#47CF86", // Verde
  "Eventualmente": "#F6C61E",  // Amarelo
  "Nunca": "#F66363"          // Vermelho
};

function obterPontos(freq: string): number {
  const pontosMap: Record<string, number> = pontos;
  return pontosMap[freq] || 1;
}

function obterCorFrequencia(freq: string): string {
  return frequenciaCores[freq as keyof typeof frequenciaCores] || "#F66363";
}

function calcularClassificacao(media: number): string {
  if (media > 3.5) return "Muda o jogo";
  if (media >= 3.0) return "Faz Bonito";
  if (media >= 2.0) return "Pode Mais";
  return "Precisa Agir";
}

function calcularPosicao(media: number): number {
  const classe = calcularClassificacao(media);
  let inicio = 0;
  let tamanho = 0;
  let base = 0;
  
  if (classe === "Muda o jogo") {
    // Para > 3.5, vamos mapear de 3.5 até 4.0
    inicio = 3.5;
    tamanho = 0.5;
    base = 75;
  } else if (classe === "Faz Bonito") {
    // Para 3.0 até 3.5 (inclusive)
    inicio = 3.0;
    tamanho = 0.5;
    base = 50;
  } else if (classe === "Pode Mais") {
    inicio = 2.0;
    tamanho = 1.0;
    base = 25;
  } else {
    inicio = 1.0;
    tamanho = 1.0;
    base = 0;
  }
  
  const relativa = Math.max(0, Math.min(1, (media - inicio) / tamanho));
  const final = base + (relativa * 25);
  
  return Math.max(0, Math.min(100, final));
}

// Tipos para o sistema de ações
interface SubTarefa {
  id: string;
  titulo: string;
  categoria: 'treinamento' | 'mentoria' | 'experiencia';
  concluida: boolean;
}

interface Acao {
  id: string;
  titulo: string;
  descricao: string;
  prazo: Date;
  tipo: 'competencia' | 'geral';
  competencia?: string;
  pilar?: string;
  status: 'nao-iniciado' | 'em-andamento' | 'concluido';
  subtarefas: SubTarefa[];
  criadoEm: Date;
}

// Tipos para drag and drop
const ItemTypes = {
  ACAO: 'acao'
};

// Componente de card draggable
function DraggableCard({ acao, onEdit, onDelete }: { 
  acao: Acao, 
  onEdit: (acao: Acao) => void,
  onDelete: (id: string) => void 
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ACAO,
    item: { id: acao.id, status: acao.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),

  }), [acao.id, acao.status]);

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className={`p-3 bg-white border hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'transform rotate-2 shadow-lg' : ''
      }`}>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{acao.titulo}</h4>
          <div className="flex items-center gap-2">
            <Badge variant={acao.tipo === 'competencia' ? 'default' : 'secondary'}>
              {acao.tipo === 'competencia' ? 'Competência' : 'Geral'}
            </Badge>
            {acao.competencia && (
              <Badge variant="outline" className="text-xs">
                {acao.competencia}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">
            Prazo: {acao.prazo.toLocaleDateString('pt-BR')}
          </p>
          {acao.subtarefas.length > 0 && (
            <p className="text-xs text-gray-500">
              {acao.subtarefas.length} subtarefa(s)
            </p>
          )}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(acao);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(acao.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Componente de coluna droppable
function DroppableColumn({ 
  status, 
  titulo, 
  cor, 
  acoes, 
  onDrop, 
  onEdit, 
  onDelete, 
  children 
}: {
  status: Acao['status'],
  titulo: string,
  cor: string,
  acoes: Acao[],
  onDrop: (id: string, newStatus: Acao['status']) => void,
  onEdit: (acao: Acao) => void,
  onDelete: (id: string) => void,
  children?: React.ReactNode
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ACAO,
    drop: (item: { id: string; status: Acao['status'] }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
        return { moved: true };
      }
      return { moved: false };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [status, onDrop]);

  return (
    <div ref={drop}>
      <Card className={`border-2 ${isOver ? 'border-blue-400 bg-blue-50' : 
        cor === 'red' ? 'border-red-200' : 
        cor === 'yellow' ? 'border-yellow-200' : 
        'border-green-200'}`}>
        <CardHeader className={cor === 'red' ? 'bg-red-50' : 
          cor === 'yellow' ? 'bg-yellow-50' : 
          'bg-green-50'}>
          <CardTitle className={`${
            cor === 'red' ? 'text-red-800' : 
            cor === 'yellow' ? 'text-yellow-800' : 
            'text-green-800'
          } flex items-center gap-2`}>
            <div className={`w-3 h-3 rounded-full ${
              cor === 'red' ? 'bg-red-500' : 
              cor === 'yellow' ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}></div>
            {titulo} ({acoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className={`p-4 space-y-3 min-h-[400px] transition-colors duration-200 ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
        }`}>
          {acoes.length === 0 && (
            <div className={`flex items-center justify-center h-32 text-gray-400 border-2 border-dashed rounded-lg ${
              isOver ? 'border-blue-400 text-blue-500' : 'border-gray-200'
            }`}>
              <p className="text-sm">
                {isOver ? 'Solte aqui para mover' : 'Arraste ações para esta coluna'}
              </p>
            </div>
          )}
          {acoes.map((acao) => (
            <DraggableCard
              key={acao.id}
              acao={acao}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export function PDIDashboard() {
  const [filtroAtivo, setFiltroAtivo] = useState<string | null>(null);
  const [accordionAberto, setAccordionAberto] = useState<string[]>([]);
  
  // Estados para ações
  const [acoes, setAcoes] = useState<Acao[]>([
    // Exemplo inicial para teste
    {
      id: 'teste-1',
      titulo: 'Ação de Teste',
      descricao: 'Esta é uma ação de exemplo para testar o drag and drop',
      prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
      tipo: 'geral',
      status: 'nao-iniciado',
      subtarefas: [],
      criadoEm: new Date()
    }
  ]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [acaoEditando, setAcaoEditando] = useState<Acao | null>(null);
  const [novaAcao, setNovaAcao] = useState<Partial<Acao>>({
    titulo: '',
    descricao: '',
    tipo: 'geral',
    status: 'nao-iniciado',
    subtarefas: []
  });
  const [novoPrazo, setNovoPrazo] = useState<Date>();
  
  const porEssencia = avaliacoes.reduce((acc, item) => {
    if (!acc[item.essencia]) {
      acc[item.essencia] = {};
    }
    if (!acc[item.essencia][item.competencia]) {
      acc[item.essencia][item.competencia] = [];
    }
    acc[item.essencia][item.competencia].push({
      comportamento: item.comportamento,
      frequencia: item.frequencia,
      pontos: obterPontos(item.frequencia)
    });
    return acc;
  }, {} as Record<string, Record<string, Array<{comportamento: string, frequencia: string, pontos: number}>>>);

  function calcular(comportamentos: Array<{comportamento: string, frequencia: string, pontos: number}>) {
    const total = comportamentos.reduce((sum, comp) => sum + comp.pontos, 0);
    const media = total / comportamentos.length;
    const classe = calcularClassificacao(media);
    const posicao = calcularPosicao(media);
    
    return { classe, media, posicao };
  }

  const processados = Object.entries(porEssencia).map(([essencia, competencias]) => {
    const compArray = Object.entries(competencias).map(([nome, comportamentos]) => {
      const resultado = calcular(comportamentos);
      return {
        essencia,
        nome,
        comportamentos,
        classe: resultado.classe,
        media: resultado.media,
        posicao: resultado.posicao
      };
    });
    
    const todosComportamentos = compArray.flatMap(comp => comp.comportamentos);
    const resultadoPilar = calcular(todosComportamentos);
    
    return {
      essencia,
      competencias: compArray,
      classePilar: resultadoPilar.classe,
      mediaPilar: resultadoPilar.media,
      posicaoPilar: resultadoPilar.posicao
    };
  });

  const dadosGrafico = processados.flatMap(grupo => 
    grupo.competencias.map(comp => ({
      competencia: comp.nome,
      nivel: niveis[comp.classe as keyof typeof niveis].valor,
      classificacao: comp.classe
    }))
  );

  const distribuicao = Object.keys(niveis).map(classe => ({
    name: classe,
    value: dadosGrafico.filter(item => item.classificacao === classe).length,
    color: niveis[classe as keyof typeof niveis].cor
  }));

  const dadosPilares = processados.map(grupo => ({
    pilar: grupo.essencia.split(' ').slice(0, 3).join(' '),
    nivel: niveis[grupo.classePilar as keyof typeof niveis].valor,
    classificacao: grupo.classePilar
  }));

  // Função para filtrar competências por classificação
  const competenciasFiltradas = filtroAtivo 
    ? processados.map(grupo => ({
        ...grupo,
        competencias: grupo.competencias.filter(comp => comp.classe === filtroAtivo)
      })).filter(grupo => grupo.competencias.length > 0)
    : processados;

  // Função para lidar com clique nos cards de filtro
  const handleFiltroClick = (classificacao: string) => {
    setFiltroAtivo(filtroAtivo === classificacao ? null : classificacao);
  };

  // Funções para gerenciar ações
  const handleCriarAcao = () => {
    if (!novaAcao.titulo || !novoPrazo) return;
    
    if (acaoEditando) {
      // Atualizar ação existente
      const acaoAtualizada: Acao = {
        ...acaoEditando,
        titulo: novaAcao.titulo,
        descricao: novaAcao.descricao || '',
        prazo: novoPrazo,
        tipo: novaAcao.tipo as 'competencia' | 'geral',
        competencia: novaAcao.competencia,
        pilar: novaAcao.pilar,
        subtarefas: novaAcao.subtarefas || []
      };
      
      setAcoes(acoes.map(acao => 
        acao.id === acaoEditando.id ? acaoAtualizada : acao
      ));
    } else {
      // Criar nova ação
      const acao: Acao = {
        id: Date.now().toString(),
        titulo: novaAcao.titulo,
        descricao: novaAcao.descricao || '',
        prazo: novoPrazo,
        tipo: novaAcao.tipo as 'competencia' | 'geral',
        competencia: novaAcao.competencia,
        pilar: novaAcao.pilar,
        status: 'nao-iniciado',
        subtarefas: novaAcao.subtarefas || [],
        criadoEm: new Date()
      };
      
      setAcoes([...acoes, acao]);
    }
    
    handleFecharDialog();
  };

  const handleEditarAcao = (acao: Acao) => {
    setAcaoEditando(acao);
    setNovaAcao(acao);
    setNovoPrazo(acao.prazo);
    setDialogAberto(true);
  };

  const handleDeletarAcao = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ação?')) {
      setAcoes(prevAcoes => prevAcoes.filter(acao => acao.id !== id));
    }
  };

  const handleMoverAcao = (id: string, novoStatus: Acao['status']) => {
    setAcoes(prevAcoes => {
      const acaoEncontrada = prevAcoes.find(acao => acao.id === id);
      if (!acaoEncontrada) {
        return prevAcoes;
      }
      
      return prevAcoes.map(acao => 
        acao.id === id ? { ...acao, status: novoStatus } : acao
      );
    });
  };

  const handleAdicionarSubtarefa = (categoria: SubTarefa['categoria']) => {
    const novaSubtarefa: SubTarefa = {
      id: Date.now().toString(),
      titulo: '',
      categoria,
      concluida: false
    };
    setNovaAcao({
      ...novaAcao,
      subtarefas: [...(novaAcao.subtarefas || []), novaSubtarefa]
    });
  };

  const handleRemoverSubtarefa = (id: string) => {
    setNovaAcao({
      ...novaAcao,
      subtarefas: (novaAcao.subtarefas || []).filter(st => st.id !== id)
    });
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setAcaoEditando(null);
    setNovaAcao({ titulo: '', descricao: '', tipo: 'geral', status: 'nao-iniciado', subtarefas: [] });
    setNovoPrazo(undefined);
  };

  // Obter todas as competências disponíveis
  const todasCompetencias = processados.flatMap(grupo => 
    grupo.competencias.map(comp => ({
      nome: comp.nome,
      pilar: grupo.essencia
    }))
  );

  // Filtrar ações por status para o Kanban
  const acoesPorStatus = {
    'nao-iniciado': acoes.filter(acao => acao.status === 'nao-iniciado'),
    'em-andamento': acoes.filter(acao => acao.status === 'em-andamento'),
    'concluido': acoes.filter(acao => acao.status === 'concluido')
  };



  // Dados para gráficos de barras verticais simples por pilar
  const dadosBarrasVerticais = processados.map(grupo => {
    // Se o pilar tem apenas uma competência, mostrar os comportamentos
    if (grupo.competencias.length === 1) {
      const competencia = grupo.competencias[0];
      return {
        essencia: grupo.essencia,
        tipo: 'comportamentos',
        dados: competencia.comportamentos.map(comp => ({
          nome: comp.comportamento.length > 15 ? comp.comportamento.substring(0, 15) + "..." : comp.comportamento,
          valor: comp.pontos,
          cor: obterCorFrequencia(comp.frequencia)
        }))
      };
    } else {
      // Se o pilar tem múltiplas competências, mostrar as competências
      return {
        essencia: grupo.essencia,
        tipo: 'competencias',
        dados: grupo.competencias.map(comp => ({
          nome: comp.nome.length > 15 ? comp.nome.substring(0, 15) + "..." : comp.nome,
          valor: comp.media,
          cor: niveis[comp.classe as keyof typeof niveis].cor
        }))
      };
    }
  });

  // Análise SWOT baseada nas classificações
  const swotData = {
    forcas: dadosGrafico.filter(item => item.classificacao === "Muda o jogo"),
    oportunidades: dadosGrafico.filter(item => item.classificacao === "Faz Bonito"), 
    fraquezas: dadosGrafico.filter(item => item.classificacao === "Pode Mais"),
    ameacas: dadosGrafico.filter(item => item.classificacao === "Precisa Agir")
  };

  // Dados para gráfico SWOT - Pontos Positivos
  const dadosSWOTPositivos = [
    { 
      name: "Forças", 
      value: swotData.forcas.length, 
      color: "#32B3FC",
      competencias: swotData.forcas.map(c => c.competencia)
    },
    { 
      name: "Oportunidades", 
      value: swotData.oportunidades.length, 
      color: "#47CF86",
      competencias: swotData.oportunidades.map(c => c.competencia)
    }
  ];

  // Dados para gráfico SWOT - Pontos de Melhoria
  const dadosSWOTMelhorias = [
    { 
      name: "Fraquezas", 
      value: swotData.fraquezas.length, 
      color: "#F6C61E",
      competencias: swotData.fraquezas.map(c => c.competencia)
    },
    { 
      name: "Ameaças", 
      value: swotData.ameacas.length, 
      color: "#F66363",
      competencias: swotData.ameacas.map(c => c.competencia)
    }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl text-gray-900">Plataforma de PDI</h1>
          <p className="text-xl text-gray-600">Análise de Competências e Desenvolvimento Individual</p>
        </div>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="acoes">Ações</TabsTrigger>
            <TabsTrigger value="mecanica">Mecânica de Cálculo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(niveis).map(([classe, info]) => {
                const count = dadosGrafico.filter(item => item.classificacao === classe).length;
                const isAtivo = filtroAtivo === classe;
                return (
                  <Card 
                    key={classe} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isAtivo ? 'ring-2 ring-offset-2 shadow-lg' : ''
                    }`}
                    style={{ 
                      ...(isAtivo && { ringColor: info.cor })
                    }}
                    onClick={() => handleFiltroClick(classe)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm" style={{ color: info.cor }}>
                        {classe}
                        {isAtivo && <span className="ml-2 text-xs">(Filtro Ativo)</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">{count}</div>
                      <p className="text-xs text-gray-600 mt-1">
                        {count === 1 ? 'competência' : 'competências'}
                      </p>
                      {filtroAtivo === null && (
                        <p className="text-xs text-gray-500 mt-2">Clique para filtrar</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filtroAtivo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-700">
                    Mostrando apenas competências classificadas como <strong>{filtroAtivo}</strong>
                  </p>
                  <button 
                    onClick={() => setFiltroAtivo(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Limpar filtro
                  </button>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Pilar</CardTitle>
                <CardDescription>
                  A nota de cada pilar é calculada pela média dos pontos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {competenciasFiltradas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Nenhuma competência encontrada para o filtro "{filtroAtivo}".
                    </p>
                    <button 
                      onClick={() => setFiltroAtivo(null)}
                      className="mt-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Limpar filtro
                    </button>
                  </div>
                ) : (
                  <Accordion 
                    type="multiple" 
                    className="w-full space-y-4"
                    value={accordionAberto}
                    onValueChange={setAccordionAberto}
                  >
                    {competenciasFiltradas.map((grupo, index) => {
                      const isAberto = accordionAberto.includes(`pilar-${index}`);
                      return (
                        <AccordionItem 
                          key={index} 
                          value={`pilar-${index}`} 
                          className={`border rounded-lg transition-all duration-200 ${
                            isAberto 
                              ? 'border-pink-400 shadow-lg' 
                              : 'border-gray-200'
                          }`}
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex-1 text-left">
                              <h3 className="font-medium text-lg mb-2">{grupo.essencia}</h3>
                              <ProgressWithColor 
                                value={grupo.posicaoPilar}
                                color={niveis[grupo.classePilar as keyof typeof niveis].cor}
                                className="w-full"
                                classificacao={grupo.classePilar}
                              />
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <Badge 
                                style={{ 
                                  backgroundColor: niveis[grupo.classePilar as keyof typeof niveis].cor,
                                  color: 'white',
                                  border: 'none'
                                }}
                              >
                                {grupo.classePilar}
                              </Badge>
                              <Badge 
                                variant="outline"
                                className="text-sm font-medium border-2"
                                style={{ 
                                  borderColor: niveis[grupo.classePilar as keyof typeof niveis].cor,
                                  color: niveis[grupo.classePilar as keyof typeof niveis].cor
                                }}
                              >
                                {grupo.mediaPilar.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="grid gap-4 pt-4">
                            {grupo.competencias.map((comp, compIndex) => (
                              <Card key={compIndex} className="p-4 bg-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-lg font-medium">{comp.nome}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      style={{ 
                                        backgroundColor: niveis[comp.classe as keyof typeof niveis].cor,
                                        color: 'white',
                                        border: 'none'
                                      }}
                                    >
                                      {comp.classe}
                                    </Badge>
                                    <Badge 
                                      variant="outline"
                                      className="text-sm font-medium border-2"
                                      style={{ 
                                        borderColor: niveis[comp.classe as keyof typeof niveis].cor,
                                        color: niveis[comp.classe as keyof typeof niveis].cor
                                      }}
                                    >
                                      {comp.media.toFixed(1)}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <ProgressWithColor 
                                  value={comp.posicao}
                                  color={niveis[comp.classe as keyof typeof niveis].cor}
                                  className="mb-4"
                                  classificacao={comp.classe}
                                />
                                
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm text-gray-700 mb-2">Comportamentos:</h5>
                                  {comp.comportamentos.map((comportamento, behIndex) => {
                                    return (
                                      <div key={behIndex} className="flex items-center justify-between text-sm bg-white p-3 rounded border">
                                        <span className="flex-1 pr-2">{comportamento.comportamento}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge 
                                            variant="secondary"
                                            style={{
                                              backgroundColor: obterCorFrequencia(comportamento.frequencia),
                                              color: 'white'
                                            }}
                                          >
                                            {comportamento.frequencia}
                                          </Badge>
                                          <span className="text-xs text-gray-500">
                                            {comportamento.pontos} pts
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </Card>
                            ))}
                          </div>
                          
                          {/* Botão de colapsar no rodapé */}
                          <div className="flex justify-center pt-4 mt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                const novosAbertos = accordionAberto.filter(item => item !== `pilar-${index}`);
                                setAccordionAberto(novosAbertos);
                              }}
                              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center gap-2"
                            >
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="m18 15-6-6-6 6"/>
                              </svg>
                              Colapsar
                            </button>
                          </div>
                        </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acoes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl text-gray-900">Ações do PDI</h2>
                <p className="text-gray-600">Gerencie suas ações de desenvolvimento</p>
              </div>
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button onClick={() => setDialogAberto(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Ação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {acaoEditando ? 'Editar Ação' : 'Nova Ação do PDI'}
                    </DialogTitle>
                    <DialogDescription>
                      Defina uma ação específica para desenvolvimento de competências
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6">
                    {/* Informações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Título da Ação</Label>
                        <Input
                          value={novaAcao.titulo || ''}
                          onChange={(e) => setNovaAcao({ ...novaAcao, titulo: e.target.value })}
                          placeholder="Ex: Curso de liderança estratégica"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Prazo de Conclusão</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {novoPrazo ? novoPrazo.toLocaleDateString('pt-BR') : 'Selecionar data'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={novoPrazo}
                              onSelect={setNovoPrazo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={novaAcao.descricao || ''}
                        onChange={(e) => setNovaAcao({ ...novaAcao, descricao: e.target.value })}
                        placeholder="Descreva os objetivos e metodologia desta ação..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Ação</Label>
                        <Select 
                          value={novaAcao.tipo} 
                          onValueChange={(value: 'competencia' | 'geral') => 
                            setNovaAcao({ ...novaAcao, tipo: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="geral">Geral</SelectItem>
                            <SelectItem value="competencia">Competência Específica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {novaAcao.tipo === 'competencia' && (
                        <div className="space-y-2">
                          <Label>Competência</Label>
                          <Select 
                            value={novaAcao.competencia} 
                            onValueChange={(value) => {
                              const competencia = todasCompetencias.find(c => c.nome === value);
                              setNovaAcao({ 
                                ...novaAcao, 
                                competencia: value,
                                pilar: competencia?.pilar 
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar competência" />
                            </SelectTrigger>
                            <SelectContent>
                              {todasCompetencias.map((comp, index) => (
                                <SelectItem key={index} value={comp.nome}>
                                  {comp.nome} ({comp.pilar.split(' ').slice(0, 3).join(' ')})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Subtarefas por categoria */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Subtarefas por Categoria</h3>
                      
                      {/* Treinamento e Aprendizado */}
                      <Card className="p-4 border-blue-200 bg-blue-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-blue-800">Treinamento e Aprendizado</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAdicionarSubtarefa('treinamento')}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(novaAcao.subtarefas || [])
                            .filter(st => st.categoria === 'treinamento')
                            .map((subtarefa, index) => (
                            <div key={subtarefa.id} className="flex gap-2">
                              <Input
                                value={subtarefa.titulo}
                                onChange={(e) => {
                                  const subtarefas = [...(novaAcao.subtarefas || [])];
                                  const idx = subtarefas.findIndex(st => st.id === subtarefa.id);
                                  subtarefas[idx] = { ...subtarefa, titulo: e.target.value };
                                  setNovaAcao({ ...novaAcao, subtarefas });
                                }}
                                placeholder="Ex: Curso online de Excel avançado"
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoverSubtarefa(subtarefa.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Mentoria e Orientação */}
                      <Card className="p-4 border-green-200 bg-green-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-green-800">Mentoria e Orientação</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAdicionarSubtarefa('mentoria')}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(novaAcao.subtarefas || [])
                            .filter(st => st.categoria === 'mentoria')
                            .map((subtarefa) => (
                            <div key={subtarefa.id} className="flex gap-2">
                              <Input
                                value={subtarefa.titulo}
                                onChange={(e) => {
                                  const subtarefas = [...(novaAcao.subtarefas || [])];
                                  const idx = subtarefas.findIndex(st => st.id === subtarefa.id);
                                  subtarefas[idx] = { ...subtarefa, titulo: e.target.value };
                                  setNovaAcao({ ...novaAcao, subtarefas });
                                }}
                                placeholder="Ex: Sessões mensais com mentor sênior"
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoverSubtarefa(subtarefa.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Experiência Prática */}
                      <Card className="p-4 border-orange-200 bg-orange-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-orange-800">Experiência Prática</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAdicionarSubtarefa('experiencia')}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(novaAcao.subtarefas || [])
                            .filter(st => st.categoria === 'experiencia')
                            .map((subtarefa) => (
                            <div key={subtarefa.id} className="flex gap-2">
                              <Input
                                value={subtarefa.titulo}
                                onChange={(e) => {
                                  const subtarefas = [...(novaAcao.subtarefas || [])];
                                  const idx = subtarefas.findIndex(st => st.id === subtarefa.id);
                                  subtarefas[idx] = { ...subtarefa, titulo: e.target.value };
                                  setNovaAcao({ ...novaAcao, subtarefas });
                                }}
                                placeholder="Ex: Liderar projeto piloto de inovação"
                                className="flex-1"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoverSubtarefa(subtarefa.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={handleFecharDialog}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCriarAcao}>
                        {acaoEditando ? 'Atualizar' : 'Criar'} Ação
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="p-4 bg-gray-100 border-gray-300">
                <h4 className="font-medium mb-2">Debug Info:</h4>
                <p className="text-sm">Total de ações: {acoes.length}</p>
                <p className="text-sm">Não iniciado: {acoesPorStatus['nao-iniciado'].length}</p>
                <p className="text-sm">Em andamento: {acoesPorStatus['em-andamento'].length}</p>
                <p className="text-sm">Concluído: {acoesPorStatus['concluido'].length}</p>
              </Card>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Não Iniciado */}
              <DroppableColumn
                status="nao-iniciado"
                titulo="Não Iniciado"
                cor="red"
                acoes={acoesPorStatus['nao-iniciado']}
                onDrop={handleMoverAcao}
                onEdit={handleEditarAcao}
                onDelete={handleDeletarAcao}
              />

              {/* Em Andamento */}
              <DroppableColumn
                status="em-andamento"
                titulo="Em Andamento"
                cor="yellow"
                acoes={acoesPorStatus['em-andamento']}
                onDrop={handleMoverAcao}
                onEdit={handleEditarAcao}
                onDelete={handleDeletarAcao}
              />

              {/* Concluído */}
              <DroppableColumn
                status="concluido"
                titulo="Concluído"
                cor="green"
                acoes={acoesPorStatus['concluido']}
                onDrop={handleMoverAcao}
                onEdit={handleEditarAcao}
                onDelete={handleDeletarAcao}
              />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nota Geral por Pilar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosPilares}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pilar" angle={-45} textAnchor="end" height={100} fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nivel">
                        {dadosPilares.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={niveis[entry.classificacao as keyof typeof niveis].cor} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pontuação por Competência</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="competencia" angle={-45} textAnchor="end" height={100} fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="nivel">
                        {dadosGrafico.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={niveis[entry.classificacao as keyof typeof niveis].cor} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição das Classificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribuicao}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribuicao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análise SWOT</CardTitle>
                <CardDescription>Distribuição estratégica das competências por força, oportunidades, fraquezas e ameaças</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Pontos Positivos */}
                  <Card className="p-4 border-green-200 bg-green-50">
                    <h4 className="font-medium text-lg mb-4 text-center text-green-800">
                      Pontos Positivos
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={dadosSWOTPositivos}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosSWOTPositivos.map((entry, index) => (
                            <Cell key={`cell-positivo-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} competências`,
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 text-center text-sm text-green-700">
                      <strong>Total: {dadosSWOTPositivos.reduce((acc, item) => acc + item.value, 0)} competências</strong>
                    </div>
                  </Card>

                  {/* Pontos de Melhoria */}
                  <Card className="p-4 border-orange-200 bg-orange-50">
                    <h4 className="font-medium text-lg mb-4 text-center text-orange-800">
                      Pontos de Melhoria
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={dadosSWOTMelhorias}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dadosSWOTMelhorias.map((entry, index) => (
                            <Cell key={`cell-melhoria-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} competências`,
                            name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 text-center text-sm text-orange-700">
                      <strong>Total: {dadosSWOTMelhorias.reduce((acc, item) => acc + item.value, 0)} competências</strong>
                    </div>
                  </Card>
                </div>

                {/* Detalhamento SWOT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 border-blue-200 bg-blue-50">
                    <h5 className="font-medium text-blue-800 mb-2">Forças ({swotData.forcas.length})</h5>
                    <p className="text-xs text-blue-600 mb-2">Competências que "Mudam o jogo"</p>
                    <div className="space-y-1">
                      {swotData.forcas.slice(0, 3).map((comp, index) => (
                        <p key={index} className="text-xs text-blue-700 truncate">
                          • {comp.competencia}
                        </p>
                      ))}
                      {swotData.forcas.length > 3 && (
                        <p className="text-xs text-blue-500">+ {swotData.forcas.length - 3} mais...</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4 border-green-200 bg-green-50">
                    <h5 className="font-medium text-green-800 mb-2">Oportunidades ({swotData.oportunidades.length})</h5>
                    <p className="text-xs text-green-600 mb-2">Competências que "Fazem Bonito"</p>
                    <div className="space-y-1">
                      {swotData.oportunidades.slice(0, 3).map((comp, index) => (
                        <p key={index} className="text-xs text-green-700 truncate">
                          • {comp.competencia}
                        </p>
                      ))}
                      {swotData.oportunidades.length > 3 && (
                        <p className="text-xs text-green-500">+ {swotData.oportunidades.length - 3} mais...</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4 border-yellow-200 bg-yellow-50">
                    <h5 className="font-medium text-yellow-800 mb-2">Fraquezas ({swotData.fraquezas.length})</h5>
                    <p className="text-xs text-yellow-600 mb-2">Competências que "Podem Mais"</p>
                    <div className="space-y-1">
                      {swotData.fraquezas.slice(0, 3).map((comp, index) => (
                        <p key={index} className="text-xs text-yellow-700 truncate">
                          • {comp.competencia}
                        </p>
                      ))}
                      {swotData.fraquezas.length > 3 && (
                        <p className="text-xs text-yellow-500">+ {swotData.fraquezas.length - 3} mais...</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4 border-red-200 bg-red-50">
                    <h5 className="font-medium text-red-800 mb-2">Ameaças ({swotData.ameacas.length})</h5>
                    <p className="text-xs text-red-600 mb-2">Competências que "Precisam Agir"</p>
                    <div className="space-y-1">
                      {swotData.ameacas.slice(0, 3).map((comp, index) => (
                        <p key={index} className="text-xs text-red-700 truncate">
                          • {comp.competencia}
                        </p>
                      ))}
                      {swotData.ameacas.length > 3 && (
                        <p className="text-xs text-red-500">+ {swotData.ameacas.length - 3} mais...</p>
                      )}
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gráficos por Pilar</CardTitle>
                <CardDescription>Barras simples de 0 a 5 mostrando competências ou comportamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dadosBarrasVerticais.map((pilar, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium text-base mb-3 text-center">
                        {pilar.essencia.split(' ').slice(0, 4).join(' ')}
                        {pilar.essencia.split(' ').length > 4 && '...'}
                      </h4>
                      
                      <div className="mb-3 text-center">
                        <Badge 
                          style={{ 
                            backgroundColor: niveis[processados[index].classePilar as keyof typeof niveis].cor,
                            color: 'white'
                          }}
                          className="text-xs"
                        >
                          {processados[index].classePilar} ({processados[index].mediaPilar.toFixed(1)})
                        </Badge>
                      </div>
                      
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          data={pilar.dados}
                          margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="nome" 
                            angle={-45} 
                            textAnchor="end" 
                            height={60}
                            fontSize={10}
                          />
                          <YAxis 
                            domain={[0, 5]}
                            tick={{fontSize: 10}}
                          />
                          <Tooltip 
                            formatter={(value) => [
                              `${Number(value).toFixed(1)} pontos`,
                              pilar.tipo === 'comportamentos' ? 'Frequência' : 'Competência'
                            ]}
                          />
                          <Bar 
                            dataKey="valor" 
                            radius={[4, 4, 0, 0]}
                          >
                            {pilar.dados.map((entry, entryIndex) => (
                              <Cell 
                                key={`cell-${entryIndex}`} 
                                fill={entry.cor} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      
                      <div className="mt-2 text-center text-xs text-gray-600">
                        {pilar.tipo === 'comportamentos' 
                          ? `${pilar.dados.length} comportamentos`
                          : `${pilar.dados.length} competências`
                        }
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mecanica" className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Como Funciona o Sistema</CardTitle>
                <CardDescription>Mapeamento completo: Frequência → Pontos → Classificação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 bg-white border-2 border-blue-200">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: "#32B3FC" }}></div>
                      <h4 className="font-semibold">Sempre</h4>
                      <p className="text-2xl font-bold text-blue-600">4 pontos</p>
                      <p className="text-sm font-medium" style={{ color: "#32B3FC" }}>Muda o jogo</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-2 border-green-200">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: "#47CF86" }}></div>
                      <h4 className="font-semibold">Frequentemente</h4>
                      <p className="text-2xl font-bold text-green-600">3 pontos</p>
                      <p className="text-sm font-medium" style={{ color: "#47CF86" }}>Faz Bonito</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-2 border-yellow-200">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: "#F6C61E" }}></div>
                      <h4 className="font-semibold">Eventualmente</h4>
                      <p className="text-2xl font-bold text-yellow-600">2 pontos</p>
                      <p className="text-sm font-medium" style={{ color: "#F6C61E" }}>Pode Mais</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-2 border-red-200">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: "#F66363" }}></div>
                      <h4 className="font-semibold">Nunca</h4>
                      <p className="text-2xl font-bold text-red-600">1 ponto</p>
                      <p className="text-sm font-medium" style={{ color: "#F66363" }}>Precisa Agir</p>
                    </div>
                  </Card>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Limiares de Classificação Final</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <span className="font-medium text-sm">Muda o Jogo</span>
                        <p className="text-xs text-gray-600">{"> 3,5"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <span className="font-medium text-sm">Faz Bonito</span>
                        <p className="text-xs text-gray-600">3,0 - 3,5</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div>
                        <span className="font-medium text-sm">Pode Mais</span>
                        <p className="text-xs text-gray-600">2,0 - 2,99</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div>
                        <span className="font-medium text-sm">Precisa Agir</span>
                        <p className="text-xs text-gray-600">{"< 2,0"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Exemplos Práticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white">
                    <h4 className="font-semibold mb-2">Competência com 3 comportamentos</h4>
                    <div className="space-y-1 text-sm">
                      <p>Sempre (4) + Frequentemente (3) + Sempre (4) = 11 pontos</p>
                      <p className="font-medium">Média: 11 ÷ 3 = 3,67 → <span style={{ color: "#32B3FC" }}>Muda o jogo</span></p>
                    </div>
                  </Card>
                  
                  <Card className="p-4 bg-white">
                    <h4 className="font-semibold mb-2">Competência com 4 comportamentos</h4>
                    <div className="space-y-1 text-sm">
                      <p>Freq (3) + Freq (3) + Event (2) + Event (2) = 10 pontos</p>
                      <p className="font-medium">Média: 10 ÷ 4 = 2,5 → <span style={{ color: "#F6C61E" }}>Pode Mais</span></p>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Interpretação das Barras</CardTitle>
                <CardDescription>Visualização focada na classificação obtida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="w-full mb-2">
                      <ProgressWithColor value={12} color="#F66363" showProgressLine={true} classificacao="Precisa Agir" />
                    </div>
                    <p className="text-xs text-gray-600">Apenas a seção correspondente fica colorida</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="w-full mb-2">
                      <ProgressWithColor value={37} color="#F6C61E" showProgressLine={true} classificacao="Pode Mais" />
                    </div>
                    <p className="text-xs text-gray-600">A linha preta indica a posição exata</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="w-full mb-2">
                      <ProgressWithColor value={62} color="#47CF86" showProgressLine={true} classificacao="Faz Bonito" />
                    </div>
                    <p className="text-xs text-gray-600">Facilita identificação rápida</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="w-full mb-2">
                      <ProgressWithColor value={87} color="#32B3FC" showProgressLine={true} classificacao="Muda o jogo" />
                    </div>
                    <p className="text-xs text-gray-600">Outras seções ficam em cinza</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </DndProvider>
  );
}