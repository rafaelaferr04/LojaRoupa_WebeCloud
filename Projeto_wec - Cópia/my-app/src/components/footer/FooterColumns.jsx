/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom'

export function FooterColumns() {
  return (
    <div className="footer-columns">
      <section className="footer-column">
        <h4>Apoio ao cliente</h4>
        <ul>
          <li>
            <Link to="/estado-da-encomenda">Estado da Encomenda</Link>
          </li>
          <li>
            <Link to="/envios-e-entregas">Envios e Entregas</Link>
          </li>
          <li>
            <Link to="/devolucoes">Devoluções</Link>
          </li>
          <li>
            <Link to="/contacte-nos">Contacte-nos</Link>
          </li>
        </ul>
      </section>

      <section className="footer-column">
        <h4>A empresa</h4>
        <ul>
          <li>
            <Link to="/a-nossa-historia">A Nossa História</Link>
          </li>
          <li>
            <Link to="/carreiras">Carreiras</Link>
          </li>
          <li>
            <Link to="/sustentabilidade">Sustentabilidade</Link>
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
        text: 'A nossa equipa prepara os artigos em 1 a 2 dias utéis e verifica tamanhos, quantidades e embalagem antes do envio.',
      },
      {
        title: 'Acompanhamento',
        text: 'Quando a encomenda sai do armazém, enviamos a referência de tracking para acompanhar a transportadora.',
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
        text: 'As encomendas standard sao preparadas em 1 a 2 dias utéis e entregues normalmente entre 2 e 5 dias utéis em Portugal continental.',
      },
      {
        title: 'Custos e entrega gratuita',
        text: 'A entrega e gratuita em encomendas superiores a 150 EUR. Para valores inferiores, o custo e calculado no checkout antes da confirmação.',
      },
      {
        title: 'Acompanhamento',
        text: 'Depois do envio, recebe um email com o estado da encomenda e a referência de acompanhamento da transportadora.',
      },
    ],
  },
  {
    path: '/devolucoes',
    eyebrow: 'Apoio ao cliente',
    title: 'Devoluções',
    description: 'Pode devolver artigos que não tenham sido usados e estejam na embalagem original.',
    sections: [
      {
        title: 'Periodo de devolução',
        text: 'Aceitamos devoluções até 30 dias após a receção da encomenda, desde que os artigos estejam sem sinais de uso.',
      },
      {
        title: 'Como devolver',
        text: 'Entre em contacto com a equipa de apoio, indique o número da encomenda e os artigos a devolver. Enviamos as instruções por email.',
      },
      {
        title: 'Reembolso',
        text: 'O reembolso e processado pelo mesmo metodo de pagamento apos validação dos artigos devolvidos.',
      },
    ],
  },
  {
    path: '/contacte-nos',
    eyebrow: 'Apoio ao cliente',
    title: 'Contacte-nos',
    description: 'Estamos disponíveis para ajudar com encomendas, produtos, tamanhos e sugestões.',
    sections: [
      {
        title: 'Email',
        text: 'Envie a sua mensagem para apoio@atelierwec.pt. Respondemos normalmente em 1 dia útil.',
      },
      {
        title: 'Horário',
        text: 'Segunda a sexta, das 9h00 as 18h00. Aos fins de semana, acompanhamos apenas pedidos urgentes.',
      },
      {
        title: 'Informação útil',
        text: 'Para pedidos sobre encomendas, inclua o número da encomenda e o email usado na compra.',
      },
    ],
  },
  {
    path: '/a-nossa-historia',
    eyebrow: 'A empresa',
    title: 'A nossa história',
    description: 'O Atelier WEC nasceu para reunir roupa, acessórios e objetos de casa com uma seleção cuidada.',
    sections: [
      {
        title: 'Origem',
        text: 'Começamos com uma ideia simples: criar uma loja de moda com navegação clara, produtos bem apresentados e coleções fáceis de combinar.',
      },
      {
        title: 'O que defendemos',
        text: 'Valorizamos materiais confortáveis, cortes atuais, informação transparente e uma experiência de compra direta.',
      },
      {
        title: 'Hoje',
        text: 'A loja evolui com novas categorias, filtros, favoritos e carrinho para simular uma experiência de ecommerce completa.',
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
        text: 'Trabalhamos em produto, fotografia, conteúdo, apoio ao cliente, tecnologia, logística e gestão de loja.',
      },
      {
        title: 'Perfil',
        text: 'Valorizamos rigor, boa comunicação, autonomia e atenção ao detalhe em cada ponto da experiência do cliente.',
      },
      {
        title: 'Candidaturas',
        text: 'Envie o seu CV e portfólio, quando aplicável, para carreiras@atelierwec.pt com a área de interesse no assunto.',
      },
    ],
  },
  {
    path: '/sustentabilidade',
    eyebrow: 'A empresa',
    title: 'Sustentabilidade',
    description: 'Trabalhamos para reduzir desperdício, escolher melhor e prolongar a vida útil dos produtos.',
    sections: [
      {
        title: 'Seleção de produto',
        text: 'Damos prioridade a peças versáteis, duráveis e fáceis de integrar no guarda-roupa ou na casa ao longo do tempo.',
      },
      {
        title: 'Embalagem',
        text: 'Procuramos reduzir volumes desnecessários e usar materiais recicláveis sempre que possível.',
      },
      {
        title: 'Responsabilidade',
        text: 'Incentivamos compras pensadas, cuidados de manutenção e devoluções responsáveis para diminuir desperdício.',
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
        text: 'Usamos apenas os dados necessários para simular conta, carrinho, favoritos e comunicações da loja neste projeto.',
      },
      {
        title: 'Finalidade',
        text: 'A informação serve para melhorar a experiência de compra, guardar preferências e preparar encomendas.',
      },
      {
        title: 'Controlo',
        text: 'Pode limpar dados locais do browser, terminar sessão ou contactar-nos para esclarecer qualquer questão sobre privacidade.',
      },
    ],
  },
  {
    path: '/termos',
    eyebrow: 'Legal',
    title: 'Termos',
    description: 'Condições gerais de utilização da loja e da experiência de compra online.',
    sections: [
      {
        title: 'Utilização da loja',
        text: 'A navegação deve ser feita de forma responsável, respeitando informação de produtos, preços e disponibilidade apresentados.',
      },
      {
        title: 'Encomendas',
        text: 'A confirmação da compra resume artigos, quantidades, morada e método de pagamento antes da finalização.',
      },
      {
        title: 'Alterações',
        text: 'Os conteúdos, coleções e condições podem ser atualizados para refletir melhorias na experiência de compra.',
      },
    ],
  },
  {
    path: '/cookies',
    eyebrow: 'Legal',
    title: 'Cookies',
    description: 'Informação sobre dados locais usados para manter a loja funcional durante a navegação.',
    sections: [
      {
        title: 'Dados locais',
        text: 'O projeto usa armazenamento local para guardar carrinho, favoritos e conta no browser.',
      },
      {
        title: 'Preferências',
        text: 'Estes dados ajudam a manter artigos guardados quando muda de página ou regressa mais tarde.',
      },
      {
        title: 'Gestão',
        text: 'Pode apagar estes dados nas definições do browser ou usando as opções de limpeza da própria loja.',
      },
    ],
  },
]

