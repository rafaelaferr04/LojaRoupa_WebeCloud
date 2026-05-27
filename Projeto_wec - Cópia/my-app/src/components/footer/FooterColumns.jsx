/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom'

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function FooterColumns() {
  function handleFooterLinkClick() {
    requestAnimationFrame(() => scrollToPageTop())
  }

  return (
    <div className="footer-columns">
      <section className="footer-column">
        <h4>Apoio ao cliente</h4>
        <ul>
          <li>
            <Link to="/estado-da-encomenda" onClick={handleFooterLinkClick}>Estado da Encomenda</Link>
          </li>
          <li>
            <Link to="/envios-e-entregas" onClick={handleFooterLinkClick}>Envios e Entregas</Link>
          </li>
          <li>
            <Link to="/devolucoes" onClick={handleFooterLinkClick}>Devolucoes</Link>
          </li>
          <li>
            <Link to="/contacte-nos" onClick={handleFooterLinkClick}>Contacte-nos</Link>
          </li>
        </ul>
      </section>

      <section className="footer-column">
        <h4>A empresa</h4>
        <ul>
          <li>
            <Link to="/a-nossa-historia" onClick={handleFooterLinkClick}>A Nossa Historia</Link>
          </li>
          <li>
            <Link to="/carreiras" onClick={handleFooterLinkClick}>Carreiras</Link>
          </li>
          <li>
            <Link to="/sustentabilidade" onClick={handleFooterLinkClick}>Sustentabilidade</Link>
          </li>
        </ul>
      </section>

      <section className="footer-column social">
        <h4>Siga-nos</h4>
        <div className="social-icons">
          <a href="https://www.instagram.com/atlierwec">IG</a>
          <a href="https://pin.it/48XgvxCjN">PT</a>
        </div>
      </section>
    </div>
  )
}

export const footerPages = [
  {
    path: '/estado-da-encomenda',
    eyebrow: 'Apoio ao cliente',
    title: 'Estado da Encomenda',
    description: 'Acompanhe o estado da sua compra e saiba o que acontece em cada fase da entrega.',
    sections: [
      {
        title: 'Depois da compra',
        text: 'Assim que a encomenda e confirmada, recebe um email com o resumo dos artigos, morada e metodo de entrega.',
      },
      {
        title: 'Preparacao',
        text: 'A nossa equipa prepara os artigos em 1 a 2 dias uteis e verifica tamanhos, quantidades e embalagem antes do envio.',
      },
      {
        title: 'Acompanhamento',
        text: 'Quando a encomenda sai do armazem, enviamos a referencia de tracking para acompanhar a transportadora.',
      },
    ],
  },
  {
    path: '/envios-e-entregas',
    eyebrow: 'Apoio ao cliente',
    title: 'Envios e entregas',
    description: 'Tudo o que precisa de saber sobre prazos, custos e acompanhamento da sua encomenda.',
    sections: [
      {
        title: 'Prazos de entrega',
        text: 'As encomendas standard sao preparadas em 1 a 2 dias uteis e entregues normalmente entre 2 e 5 dias uteis em Portugal continental.',
      },
      {
        title: 'Custos e entrega gratuita',
        text: 'A entrega e gratuita em encomendas superiores a 150 EUR. Para valores inferiores, o custo e calculado no checkout antes da confirmacao.',
      },
      {
        title: 'Acompanhamento',
        text: 'Depois do envio, recebe um email com o estado da encomenda e a referencia de acompanhamento da transportadora.',
      },
    ],
  },
  {
    path: '/devolucoes',
    eyebrow: 'Apoio ao cliente',
    title: 'Devolucoes',
    description: 'Pode devolver artigos que nao tenham sido usados e estejam na embalagem original.',
    sections: [
      {
        title: 'Periodo de devolucao',
        text: 'Aceitamos devolucoes ate 30 dias apos a rececao da encomenda, desde que os artigos estejam sem sinais de uso.',
      },
      {
        title: 'Como devolver',
        text: 'Entre em contacto com a equipa de apoio, indique o numero da encomenda e os artigos a devolver. Enviamos as instrucoes por email.',
      },
      {
        title: 'Reembolso',
        text: 'O reembolso e processado pelo mesmo metodo de pagamento apos validacao dos artigos devolvidos.',
      },
    ],
  },
  {
    path: '/contacte-nos',
    eyebrow: 'Apoio ao cliente',
    title: 'Contacte-nos',
    description: 'Estamos disponiveis para ajudar com encomendas, produtos, tamanhos e sugestoes.',
    sections: [
      {
        title: 'Email',
        text: 'Envie a sua mensagem para apoio@atelierwec.pt. Respondemos normalmente em 1 dia util.',
      },
      {
        title: 'Horario',
        text: 'Segunda a sexta, das 9h00 as 18h00. Aos fins de semana, acompanhamos apenas pedidos urgentes.',
      },
      {
        title: 'Informacao util',
        text: 'Para pedidos sobre encomendas, inclua o numero da encomenda e o email usado na compra.',
      },
    ],
  },
  {
    path: '/a-nossa-historia',
    eyebrow: 'A empresa',
    title: 'A nossa historia',
    description: 'O Atelier WEC nasceu para reunir roupa, acessorios e objetos de casa com uma selecao cuidada.',
    sections: [
      {
        title: 'Origem',
        text: 'Comecamos com uma ideia simples: criar uma loja de moda com navegacao clara, produtos bem apresentados e colecoes faceis de combinar.',
      },
      {
        title: 'O que defendemos',
        text: 'Valorizamos materiais confortaveis, cortes atuais, informacao transparente e uma experiencia de compra direta.',
      },
      {
        title: 'Hoje',
        text: 'A loja evolui com novas categorias, filtros, favoritos e carrinho para simular uma experiencia de ecommerce completa.',
      },
    ],
  },
  {
    path: '/carreiras',
    eyebrow: 'A empresa',
    title: 'Carreiras',
    description: 'Procuramos pessoas com gosto por moda, produto, design, atendimento e operacoes digitais.',
    sections: [
      {
        title: 'Areas',
        text: 'Trabalhamos em produto, fotografia, conteudo, apoio ao cliente, tecnologia, logistica e gestao de loja.',
      },
      {
        title: 'Perfil',
        text: 'Valorizamos rigor, boa comunicacao, autonomia e atencao ao detalhe em cada ponto da experiencia do cliente.',
      },
      {
        title: 'Candidaturas',
        text: 'Envie o seu CV e portfolio, quando aplicavel, para carreiras@atelierwec.pt com a area de interesse no assunto.',
      },
    ],
  },
  {
    path: '/sustentabilidade',
    eyebrow: 'A empresa',
    title: 'Sustentabilidade',
    description: 'Trabalhamos para reduzir desperdicio, escolher melhor e prolongar a vida util dos produtos.',
    sections: [
      {
        title: 'Selecao de produto',
        text: 'Damos prioridade a pecas versateis, duraveis e faceis de integrar no guarda-roupa ou na casa ao longo do tempo.',
      },
      {
        title: 'Embalagem',
        text: 'Procuramos reduzir volumes desnecessarios e usar materiais reciclaveis sempre que possivel.',
      },
      {
        title: 'Responsabilidade',
        text: 'Incentivamos compras pensadas, cuidados de manutencao e devolucoes responsaveis para diminuir desperdicio.',
      },
    ],
  },
  {
    path: '/privacidade',
    eyebrow: 'Legal',
    title: 'Privacidade',
    description: 'Saiba como tratamos dados pessoais e protegemos a informacao usada na loja.',
    sections: [
      {
        title: 'Dados recolhidos',
        text: 'Usamos apenas os dados necessarios para simular conta, carrinho, favoritos e comunicacoes da loja neste projeto.',
      },
      {
        title: 'Finalidade',
        text: 'A informacao serve para melhorar a experiencia de compra, guardar preferencias e preparar encomendas.',
      },
      {
        title: 'Controlo',
        text: 'Pode limpar dados locais do browser, terminar sessao ou contactar-nos para esclarecer qualquer questao sobre privacidade.',
      },
    ],
  },
  {
    path: '/termos',
    eyebrow: 'Legal',
    title: 'Termos',
    description: 'Condicoes gerais de utilizacao da loja e da experiencia de compra online.',
    sections: [
      {
        title: 'Utilizacao da loja',
        text: 'A navegacao deve ser feita de forma responsavel, respeitando informacao de produtos, precos e disponibilidade apresentados.',
      },
      {
        title: 'Encomendas',
        text: 'A confirmacao da compra resume artigos, quantidades, morada e metodo de pagamento antes da finalizacao.',
      },
      {
        title: 'Alteracoes',
        text: 'Os conteudos, colecoes e condicoes podem ser atualizados para refletir melhorias na experiencia de compra.',
      },
    ],
  },
  {
    path: '/cookies',
    eyebrow: 'Legal',
    title: 'Cookies',
    description: 'Informacao sobre dados locais usados para manter a loja funcional durante a navegacao.',
    sections: [
      {
        title: 'Dados locais',
        text: 'O projeto usa armazenamento local para guardar carrinho, favoritos e conta no browser.',
      },
      {
        title: 'Preferencias',
        text: 'Estes dados ajudam a manter artigos guardados quando muda de pagina ou regressa mais tarde.',
      },
      {
        title: 'Gestao',
        text: 'Pode apagar estes dados nas definicoes do browser ou usando as opcoes de limpeza da propria loja.',
      },
    ],
  },
]
